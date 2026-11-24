import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { notifyLead } from "@/lib/email/resend";
import { sendTemplatedEmail } from "@/lib/email/templates";
import { sha256 } from "@/lib/auth/crypto";
import { logEmailSent, onLeadCreated } from "@/lib/crm/leads";
import { notifySafe, usersWithPermission } from "@/lib/notifications";
import { evaluationOrder, fieldState } from "./rules";

const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[<>]/g, "").trim().slice(0, 10_000) : v);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormFieldRow { name: string; type: string; required: boolean; options: unknown; conditionalRules: unknown }

/**
 * Validates a submission against the form definition, honouring conditional rules.
 * Hidden fields are ignored (their values are dropped); rule-required fields are enforced.
 * Throws `REQUIRED:<field>` / `INVALID:<field>` like the original implementation.
 */
export function validateSubmission(fields: FormFieldRow[], raw: Record<string, unknown>): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of evaluationOrder(fields)) {
    const { visible, requiredByRule } = fieldState(field.conditionalRules, values);
    if (!visible) continue;
    let value = clean(raw[field.name]);
    if (field.type === "CHECKBOX" && typeof value === "boolean") value = value ? "yes" : "";
    if ((field.required || requiredByRule) && (value === undefined || value === "")) throw new Error(`REQUIRED:${field.name}`);
    if (value === undefined || value === "") continue;
    if (field.type === "EMAIL" && !(typeof value === "string" && EMAIL.test(value))) throw new Error(`INVALID:${field.name}`);
    if ((field.type === "SELECT" || field.type === "RADIO") && Array.isArray(field.options) && !(field.options as unknown[]).includes(value)) throw new Error(`INVALID:${field.name}`);
    if (field.type === "DATE" && (typeof value !== "string" || Number.isNaN(Date.parse(value)))) throw new Error(`INVALID:${field.name}`);
    values[field.name] = value;
  }
  // Preserve the form's own field order in the stored values.
  return Object.fromEntries(fields.filter((f) => f.name in values).map((f) => [f.name, values[f.name]]));
}

/**
 * Persist first, notify second: the FormSubmission (+ Lead, when the form creates leads) is stored before any email
 * is attempted, so a mail outage can never lose an enquiry.
 */
export async function saveSubmission(formSlug: string, raw: Record<string, unknown>, request: Request) {
  const form = await prisma.form.findUnique({ where: { slug: formSlug }, include: { fields: { orderBy: { order: "asc" } } } });
  if (!form || !form.active) throw new Error("FORM_NOT_FOUND");
  const values = validateSubmission(form.fields, raw);

  const referer = request.headers.get("referer");
  const lead = form.createLead
    ? await prisma.lead.create({
      data: {
        name: str(values.name) ?? str(values.fullName), email: str(values.email), phone: str(values.phone), company: str(values.company),
        service: str(values.service) ?? str(values.serviceInterested), message: str(values.message), source: `form:${formSlug}`,
        utmSource: str(raw.utmSource), utmMedium: str(raw.utmMedium), utmCampaign: str(raw.utmCampaign), utmTerm: str(raw.utmTerm), utmContent: str(raw.utmContent),
        landingPage: str(raw.landingPage) ?? referer, referrer: str(raw.referrer) ?? referer,
      },
    })
    : null;
  const submission = await prisma.formSubmission.create({
    data: {
      formId: form.id, leadId: lead?.id, values: values as Prisma.InputJsonValue,
      utmData: { utmSource: raw.utmSource, utmMedium: raw.utmMedium, utmCampaign: raw.utmCampaign, utmTerm: raw.utmTerm, utmContent: raw.utmContent } as Prisma.InputJsonValue,
      referrer: referer, landingPage: str(raw.landingPage),
      ipHash: sha256(request.headers.get("x-forwarded-for") || ""), userAgent: request.headers.get("user-agent")?.slice(0, 500),
    },
  });
  if (lead) {
    await prisma.auditLog.create({ data: { action: "lead.created", entity: "Lead", entityId: lead.id, metadata: { form: formSlug } } }).catch(() => undefined);
    await onLeadCreated(lead);
  } else {
    await notifySafe({
      userIds: await usersWithPermission("forms.view").catch(() => []), type: "FORM_SUBMISSION", title: `New submission: ${form.name}`, message: "A form was submitted.",
      entityType: "FormSubmission", entityId: submission.id, link: "/admin/forms", dedupeKey: `submission:${submission.id}`,
    });
  }

  let mail: { sent: boolean; error?: string } = { sent: false, error: "Notifications disabled for this form" };
  if (form.sendNotification) {
    const email = str(values.email);
    mail = lead
      ? await notifyLead(lead, { confirmation: formSlug !== "newsletter" }).catch((e: unknown) => ({ sent: false, error: e instanceof Error ? e.message : "email error" }))
      : await notifyLead({ name: str(values.name) ?? form.name, email, message: Object.entries(values).map(([k, v]) => `${k}: ${String(v)}`).join("\n"), source: `form:${formSlug}` }, { confirmation: false }).catch((e: unknown) => ({ sent: false, error: e instanceof Error ? e.message : "email error" }));
    if (formSlug === "newsletter" && email) await sendTemplatedEmail("newsletter_confirmation", email, { email }).catch(() => undefined);
    if (lead && mail.sent) await logEmailSent(lead.id, { template: "lead_internal", form: formSlug });
  }
  const updated = await prisma.formSubmission.update({ where: { id: submission.id }, data: { emailStatus: !form.sendNotification ? "PENDING" : mail.sent ? "SENT" : "FAILED", emailError: mail.error?.slice(0, 500) } });
  return { lead, submission: updated, successMessage: form.successMessage ?? ((form.settings ?? {}) as { successMessage?: string }).successMessage ?? null, successRedirectUrl: form.successRedirectUrl ?? null };
}
