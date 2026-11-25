import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { rateLimit } from "@/lib/server/rate-limit";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { encrypt } from "@/lib/auth/crypto";
import { deliver } from "./delivery";
import { testEmail } from "./layout";
import { getDomainStatus, getEmailConfig, isEmail } from "./provider";

const addr = z.union([z.literal(""), z.string().trim().toLowerCase().max(320).refine(isEmail, "Enter a valid email address")]).transform((v) => v || null);
export const emailSettingsSchema = z.object({
  enabled: z.boolean().optional(), sendVisitorConfirmation: z.boolean().optional(), sendInternalNotification: z.boolean().optional(),
  fromName: z.string().trim().max(80).regex(/^[^\r\n<>"]*$/, "Name contains invalid characters").transform((v) => v || null).optional(),
  fromEmail: addr.optional(), replyToEmail: addr.optional(), internalRecipient: addr.optional(), visitorReplyEmail: addr.optional(), testRecipient: addr.optional(),
}).strict();
export const apiKeySchema = z.object({ apiKey: z.string().trim().regex(/^re_[A-Za-z0-9_-]{16,200}$/, "That doesn't look like a Resend API key (it starts with re_)") }).strict();

/** The ONLY shape that ever reaches a browser: no key, no ciphertext, just whether one exists and its last 4 characters. */
export async function viewSettings(actor: Actor) {
  assertCan(actor, "email_settings.view");
  const [row, cfg] = await Promise.all([prisma.emailSettings.findUnique({ where: { id: "default" } }), getEmailConfig()]);
  return {
    provider: "resend",
    enabled: row?.enabled ?? cfg.enabled,
    sendVisitorConfirmation: cfg.sendVisitorConfirmation, sendInternalNotification: cfg.sendInternalNotification,
    fromName: row?.fromName ?? cfg.fromName, fromEmail: row?.fromEmail ?? cfg.fromEmail ?? "",
    replyToEmail: row?.replyToEmail ?? "", internalRecipient: row?.internalRecipient ?? cfg.internalRecipient, visitorReplyEmail: row?.visitorReplyEmail ?? "", testRecipient: row?.testRecipient ?? "",
    apiKey: { configured: !!cfg.apiKey, source: cfg.apiKeySource, lastFour: cfg.apiKey ? cfg.apiKeyLast4 : null },
    envFallback: { fromEmail: !row?.fromEmail && !!cfg.fromEmail, apiKey: cfg.apiKeySource === "environment" },
  };
}

export async function saveSettings(actor: Actor, input: z.infer<typeof emailSettingsSchema>) {
  assertCan(actor, "email_settings.manage");
  const before = await prisma.emailSettings.findUnique({ where: { id: "default" } });
  const data = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
  await prisma.$transaction(async (tx) => {
    await tx.emailSettings.upsert({ where: { id: "default" }, update: { ...data, updatedById: actor.id }, create: { id: "default", ...data, updatedById: actor.id } });
    const a = (action: string, metadata?: Record<string, unknown>) => auditTx(tx, { actorId: actor.id, action, entity: "EmailSettings", entityId: "default", metadata: metadata as never });
    if (input.enabled !== undefined && input.enabled !== (before?.enabled ?? false)) await a(input.enabled ? "email.enabled" : "email.disabled");
    if (input.fromEmail !== undefined && input.fromEmail !== (before?.fromEmail ?? null)) await a("email.from_changed");
    if (input.internalRecipient !== undefined && input.internalRecipient !== (before?.internalRecipient ?? null)) await a("email.internal_recipient_changed");
    const rest = Object.keys(data).filter((k) => !["enabled", "fromEmail", "internalRecipient"].includes(k));
    if (rest.length) await a("email.settings_updated", { fields: rest });
  });
  return viewSettings(actor);
}

export async function setApiKey(actor: Actor, input: z.infer<typeof apiKeySchema>) {
  assertCan(actor, "email_settings.manage");
  const had = !!(await prisma.emailSettings.findUnique({ where: { id: "default" }, select: { encryptedApiKey: true } }))?.encryptedApiKey;
  const encryptedApiKey = encrypt(input.apiKey), apiKeyLast4 = input.apiKey.slice(-4);
  await prisma.$transaction(async (tx) => {
    await tx.emailSettings.upsert({ where: { id: "default" }, update: { encryptedApiKey, apiKeyLast4, updatedById: actor.id }, create: { id: "default", encryptedApiKey, apiKeyLast4, updatedById: actor.id } });
    await auditTx(tx, { actorId: actor.id, action: "email.api_key_updated", entity: "EmailSettings", entityId: "default", metadata: { message: "Resend API key updated", replaced: had } });
  });
  return viewSettings(actor);
}

export async function removeApiKey(actor: Actor) {
  assertCan(actor, "email_settings.manage");
  await prisma.$transaction(async (tx) => {
    await tx.emailSettings.updateMany({ where: { id: "default" }, data: { encryptedApiKey: null, apiKeyLast4: null, updatedById: actor.id } });
    await auditTx(tx, { actorId: actor.id, action: "email.api_key_removed", entity: "EmailSettings", entityId: "default", metadata: { message: "Resend API key removed" } });
  });
  return viewSettings(actor);
}

export async function emailStatus(actor: Actor) {
  assertCan(actor, "email_settings.view");
  const cfg = await getEmailConfig();
  const [lastSent, lastFailed] = await Promise.all([
    prisma.emailDelivery.findFirst({ where: { status: "SENT" }, orderBy: { sentAt: "desc" }, select: { sentAt: true, templateKey: true } }),
    prisma.emailDelivery.findFirst({ where: { status: "FAILED" }, orderBy: { createdAt: "desc" }, select: { createdAt: true, errorCode: true, errorMessage: true, templateKey: true } }),
  ]);
  const failingNow = !!lastFailed && (!lastSent?.sentAt || lastFailed.createdAt > lastSent.sentAt);
  const state = !cfg.configured ? "not_configured" : !cfg.enabled ? "disabled" : failingNow ? "error" : "connected";
  return {
    state, provider: "Resend", from: cfg.from, internalRecipient: cfg.internalRecipient, apiKeySource: cfg.apiKeySource,
    lastSuccess: lastSent?.sentAt ?? null, lastFailure: lastFailed ? { at: lastFailed.createdAt, code: lastFailed.errorCode, message: lastFailed.errorMessage, template: lastFailed.templateKey } : null,
  };
}

export async function domainInfo(actor: Actor) {
  assertCan(actor, "email_settings.view");
  const cfg = await getEmailConfig();
  const domain = cfg.fromEmail?.split("@")[1] ?? "kash-technology.com";
  return { domain, ...(await getDomainStatus(domain, cfg)) };
}

export async function sendTest(actor: Actor, recipient: string) {
  assertCan(actor, "email_settings.manage");
  if (!isEmail(recipient)) throw new HttpError(400, "VALIDATION_ERROR", "Enter a valid recipient email address");
  if (!rateLimit(`email-test:${actor.id}`, 5, 10 * 60_000)) throw new HttpError(429, "RATE_LIMITED", "Too many test emails. Try again in a few minutes.");
  const cfg = await getEmailConfig();
  const subject = "KASH Technology — Email Configuration Test";
  const mail = testEmail({ provider: "Resend", environment: process.env.NODE_ENV === "production" ? "Production" : "Development", at: new Date(), fromEmail: cfg.fromEmail ?? "—" });
  const r = await deliver({ templateKey: "test", to: recipient, subject, html: mail.html, text: mail.text, replyTo: cfg.replyTo, entityType: "Test", testMode: true, toggle: null });
  await prisma.$transaction((tx) => auditTx(tx, { actorId: actor.id, action: "email.test_sent", entity: "EmailSettings", entityId: "default", metadata: { result: r.status, errorCode: r.errorCode } }));
  return { status: r.status, errorCode: r.errorCode, message: r.status === "SENT" ? "Test email sent." : r.errorMessage, deliveryId: r.id };
}
