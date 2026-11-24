import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { notifyLead } from "@/lib/email/resend";
import { sha256 } from "@/lib/auth/crypto";

const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[<>]/g, "").trim().slice(0, 10_000) : v);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Persist first, notify second: the FormSubmission + Lead are stored before any email is attempted,
 * so a Resend outage / unverified domain can never lose an enquiry.
 */
export async function saveSubmission(formSlug: string, raw: Record<string, unknown>, request: Request) {
  const form = await prisma.form.findUnique({ where: { slug: formSlug }, include: { fields: true } });
  if (!form || !form.active) throw new Error("FORM_NOT_FOUND");

  const values: Record<string, unknown> = {};
  for (const field of form.fields) {
    let value = clean(raw[field.name]);
    if (field.type === "CHECKBOX" && typeof value === "boolean") value = value ? "yes" : "";
    if (field.required && (value === undefined || value === "")) throw new Error(`REQUIRED:${field.name}`);
    if (value === undefined || value === "") continue;
    if (field.type === "EMAIL" && !(typeof value === "string" && EMAIL.test(value))) throw new Error(`INVALID:${field.name}`);
    if ((field.type === "SELECT" || field.type === "RADIO") && Array.isArray(field.options) && !(field.options as unknown[]).includes(value)) throw new Error(`INVALID:${field.name}`);
    if (field.type === "DATE" && (typeof value !== "string" || Number.isNaN(Date.parse(value)))) throw new Error(`INVALID:${field.name}`);
    values[field.name] = value;
  }

  const referer = request.headers.get("referer");
  const lead = await prisma.lead.create({
    data: {
      name: str(values.name) ?? str(values.fullName), email: str(values.email), phone: str(values.phone), company: str(values.company),
      service: str(values.service) ?? str(values.serviceInterested), message: str(values.message), source: `form:${formSlug}`,
      utmSource: str(raw.utmSource), utmMedium: str(raw.utmMedium), utmCampaign: str(raw.utmCampaign), utmTerm: str(raw.utmTerm), utmContent: str(raw.utmContent),
      landingPage: str(raw.landingPage) ?? referer, referrer: str(raw.referrer) ?? referer,
    },
  });
  const submission = await prisma.formSubmission.create({
    data: {
      formId: form.id, leadId: lead.id, values: values as Prisma.InputJsonValue,
      utmData: { utmSource: raw.utmSource, utmMedium: raw.utmMedium, utmCampaign: raw.utmCampaign, utmTerm: raw.utmTerm, utmContent: raw.utmContent } as Prisma.InputJsonValue,
      referrer: referer, landingPage: str(raw.landingPage),
      ipHash: sha256(request.headers.get("x-forwarded-for") || ""), userAgent: request.headers.get("user-agent")?.slice(0, 500),
    },
  });
  await prisma.auditLog.create({ data: { action: "lead.created", entity: "Lead", entityId: lead.id, metadata: { form: formSlug } } }).catch(() => undefined);

  const mail = await notifyLead(lead).catch((e: unknown) => ({ sent: false, error: e instanceof Error ? e.message : "email error" }));
  const updated = await prisma.formSubmission.update({ where: { id: submission.id }, data: { emailStatus: mail.sent ? "SENT" : "FAILED", emailError: mail.error?.slice(0, 500) } });
  return { lead, submission: updated };
}
