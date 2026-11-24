import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { audit } from "@/lib/server/audit";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { toCsv } from "./csv";

export type ExportKind = "pages" | "portfolio" | "articles" | "forms" | "leads";
export const EXPORT_PERMISSION: Record<ExportKind, string> = { pages: "pages.view", portfolio: "portfolio.view", articles: "articles.view", forms: "forms.view", leads: "leads.view" };

/** Keys that must never appear in an export, at any depth. */
const FORBIDDEN_KEY = /^(password|passwordhash|tokenhash|token|session|sessions|encryptedsecret|secret|totp|twofactor|recoverycode|recoverycodes|codehash|ipHash|apikey|api_key|authorization)$/i;
export function assertNoSecrets(value: unknown, path = "$"): void {
  if (Array.isArray(value)) value.forEach((v, i) => assertNoSecrets(v, `${path}[${i}]`));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) {
    if (FORBIDDEN_KEY.test(k)) throw new Error(`Refusing to export forbidden field "${k}" at ${path}`);
    assertNoSecrets(v, `${path}.${k}`);
  }
}

export interface ExportResult { filename: string; contentType: string; body: string; count: number }
const stamp = () => new Date().toISOString().slice(0, 10);
const jsonOut = (format: string, key: string, items: unknown[]) => { const payload = { format, version: 1, exportedAt: new Date().toISOString(), [key]: items }; assertNoSecrets(payload); return JSON.stringify(payload, null, 2); };

export async function runExport(actor: Actor, kind: ExportKind, format: "json" | "csv"): Promise<ExportResult> {
  assertCan(actor, "import_export.use");
  assertCan(actor, EXPORT_PERMISSION[kind]);
  let result: ExportResult;
  if (kind === "pages") {
    if (format !== "json") throw new HttpError(400, "VALIDATION_ERROR", "Pages export as JSON only");
    const pages = await prisma.page.findMany({ where: { deletedAt: null }, orderBy: { slug: "asc" }, include: { sections: { orderBy: { order: "asc" }, include: { globalBlock: { select: { slug: true } } } }, seo: true } });
    const items = pages.map((p) => ({
      title: p.title, slug: p.slug, pageType: p.pageType, status: p.status,
      seo: p.seo ? { title: p.seo.title, description: p.seo.description, canonicalUrl: p.seo.canonicalUrl, robots: p.seo.robots, ogImage: p.seo.ogImage, ogTitle: p.seo.ogTitle, ogDescription: p.seo.ogDescription, twitterImage: p.seo.twitterImage, focusKeyword: p.seo.focusKeyword, secondaryKeywords: p.seo.secondaryKeywords, structuredData: p.seo.structuredData } : null,
      sections: p.sections.map((s) => ({ type: s.type, order: s.order, enabled: s.enabled, content: s.content, style: s.style, globalBlock: s.globalBlock?.slug ?? null })),
    }));
    result = { filename: `kash-pages-${stamp()}.json`, contentType: "application/json", body: jsonOut("kash-cms-pages", "pages", items), count: items.length };
  } else if (kind === "portfolio") {
    const rows = await prisma.portfolioProject.findMany({ where: { deletedAt: null }, orderBy: { title: "asc" }, include: { category: { select: { name: true } } } });
    if (format === "csv") {
      result = { filename: `kash-portfolio-${stamp()}.csv`, contentType: "text/csv; charset=utf-8", count: rows.length,
        body: toCsv(["title", "slug", "status", "summary", "category", "publishedAt", "content"], rows.map((r) => [r.title, r.slug, r.status, r.summary, r.category?.name, r.publishedAt, r.content == null ? "" : JSON.stringify(r.content)])) };
    } else {
      result = { filename: `kash-portfolio-${stamp()}.json`, contentType: "application/json", count: rows.length, body: jsonOut("kash-cms-portfolio", "projects", rows.map((r) => ({ title: r.title, slug: r.slug, status: r.status, summary: r.summary, category: r.category?.name ?? null, publishedAt: r.publishedAt, content: r.content }))) };
    }
  } else if (kind === "articles") {
    if (format !== "json") throw new HttpError(400, "VALIDATION_ERROR", "Articles export as JSON only");
    const rows = await prisma.article.findMany({ where: { deletedAt: null }, orderBy: { title: "asc" }, include: { category: { select: { name: true } } } });
    result = { filename: `kash-articles-${stamp()}.json`, contentType: "application/json", count: rows.length, body: jsonOut("kash-cms-articles", "articles", rows.map((a) => ({ title: a.title, slug: a.slug, status: a.status, excerpt: a.excerpt, category: a.category?.name ?? null, publishedAt: a.publishedAt, content: a.content }))) };
  } else if (kind === "forms") {
    if (format !== "json") throw new HttpError(400, "VALIDATION_ERROR", "Forms export as JSON only");
    const rows = await prisma.form.findMany({ orderBy: { name: "asc" }, include: { fields: { orderBy: { order: "asc" } } } });
    result = { filename: `kash-forms-${stamp()}.json`, contentType: "application/json", count: rows.length,
      body: jsonOut("kash-cms-forms", "forms", rows.map((f) => ({ name: f.name, slug: f.slug, active: f.active, settings: f.settings, successMessage: f.successMessage, successRedirectUrl: f.successRedirectUrl, createLead: f.createLead, sendNotification: f.sendNotification,
        fields: f.fields.map((x) => ({ name: x.name, label: x.label, type: x.type, required: x.required, options: x.options, validation: x.validation, step: x.step, section: x.section, description: x.description, conditionalRules: x.conditionalRules })) }))) };
  } else {
    if (format !== "csv") throw new HttpError(400, "VALIDATION_ERROR", "Leads export as CSV only");
    const rows = await prisma.lead.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, include: { assignedTo: { select: { email: true } } }, take: 50_000 });
    result = { filename: `kash-leads-${stamp()}.csv`, contentType: "text/csv; charset=utf-8", count: rows.length,
      body: toCsv(["name", "email", "phone", "company", "service", "message", "source", "status", "priority", "tags", "estimatedValue", "assignedTo", "nextFollowUpAt", "utmSource", "utmMedium", "utmCampaign", "landingPage", "createdAt"],
        rows.map((l) => [l.name, l.email, l.phone, l.company, l.service, l.message, l.source, l.status, l.priority, l.tags.join("|"), l.estimatedValue == null ? null : Number(l.estimatedValue), l.assignedTo?.email, l.nextFollowUpAt, l.utmSource, l.utmMedium, l.utmCampaign, l.landingPage, l.createdAt])) };
  }
  await audit({ actorId: actor.id, action: "export.run", entity: "Export", entityId: kind, metadata: { kind, format, count: result.count } });
  return result;
}
