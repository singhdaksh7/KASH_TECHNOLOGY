import type { AdminPageItem, PageSection, PageSeo, PageStatus } from "@/lib/admin-client/types";
import { idToLabel, labelToId } from "@/lib/cms/section-compat";
import { hasUnpublishedChanges, workingCopy, type PageWithRelations, type StoredSection, type StoredSeo, type WorkingCopy } from "@/lib/cms/pages";
import { seoScore } from "@/lib/server/seo-score";

const STATUS: Record<string, PageStatus> = { DRAFT: "Draft", PUBLISHED: "Published", SCHEDULED: "Scheduled" };
export const STATUS_TO_DB: Record<PageStatus, "DRAFT" | "PUBLISHED" | "SCHEDULED"> = { Draft: "DRAFT", Published: "PUBLISHED", Scheduled: "SCHEDULED" };

export const slugOut = (s: string) => s.replace(/^\//, "");

function seoOut(s: StoredSeo, slug: string): PageSeo {
  const robots = (s.robots ?? "index,follow").toLowerCase();
  return {
    title: s.title ?? "", metaDescription: s.description ?? "", slug: slugOut(slug), canonicalUrl: s.canonicalUrl ?? "",
    focusKeyword: s.focusKeyword ?? "", secondaryKeywords: s.secondaryKeywords ?? "", ogTitle: s.ogTitle ?? "",
    ogDescription: s.ogDescription ?? "", ogImage: s.ogImage ?? "", twitterImage: s.twitterImage ?? "",
    index: !robots.includes("noindex"), follow: !robots.includes("nofollow"),
  };
}

export function seoIn(s: Partial<PageSeo>): StoredSeo {
  return {
    title: s.title || null, description: s.metaDescription || null, canonicalUrl: s.canonicalUrl || null,
    robots: `${s.index === false ? "noindex" : "index"},${s.follow === false ? "nofollow" : "follow"}`,
    ogImage: s.ogImage || null, ogTitle: s.ogTitle || null, ogDescription: s.ogDescription || null, twitterImage: s.twitterImage || null,
    focusKeyword: s.focusKeyword || null, secondaryKeywords: s.secondaryKeywords || null,
  };
}

export function sectionsOut(list: StoredSection[]): PageSection[] {
  return [...list]
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({
      id: s.id, type: idToLabel(s.type) as PageSection["type"], order: i + 1, enabled: s.enabled,
      content: s.content ?? {}, style: ((s.style ?? {}) as unknown) as PageSection["style"],
    }));
}
export function sectionsIn(list: PageSection[]): StoredSection[] {
  return list.map((s, i) => ({ id: s.id, type: labelToId(s.type), order: i, enabled: s.enabled, content: s.content ?? {}, style: (s.style ?? null) as unknown as Record<string, unknown> | null }));
}

export function toAdminPage(p: PageWithRelations): AdminPageItem & { hasUnpublishedChanges: boolean; pageType: string } {
  const w = workingCopy(p);
  const routeBound = w.sections.some((s) => s.type === "builtIn");
  return {
    id: p.id,
    title: w.title,
    slug: w.slug,
    status: STATUS[p.status] ?? "Draft",
    lastUpdated: p.updatedAt.toISOString().replace("T", " ").slice(0, 16),
    updatedBy: p.updatedBy?.name || p.updatedBy?.email || "—",
    seoScore: seoScore(w.seo, w.sections, routeBound),
    seo: seoOut(w.seo, w.slug),
    sections: sectionsOut(w.sections),
    hasUnpublishedChanges: hasUnpublishedChanges(p),
    pageType: p.pageType,
  };
}

export function workingFromAdmin(ui: AdminPageItem, pageType?: string): WorkingCopy {
  const slug = ui.slug.startsWith("/") ? ui.slug : `/${ui.slug}`;
  return { title: ui.title, slug, pageType, seo: seoIn(ui.seo ?? {}), sections: sectionsIn(ui.sections ?? []) };
}
