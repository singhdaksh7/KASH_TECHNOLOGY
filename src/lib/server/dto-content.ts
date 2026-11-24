import type { ArticleItem, FormField, FormItem, PageSeo, PortfolioItem } from "@/lib/admin-client/types";
import type { Prisma } from "@prisma/client";

const iso = (d: Date) => d.toISOString().replace("T", " ").slice(0, 16);
const emptySeo = (slug: string, title = ""): PageSeo => ({
  title, metaDescription: "", slug, canonicalUrl: "", focusKeyword: "", secondaryKeywords: "", ogTitle: "", ogDescription: "", ogImage: "", index: true, follow: true,
});

/* ───────── portfolio: the full admin item lives in PortfolioProject.content ───────── */
export type ProjectRow = Prisma.PortfolioProjectGetPayload<{ include: { category: true } }>;
export function toPortfolioItem(p: ProjectRow): PortfolioItem {
  const c = (p.content ?? {}) as Partial<PortfolioItem>;
  return {
    id: p.id, name: p.title, slug: p.slug, status: p.status === "PUBLISHED" ? "Published" : "Draft",
    projectType: c.projectType ?? "CONCEPT", category: p.category?.name ?? c.category ?? "", industry: c.industry ?? "",
    shortDescription: p.summary ?? c.shortDescription ?? "", fullDescription: c.fullDescription ?? "",
    thumbnail: c.thumbnail ?? "", heroImage: c.heroImage ?? "", gallery: c.gallery ?? [], videoUrl: c.videoUrl,
    technologies: c.technologies ?? [], services: c.services ?? [], problem: c.problem ?? [], solution: c.solution ?? [],
    features: c.features ?? [], architecture: c.architecture ?? [], developmentProcess: c.developmentProcess,
    externalUrl: c.externalUrl, caseStudyUrl: c.caseStudyUrl, clickBehaviour: c.clickBehaviour ?? "No Link",
    seo: { ...emptySeo(p.slug, p.title), ...(c.seo ?? {}) }, updatedAt: iso(p.updatedAt),
  };
}

/* ───────── articles: envelope in Article.content ───────── */
export type ArticleRow = Prisma.ArticleGetPayload<{ include: { category: true } }>;
interface ArticleEnvelope {
  body?: string; authorName?: string; authorRole?: string; cover?: string; readTime?: string; publishedLabel?: string;
  relatedSlugs?: string[]; seo?: Partial<PageSeo>;
}
export function toArticleItem(a: ArticleRow): ArticleItem {
  const c = (a.content ?? {}) as ArticleEnvelope;
  return {
    id: a.id, title: a.title, slug: a.slug, status: a.status === "PUBLISHED" ? "Published" : "Draft", excerpt: a.excerpt ?? "",
    category: a.category?.name ?? "", authorName: c.authorName ?? "KASH Technology", authorRole: c.authorRole ?? "",
    cover: c.cover ?? "", publishedAt: c.publishedLabel ?? (a.publishedAt ? a.publishedAt.toISOString().slice(0, 10) : ""),
    readTime: c.readTime ?? "", body: c.body ?? "", relatedSlugs: c.relatedSlugs ?? [],
    seo: { ...emptySeo(a.slug, a.title), ...(c.seo ?? {}) }, updatedAt: iso(a.updatedAt),
  };
}
export const articleEnvelope = (i: ArticleItem): ArticleEnvelope => ({
  body: i.body, authorName: i.authorName, authorRole: i.authorRole, cover: i.cover, readTime: i.readTime,
  publishedLabel: i.publishedAt, relatedSlugs: i.relatedSlugs, seo: i.seo,
});

/* ───────── forms ───────── */
export const FIELD_TYPE_TO_DB: Record<FormField["type"], "TEXT" | "EMAIL" | "PHONE" | "TEXTAREA" | "SELECT" | "CHECKBOX" | "RADIO" | "DATE" | "FILE" | "HIDDEN"> = {
  Text: "TEXT", Email: "EMAIL", Phone: "PHONE", Textarea: "TEXTAREA", Dropdown: "SELECT", Checkbox: "CHECKBOX", Radio: "RADIO", Date: "DATE", File: "FILE", Hidden: "HIDDEN",
};
export const FIELD_TYPE_FROM_DB = Object.fromEntries(Object.entries(FIELD_TYPE_TO_DB).map(([k, v]) => [v, k])) as Record<string, FormField["type"]>;
export type FormRow = Prisma.FormGetPayload<{ include: { fields: true; _count: { select: { submissions: true } } } }>;
export function toFormItem(f: FormRow): FormItem {
  const s = (f.settings ?? {}) as { description?: string; submitButtonText?: string; successMessage?: string; multiStep?: boolean; steps?: string[] };
  const simple = (r: unknown) => {
    const x = r as { action?: string; match?: string; conditions?: Array<{ field: string; operator: string; value?: unknown }> } | null;
    return x && x.action === "show" && x.conditions?.length === 1 && x.conditions[0].operator === "equals" ? { field: x.conditions[0].field, equals: String(x.conditions[0].value ?? "") } : undefined;
  };
  return {
    id: f.id, title: f.name, slug: f.slug, description: s.description ?? "",
    fields: [...f.fields].sort((a, b) => a.order - b.order).map((x) => ({
      id: x.id, label: x.label, name: x.name, type: FIELD_TYPE_FROM_DB[x.type] ?? "Text", required: x.required,
      placeholder: ((x.validation ?? {}) as { placeholder?: string }).placeholder,
      options: Array.isArray(x.options) ? (x.options as string[]) : undefined,
      validation: ((x.validation ?? {}) as { pattern?: string }).pattern,
      description: x.description ?? undefined, step: x.step, section: x.section ?? undefined,
      conditionalRules: (x.conditionalRules ?? null) as never, conditionalOn: simple(x.conditionalRules),
    })),
    isMultiStep: !!s.multiStep || f.fields.some((x) => x.step > 1), stepTitles: s.steps ?? [], active: f.active,
    redirectUrl: f.successRedirectUrl ?? undefined, createCrmLead: f.createLead, sendEmailNotification: f.sendNotification,
    submitButtonText: s.submitButtonText ?? "Submit", successMessage: f.successMessage ?? s.successMessage ?? "Thank you — we'll be in touch shortly.",
    submissionsCount: f._count.submissions, updatedAt: iso(f.updatedAt),
  };
}
