import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { MAX_ATTEMPTS, deliver, type DeliverResult } from "./delivery";
import { internalLeadEmail, siteUrl, visitorConfirmationEmail, type LeadMailData } from "./layout";
import { getEmailConfig, isEmail, type EmailConfig } from "./provider";
import { renderTemplate, resolveTemplate } from "./templates";

export type MailEntity = { type: "Lead" | "FormSubmission"; id: string };
const SITE_NAME = "KASH Technology";
const s = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");

const cleanSubject = (v: string) => v.replace(/(\s*[|—–-])+\s*$/u, "").trim();

function internalVars(d: LeadMailData, entity: MailEntity | null) {
  const adminUrl = !entity ? `${siteUrl()}/admin/leads` : entity.type === "Lead" ? `${siteUrl()}/admin/leads/${entity.id}` : `${siteUrl()}/admin/forms`;
  return {
    name: s(d.name) || "unnamed lead", email: s(d.email), phone: s(d.phone), company: s(d.company), service: s(d.service), budget: s(d.budget), message: s(d.message),
    source: s(d.source), utmSource: s(d.utmSource), utmMedium: s(d.utmMedium), utmCampaign: s(d.utmCampaign), landingPage: s(d.landingPage), referrer: s(d.referrer),
    submittedAt: d.submittedAt.toISOString(), leadId: entity?.id ?? "", adminUrl, siteName: SITE_NAME,
  };
}
const visitorVars = (d: LeadMailData) => ({ name: s(d.name) || "there", service: s(d.service), serviceClause: s(d.service) ? ` regarding ${s(d.service)}` : "", company: s(d.company), siteName: SITE_NAME });

export async function buildInternal(d: LeadMailData, entity: MailEntity | null, cfg: EmailConfig, override?: { subject?: string; body?: string }) {
  const t = await resolveTemplate("lead_internal");
  const v = internalVars(d, entity);
  const subject = cleanSubject(renderTemplate(override?.subject ?? t.subject, v, t.variables, { singleLine: true }));
  const intro = renderTemplate(override?.body ?? t.body, v, t.variables);
  return { subject, ...internalLeadEmail(d, intro, v.adminUrl), to: cfg.internalRecipient, replyTo: isEmail(d.email) ? d.email : cfg.replyTo };
}
export async function buildVisitor(d: LeadMailData, cfg: EmailConfig, override?: { subject?: string; body?: string }) {
  const t = await resolveTemplate("lead_confirmation");
  const v = visitorVars(d);
  const subject = renderTemplate(override?.subject ?? t.subject, v, t.variables, { singleLine: true });
  const copy = renderTemplate(override?.body ?? t.body, v, t.variables);
  return { subject, ...visitorConfirmationEmail(v, copy, cfg.visitorReplyTo), to: s(d.email), replyTo: cfg.visitorReplyTo };
}

/**
 * Sends the internal alert and the visitor confirmation for a saved enquiry and records both outcomes.
 * MUST be called after the lead/submission is committed. Never throws, so an email problem can never lose or roll back a lead.
 */
export async function notifyLead(entity: MailEntity, data: LeadMailData, opts: { internal?: boolean; confirmation?: boolean } = {}) {
  const out: { internal?: DeliverResult; confirmation?: DeliverResult } = {};
  try {
    const cfg = await getEmailConfig();
    if (opts.internal !== false) {
      const m = await buildInternal(data, entity, cfg);
      out.internal = await deliver({ templateKey: "lead_internal", to: m.to, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo, entityType: entity.type, entityId: entity.id, dedupeKey: `${entity.type}:${entity.id}:lead_internal`, toggle: "internal" });
    }
    if (opts.confirmation !== false) {
      const m = await buildVisitor(data, cfg);
      out.confirmation = await deliver({ templateKey: "lead_confirmation", to: m.to, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo, entityType: entity.type, entityId: entity.id, dedupeKey: `${entity.type}:${entity.id}:lead_confirmation`, toggle: "visitor" });
    }
  } catch (e) {
    console.error("[email] notifyLead failed:", e instanceof Error ? e.message : "unknown");
  }
  return out;
}

export const leadToMailData = (l: { name: string | null; email: string | null; phone: string | null; company: string | null; service: string | null; budget: string | null; message: string | null; source: string | null; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; landingPage: string | null; referrer: string | null; createdAt: Date }): LeadMailData => ({ ...l, submittedAt: l.createdAt });

async function dataFor(entityType: string, entityId: string): Promise<LeadMailData | null> {
  if (entityType === "Lead") {
    const l = await prisma.lead.findUnique({ where: { id: entityId } });
    return l ? leadToMailData(l) : null;
  }
  if (entityType === "FormSubmission") {
    const sub = await prisma.formSubmission.findUnique({ where: { id: entityId }, include: { form: true } });
    if (!sub) return null;
    const v = (sub.values ?? {}) as Record<string, unknown>;
    return {
      name: s(v.name) || s(v.fullName) || sub.form.name, email: s(v.email), message: Object.entries(v).map(([k, x]) => `${k}: ${String(x)}`).join("\n"), source: `form:${sub.form.slug}`,
      landingPage: sub.landingPage, referrer: sub.referrer, submittedAt: sub.createdAt,
    };
  }
  return null;
}

/** Deliveries for one lead (used by the lead detail panel). */
export const deliveriesForLead = (leadId: string) => prisma.emailDelivery.findMany({ where: { entityType: "Lead", entityId: leadId }, orderBy: { createdAt: "desc" }, take: 20, select: safeSelect });
export const safeSelect = { id: true, templateKey: true, provider: true, recipient: true, subject: true, entityType: true, entityId: true, status: true, errorCode: true, errorMessage: true, attempts: true, createdAt: true, sentAt: true } as const;

/** Manual retry of a FAILED or SKIPPED lead email: re-rendered from the stored lead with the current template + settings. Bounded by MAX_ATTEMPTS. */
export async function retryDelivery(actor: Actor, id: string) {
  assertCan(actor, "email.retry");
  const row = await prisma.emailDelivery.findUnique({ where: { id } });
  if (!row) throw new HttpError(404, "NOT_FOUND", "Email delivery not found");
  if (row.status !== "FAILED" && row.status !== "SKIPPED") throw new HttpError(409, "CONFLICT", "Only failed or skipped emails can be retried");
  if (row.templateKey !== "lead_internal" && row.templateKey !== "lead_confirmation") throw new HttpError(400, "NOT_RETRYABLE", "This email type cannot be retried");
  if (row.attempts >= MAX_ATTEMPTS) throw new HttpError(409, "RETRY_LIMIT", `Retry limit (${MAX_ATTEMPTS} attempts) reached`);
  if (!row.entityType || !row.entityId) throw new HttpError(400, "NOT_RETRYABLE", "No related record to rebuild this email from");
  const data = await dataFor(row.entityType, row.entityId);
  if (!data) throw new HttpError(404, "NOT_FOUND", "The related lead no longer exists");
  const cfg = await getEmailConfig();
  const entity = { type: row.entityType as MailEntity["type"], id: row.entityId };
  const m = row.templateKey === "lead_internal" ? await buildInternal(data, entity, cfg) : await buildVisitor(data, cfg);
  const r = await deliver({ templateKey: row.templateKey, to: m.to, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo, entityType: row.entityType, entityId: row.entityId, existingId: row.id, manual: true });
  await prisma.$transaction((tx) => auditTx(tx, { actorId: actor.id, action: "email.retry", entity: "EmailDelivery", entityId: id, metadata: { template: row.templateKey, result: r.status, attempt: row.attempts + 1 } }));
  return r;
}

/** Branded preview for the template editor. Uses clearly-labelled sample data; nothing is stored or sent. */
export async function renderPreview(key: string, subject: string, body: string, _vars: Record<string, string> = {}) {
  void _vars;
  if (key !== "lead_internal" && key !== "lead_confirmation") return null;
  const sample: LeadMailData = {
    name: "Example Client", email: "client@example.com", phone: "+91 98765 43210", company: "Example Business", service: "Website Development", budget: "₹1,00,000 – ₹2,50,000",
    message: "We'd like a modern website with a booking system. (Preview data)", source: "contact_page", utmSource: "google", utmMedium: "cpc", utmCampaign: "spring-launch",
    landingPage: `${siteUrl()}/website-development`, referrer: "https://www.google.com/", submittedAt: new Date(),
  };
  const cfg = await getEmailConfig();
  const m = key === "lead_internal" ? await buildInternal(sample, { type: "Lead", id: "preview" }, cfg, { subject, body }) : await buildVisitor(sample, cfg, { subject, body });
  return { subject: m.subject, text: m.text, html: m.html };
}
