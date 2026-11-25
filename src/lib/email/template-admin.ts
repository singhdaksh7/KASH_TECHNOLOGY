import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { EMAIL_TEMPLATE_DEFS, TEMPLATE_DEF_BY_KEY, TemplateError, renderTemplate, validateTemplateText } from "./templates";
import { isLegacyDefault } from "./template-defs";
import { renderPreview } from "./lead-mail";

export const updateEmailTemplateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(), subject: z.string().trim().min(1).max(300).optional(),
  body: z.string().min(1).max(20_000).optional(), enabled: z.boolean().optional(),
}).refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" });

const view = (def: (typeof EMAIL_TEMPLATE_DEFS)[number], stored: { name: string; subject: string; body: string; enabled: boolean; updatedAt: Date } | null | undefined) => {
  const row = isLegacyDefault(def.key, stored) ? null : stored;
  return {
  key: def.key, name: row?.name ?? def.name, subject: row?.subject ?? def.subject, body: row?.body ?? def.body, enabled: row?.enabled ?? true,
  variables: def.variables, isCustomised: !!row && (row.subject !== def.subject || row.body !== def.body || !row.enabled), updatedAt: row?.updatedAt ?? null,
  };
};

export async function listEmailTemplates(actor: Actor) {
  assertCan(actor, "email_templates.view");
  const rows = await prisma.emailTemplate.findMany();
  return EMAIL_TEMPLATE_DEFS.map((d) => view(d, rows.find((r) => r.key === d.key)));
}

function defOrThrow(key: string) {
  const d = TEMPLATE_DEF_BY_KEY.get(key);
  if (!d) throw new HttpError(404, "NOT_FOUND", "Email template not found");
  return d;
}

export async function getEmailTemplate(actor: Actor, key: string) {
  assertCan(actor, "email_templates.view");
  const d = defOrThrow(key);
  return view(d, await prisma.emailTemplate.findUnique({ where: { key } }));
}

/** Saves a template. Only allow-listed {{variables}} are accepted; anything else is rejected before it is stored. */
export async function saveEmailTemplate(actor: Actor, key: string, input: z.infer<typeof updateEmailTemplateSchema>) {
  assertCan(actor, "email_templates.manage");
  const d = defOrThrow(key);
  const problems = [...(input.subject ? validateTemplateText(input.subject, d.variables) : []), ...(input.body ? validateTemplateText(input.body, d.variables) : [])];
  if (problems.length) throw new HttpError(400, "UNSAFE_TEMPLATE", "The template uses variables or syntax that is not allowed", { problems, allowed: d.variables });
  const row = await prisma.$transaction(async (tx) => {
    const r = await tx.emailTemplate.upsert({
      where: { key },
      update: { ...input, updatedById: actor.id },
      create: { key, name: input.name ?? d.name, subject: input.subject ?? d.subject, body: input.body ?? d.body, enabled: input.enabled ?? true, updatedById: actor.id },
    });
    await auditTx(tx, { actorId: actor.id, action: "email_template.update", entity: "EmailTemplate", entityId: key, metadata: { fields: Object.keys(input) } });
    return r;
  });
  return view(d, row);
}

/** Renders a template with clearly-labelled sample values so editors can preview it. Nothing is sent. */
export async function previewEmailTemplate(actor: Actor, key: string, variables: Record<string, string> = {}, draft?: { subject?: string; body?: string }) {
  assertCan(actor, "email_templates.view");
  const d = defOrThrow(key);
  const current = view(d, await prisma.emailTemplate.findUnique({ where: { key } }));
  const subject = draft?.subject ?? current.subject, body = draft?.body ?? current.body;
  const problems = [...validateTemplateText(subject, d.variables), ...validateTemplateText(body, d.variables)];
  if (problems.length) throw new HttpError(400, "UNSAFE_TEMPLATE", problems.join("; "), { allowed: d.variables });
  try {
    const branded = await renderPreview(key, subject, body, variables);
    if (branded) return { ...branded, previewData: true };
    const sample = Object.fromEntries(d.variables.map((v) => [v, variables[v] ?? `[${v}]`]));
    return { subject: renderTemplate(subject, sample, d.variables, { singleLine: true }), text: renderTemplate(body, sample, d.variables), html: null as string | null, previewData: true };
  } catch (e) {
    if (e instanceof TemplateError) throw new HttpError(400, "UNSAFE_TEMPLATE", e.message, { allowed: d.variables });
    throw e;
  }
}
