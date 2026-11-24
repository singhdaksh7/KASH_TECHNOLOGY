/**
 * Pure mappers from the Phase 2 backend's responses to the admin UI's types.
 * Nothing here invents data: when the backend has no value the UI field is left empty/undefined.
 */
import { idToLabel, labelToId } from "@/lib/cms/section-compat";
import type {
  AdminNotification, AdminTask, AdminTaskEntity, AdvancedSeoIssue, EmailTemplateItem, FormField, FormTemplateItem, GlobalBlock, MediaFolder,
  PageSection, PageTemplate, PageVersion, PortfolioTemplateItem, SectionType, SeoIssueSeverity, SeoIssueType, VersionDiff,
} from "./types";

export const DEFAULT_SECTION_STYLE: PageSection["style"] = { background: "White", paddingTop: 4, paddingBottom: 4, container: "Normal", alignment: "Left" } as PageSection["style"];
const ymd = (iso: string) => iso.slice(0, 10);
const text = (v: unknown) => (typeof v === "string" ? v : "");

// ── Page templates ──
export interface PageTemplateRow { id: string; name: string; slug: string; description: string | null; category: string; isSystem: boolean; createdAt: string; definition: { sections?: Array<{ type: string; content?: Record<string, unknown> }> } }
export function toUiPageTemplate(r: PageTemplateRow): PageTemplate {
  return {
    id: r.id, name: r.name, slug: r.slug, description: r.description ?? "", isSystem: r.isSystem, createdAt: ymd(r.createdAt),
    recommendedUse: `${r.category.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} page`,
    sections: (r.definition?.sections ?? []).map((s) => ({ type: idToLabel(s.type) as SectionType, label: idToLabel(s.type), description: text(s.content?.heading) || text(s.content?.title) })),
  };
}

// ── Global blocks ──
export interface GlobalBlockRow { id: string; name: string; slug: string; type: string; description: string | null; content: Record<string, unknown>; style: Record<string, unknown> | null; updatedAt: string; usageCount?: number; usage?: Array<{ pageId: string; title: string; slug: string }> }
const CATEGORY: Record<string, GlobalBlock["category"]> = {
  cta: "CTA", testimonials: "Trust & Social Proof", stats: "Trust & Social Proof", trustStrip: "Trust & Social Proof", logoStrip: "Trust & Social Proof",
  servicesGrid: "Services & Process", process: "Services & Process", serviceShowcase: "Services & Process", founder: "Brand & Team", team: "Brand & Team",
  agencyPillars: "Brand & Team", contactForm: "Forms & Subscriptions",
};
export function toUiGlobalBlock(r: GlobalBlockRow): GlobalBlock {
  return {
    id: r.id, name: r.name, description: r.description ?? "", category: CATEGORY[r.type] ?? "CTA",
    section: { id: r.id, type: idToLabel(r.type) as SectionType, order: 1, enabled: true, content: r.content ?? {}, style: { ...DEFAULT_SECTION_STYLE, ...(r.style ?? {}) } as PageSection["style"] },
    updatedAt: r.updatedAt, usageCount: r.usageCount ?? r.usage?.length ?? 0, pagesUsing: (r.usage ?? []).map((u) => ({ id: u.pageId, title: u.title, slug: u.slug })),
  };
}
export const fromUiGlobalBlock = (b: GlobalBlock) => ({ name: b.name, type: labelToId(b.section.type), description: b.description || null, content: b.section.content, style: b.section.style as unknown as Record<string, unknown> });

// ── Versions & comparison ──
export interface VersionRow { id: string; version: number; createdAt: string; reason: string; by: string }
export const toUiVersion = (pageId: string, r: VersionRow): PageVersion => ({
  versionId: String(r.version), versionNumber: r.version, pageId, createdAt: r.createdAt, createdBy: r.by, changeSummary: r.reason || "edit", snapshot: undefined as never,
});

interface ApiDiff {
  metadata: Array<{ field: string; from: unknown; to: unknown }>; seo: Array<{ field: string; from: unknown; to: unknown }>;
  sections: {
    added: Array<{ type: string; order: number }>; removed: Array<{ type: string; order: number }>;
    changed: Array<{ type: string; position: { from: number; to: number } | null; enabled: { from: boolean; to: boolean } | null; typeChanged: { from: string; to: string } | null; globalBlock: { from: string | null; to: string | null } | null; content: Array<{ path: string; from: unknown; to: unknown }>; style: Array<{ path: string; from: unknown; to: unknown }> }>;
    orderChanged: boolean; order: { from: string[]; to: string[] };
  };
}
const FIELD_LABEL: Record<string, string> = { title: "Page title", slug: "Slug", status: "Status", pageType: "Page type", description: "Meta description", canonicalUrl: "Canonical URL", robots: "Robots", ogImage: "OG image", ogTitle: "OG title", ogDescription: "OG description", twitterImage: "Twitter image", focusKeyword: "Focus keyword", secondaryKeywords: "Secondary keywords", structuredData: "Structured data" };
const cat = (from: unknown, to: unknown): VersionDiff["category"] => ((from == null || from === "") && to != null && to !== "" ? "Added" : (to == null || to === "") && from != null && from !== "" ? "Removed" : "Changed");

/** Structured backend diff → flat list the compare UI renders, grouped by `area`. */
export function toUiDiffs(d: ApiDiff): VersionDiff[] {
  const out: VersionDiff[] = [];
  for (const m of d.metadata) out.push({ area: "metadata", category: cat(m.from, m.to), entity: FIELD_LABEL[m.field] ?? m.field, oldValue: m.from, newValue: m.to });
  for (const m of d.seo) out.push({ area: "seo", category: cat(m.from, m.to), entity: `SEO · ${FIELD_LABEL[m.field] ?? m.field}`, oldValue: m.from, newValue: m.to });
  for (const s of d.sections.removed) out.push({ area: "section", category: "Removed", entity: `Section ${s.order + 1} (${idToLabel(s.type)})`, oldValue: idToLabel(s.type), newValue: undefined });
  for (const s of d.sections.added) out.push({ area: "section", category: "Added", entity: `Section ${s.order + 1} (${idToLabel(s.type)})`, oldValue: undefined, newValue: idToLabel(s.type) });
  for (const c of d.sections.changed) {
    const name = idToLabel(c.type);
    if (c.typeChanged) out.push({ area: "section", category: "Changed", entity: `Section type`, field: name, oldValue: idToLabel(c.typeChanged.from), newValue: idToLabel(c.typeChanged.to) });
    if (c.enabled) out.push({ area: "section", category: "Changed", entity: `${name} visibility`, oldValue: c.enabled.from ? "Visible" : "Hidden", newValue: c.enabled.to ? "Visible" : "Hidden" });
    if (c.globalBlock) out.push({ area: "section", category: "Changed", entity: `${name} global block link`, oldValue: c.globalBlock.from ?? "Independent", newValue: c.globalBlock.to ?? "Independent" });
    for (const x of c.content) out.push({ area: "content", category: cat(x.from, x.to), entity: `${name} content`, field: x.path, oldValue: x.from, newValue: x.to });
    for (const x of c.style) out.push({ area: "style", category: cat(x.from, x.to), entity: `${name} style`, field: x.path, oldValue: x.from, newValue: x.to });
    if (c.position) out.push({ area: "order", category: "Changed", entity: `${name} position`, oldValue: `#${c.position.from + 1}`, newValue: `#${c.position.to + 1}` });
  }
  return out;
}

// ── SEO ──
const SEV: Record<string, SeoIssueSeverity> = { CRITICAL: "Critical", WARNING: "Warning", RECOMMENDATION: "Recommendation", PASSED: "Passed" };
const TYPE: Record<string, SeoIssueType> = {
  MISSING_TITLE: "Missing Title", DUPLICATE_TITLE: "Duplicate Title", TITLE_TOO_LONG: "Title Too Long", MISSING_META_DESCRIPTION: "Missing Meta Description",
  DUPLICATE_META_DESCRIPTION: "Duplicate Meta Description", DESCRIPTION_TOO_LONG: "Meta Description Too Long", MISSING_H1: "Missing H1", MULTIPLE_H1: "Multiple H1",
  MISSING_CANONICAL: "Missing Canonical", INVALID_CANONICAL: "Canonical Issue", NOINDEX: "Noindex Page", MISSING_OG_IMAGE: "Missing OG Image",
  MISSING_IMAGE_ALT: "Missing ALT Text", BROKEN_INTERNAL_LINK: "Broken Internal Link", ORPHAN_PAGE: "Orphan Page", REDIRECT_CHAIN: "Redirect Chain", REDIRECT_LOOP: "Redirect Loop", MISSING_SCHEMA: "Schema Issue",
};
export interface ApiSeoIssue { id: string; type: string; severity: string; entityType: string; entityId: string; entityLabel: string; url: string; message: string; recommendation: string }
export function toUiSeoIssue(i: ApiSeoIssue): AdvancedSeoIssue {
  return {
    id: i.id, pageTitle: i.entityLabel, slug: i.url, pageType: i.entityType === "Page" ? "Page" : "Page", type: (TYPE[i.type] ?? i.type) as SeoIssueType, severity: SEV[i.severity] ?? "Warning",
    status: "Open", recommendation: `${i.message} ${i.recommendation}`.trim(), targetUrl: i.url, entityType: i.entityType, entityId: i.entityId,
  };
}
export const toUiPassed = (p: { type: string; message: string }, n: number): AdvancedSeoIssue => ({
  id: `passed-${p.type}-${n}`, pageTitle: "All audited content", slug: "", pageType: "Page", type: (TYPE[p.type] ?? p.type) as SeoIssueType, severity: "Passed", status: "Open", recommendation: p.message, targetUrl: "",
});

// ── Media folders ──
export interface FolderRow { id: string; name: string; parentId: string | null; path: string; depth: number; assetCount: number; childCount: number }
export const toUiFolder = (f: FolderRow): MediaFolder => ({ id: f.id, name: f.name, slug: f.id, count: f.assetCount, parentId: f.parentId ?? undefined, path: f.path, depth: f.depth, childCount: f.childCount });

// ── Tasks ──
export interface TaskRow { id: string; title: string; description: string | null; status: AdminTask["status"]; priority: AdminTask["priority"]; dueAt: string | null; createdAt: string; assignedToId: string | null; assignedTo?: { name: string | null; email: string } | null; relatedType: string | null; relatedId: string | null; entityTitle?: string; entityUrl?: string }
const ENTITY: Record<string, AdminTaskEntity> = { LEAD: "Lead", PAGE: "Page", ARTICLE: "Article", PORTFOLIO: "Portfolio" };
export const toUiTask = (t: TaskRow): AdminTask => ({
  id: t.id, title: t.title, description: t.description ?? "", relatedEntity: (t.relatedType && ENTITY[t.relatedType]) || "System", relatedId: t.relatedId ?? undefined,
  entityTitle: t.entityTitle, entityUrl: t.entityUrl, assignee: t.assignedTo ? t.assignedTo.name || t.assignedTo.email : "", assigneeId: t.assignedToId ?? undefined,
  dueDate: t.dueAt ? t.dueAt.slice(0, 10) : "", priority: t.priority, status: t.status, createdAt: ymd(t.createdAt),
});
export const REL_TO_DB: Record<AdminTaskEntity, string | null> = { Lead: "LEAD", Page: "PAGE", Article: "ARTICLE", Portfolio: "PORTFOLIO", System: null };

// ── Notifications ──
export interface NotificationRow { id: string; type: string; title: string; message: string; link: string | null; createdAt: string; readAt: string | null }
const NTYPE: Record<string, AdminNotification["type"]> = {
  NEW_LEAD: "NEW_LEAD", PAGE_REVIEW: "PAGE_REVIEW", PAGE_CHANGES_REQUESTED: "PAGE_REVIEW", PAGE_APPROVED: "PAGE_APPROVED", PAGE_SCHEDULED: "PAGE_PUBLISHED", PAGE_PUBLISHED: "PAGE_PUBLISHED",
  PAGE_PUBLISH_FAILED: "SYSTEM", PAGE_UNPUBLISHED: "PAGE_PUBLISHED", FORM_SUBMISSION: "FORM_SUBMISSION", TASK_ASSIGNED: "SYSTEM", LEAD_ASSIGNED: "NEW_LEAD", SEO_WARNING: "SEO_WARNING", SYSTEM: "SYSTEM",
};
export const toUiNotification = (n: NotificationRow): AdminNotification => ({
  id: n.id, type: NTYPE[n.type] ?? "SYSTEM", title: n.title, message: n.message, link: n.link ?? undefined, timestamp: n.createdAt, read: !!n.readAt,
  priority: n.type === "PAGE_PUBLISH_FAILED" ? "high" : n.type === "NEW_LEAD" || n.type === "PAGE_REVIEW" || n.type === "PAGE_CHANGES_REQUESTED" ? "medium" : "low",
});

// ── Email templates ──
export interface EmailTemplateRow { key: string; name: string; subject: string; body: string; enabled: boolean; variables: string[]; isCustomised: boolean; updatedAt: string | null }
export const toUiEmailTemplate = (r: EmailTemplateRow): EmailTemplateItem => ({ id: r.key, slug: r.key, name: r.name, subject: r.subject, body: r.body, enabled: r.enabled, variables: r.variables, isCustomised: r.isCustomised, updatedAt: r.updatedAt?.slice(0, 10) ?? "" });

// ── Form templates ──
const FIELD_TYPE: Record<string, FormField["type"]> = { TEXT: "Text", EMAIL: "Email", PHONE: "Phone", TEXTAREA: "Textarea", SELECT: "Dropdown", CHECKBOX: "Checkbox", RADIO: "Radio", DATE: "Date", FILE: "File", HIDDEN: "Hidden" };
export const FIELD_TYPE_TO_API: Record<string, string> = Object.fromEntries(Object.entries(FIELD_TYPE).map(([k, v]) => [v, k]));
export interface FormTemplateRow { id: string; name: string; key: string; definition: { slug: string; settings?: { steps?: string[]; multiStep?: boolean; description?: string; submitButtonText?: string }; successMessage?: string; successRedirectUrl?: string | null; createLead?: boolean; sendNotification?: boolean; fields: Array<{ name: string; label: string; type: string; required?: boolean; options?: string[]; step?: number; section?: string; description?: string; conditionalRules?: FormField["conditionalRules"] }> } }
export function toUiFormTemplate(r: FormTemplateRow): FormTemplateItem {
  const d = r.definition;
  const cat: FormTemplateItem["category"] = /audit/.test(r.key) ? "Audit" : /newsletter/.test(r.key) ? "Subscription" : /callback/.test(r.key) ? "Support" : "Lead Capture";
  return {
    id: r.id, name: r.name, slug: d.slug, category: cat, description: d.settings?.description ?? `${r.name} — ${d.fields.length} fields${d.settings?.multiStep ? `, ${d.settings.steps?.length ?? 2} steps` : ""}.`,
    submitButtonText: d.settings?.submitButtonText ?? "Submit", successMessage: d.successMessage ?? "Thank you — we'll be in touch shortly.", isMultiStep: !!d.settings?.multiStep,
    fields: d.fields.map((f, i) => ({ id: `${r.key}-${i}`, label: f.label, name: f.name, type: FIELD_TYPE[f.type] ?? "Text", required: !!f.required, options: f.options, step: f.step, section: f.section, description: f.description, conditionalRules: f.conditionalRules })),
    createCrmLead: d.createLead ?? true, sendEmailNotification: d.sendNotification ?? true, stepTitles: d.settings?.steps, redirectUrl: d.successRedirectUrl ?? undefined,
  };
}

// ── Portfolio templates ──
export interface PortfolioTemplateRow { id: string; key: string; name: string; category: string; description: string | null; definition: { content?: Record<string, unknown> } }
export const toUiPortfolioTemplate = (r: PortfolioTemplateRow): PortfolioTemplateItem => {
  const c = r.definition.content ?? {};
  const listy = (k: string) => (Array.isArray(c[k]) ? (c[k] as unknown[]).map((x) => (typeof x === "string" ? x : text((x as { label?: string }).label))).filter(Boolean) : []);
  return { id: r.id, name: r.name, slug: r.key, category: r.category, description: r.description ?? "", recommendedSections: ["Problem", "Solution", "Features", "Results", ...listy("architecture")].slice(0, 6), sampleTechStack: listy("technologies") };
};
