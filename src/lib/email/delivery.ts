import { Prisma, type EmailDelivery, type EmailDeliveryStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { SAFE_ERROR, getEmailConfig, isEmail, sendEmail, type EmailConfig, type EmailErrorCode } from "./provider";
import { renderEmail } from "./templates";
import { genericEmail } from "./layout";

export const MAX_ATTEMPTS = 5;

export interface DeliverInput {
  templateKey: string; to: string; subject: string; html: string; text: string; replyTo?: string | null;
  entityType?: string; entityId?: string;
  /** Unique per logical email: a second call with the same key never sends again (retried API calls, double submits). */
  dedupeKey?: string;
  /** Which on/off switch governs this email. `null` = always attempted (tests, system mail). Ignored for manual retries. */
  toggle?: "internal" | "visitor" | null;
  manual?: boolean;
  /** Admin "Send test email": allowed while delivery is still switched off, as long as a key and From address exist. */
  testMode?: boolean;
  /** Existing row to update (manual retry) instead of creating a new one. */
  existingId?: string;
}
export interface DeliverResult { id: string; status: EmailDeliveryStatus; errorCode: string | null; errorMessage: string | null; duplicate?: boolean }

const result = (r: EmailDelivery, duplicate = false): DeliverResult => ({ id: r.id, status: r.status, errorCode: r.errorCode, errorMessage: r.errorMessage, duplicate });

function skipReason(input: DeliverInput, cfg: EmailConfig): EmailErrorCode | null {
  if (!isEmail(input.to)) return "INVALID_RECIPIENT";
  if (!cfg.configured) return "NOT_CONFIGURED";
  if (!cfg.enabled) return "DISABLED";
  if (!input.manual && input.toggle === "internal" && !cfg.sendInternalNotification) return "TOGGLE_OFF";
  if (!input.manual && input.toggle === "visitor" && !cfg.sendVisitorConfirmation) return "TOGGLE_OFF";
  return null;
}

/**
 * Records and (when allowed) sends one email. NEVER throws and never touches the lead/submission transaction:
 * callers invoke it only after their database work has been committed.
 */
export async function deliver(input: DeliverInput): Promise<DeliverResult> {
  try {
    if (input.dedupeKey && !input.existingId) {
      const existing = await prisma.emailDelivery.findUnique({ where: { dedupeKey: input.dedupeKey } });
      if (existing) return result(existing, true);
    }
    const loaded = await getEmailConfig();
    const cfg = input.testMode ? { ...loaded, enabled: loaded.configured } : loaded;
    const base = { templateKey: input.templateKey, recipient: input.to.slice(0, 320) || "(none)", subject: input.subject.slice(0, 300), entityType: input.entityType, entityId: input.entityId };
    let row: EmailDelivery;
    if (input.existingId) {
      row = await prisma.emailDelivery.update({ where: { id: input.existingId }, data: { ...base, status: "QUEUED", errorCode: null, errorMessage: null, attempts: { increment: 1 } } });
    } else {
      try {
        row = await prisma.emailDelivery.create({ data: { ...base, status: "QUEUED", dedupeKey: input.dedupeKey } });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && input.dedupeKey) {
          const existing = await prisma.emailDelivery.findUnique({ where: { dedupeKey: input.dedupeKey } });
          if (existing) return result(existing, true);
        }
        throw e;
      }
    }
    const skip = skipReason(input, cfg);
    if (skip) {
      return result(await prisma.emailDelivery.update({ where: { id: row.id }, data: { status: "SKIPPED", errorCode: skip, errorMessage: SAFE_ERROR[skip] } }));
    }
    const sent = await sendEmail({ to: input.to, subject: input.subject, html: input.html, text: input.text, replyTo: input.replyTo, tags: [{ name: "template", value: input.templateKey }] }, cfg);
    return result(await prisma.emailDelivery.update({
      where: { id: row.id },
      data: sent.ok ? { status: "SENT", sentAt: new Date(), providerMessageId: sent.messageId, errorCode: null, errorMessage: null } : { status: "FAILED", errorCode: sent.code, errorMessage: sent.message },
    }));
  } catch (e) {
    console.error("[email] delivery bookkeeping failed:", e instanceof Error ? e.message : "unknown");
    return { id: "", status: "FAILED", errorCode: "PROVIDER_ERROR", errorMessage: SAFE_ERROR.PROVIDER_ERROR };
  }
}

/** System templates (invites, notices, approvals, newsletter): admin-editable plain copy in the generic branded layout. */
export async function sendTemplatedEmail(key: string, to: string, vars: Record<string, unknown>, entity?: { type: string; id: string }): Promise<{ sent: boolean; error?: string }> {
  try {
    const mail = await renderEmail(key, { siteName: "KASH Technology", ...vars });
    const body = genericEmail(mail.subject, mail.text);
    const r = await deliver({ templateKey: key, to, subject: mail.subject, html: body.html, text: body.text, entityType: entity?.type, entityId: entity?.id, toggle: null });
    return r.status === "SENT" ? { sent: true } : { sent: false, error: r.errorMessage ?? undefined };
  } catch {
    return { sent: false, error: "Email error" };
  }
}
