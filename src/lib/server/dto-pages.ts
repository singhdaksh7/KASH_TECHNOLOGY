import type { AdminPageItem, PageSection, PageSeo, PageStatus } from "@/lib/admin-client/types";
import { idToLabel, labelToId } from "@/lib/cms/section-compat";
import { hasUnpublishedChanges, workingCopy, type PageWithRelations, type StoredSection, type StoredSeo, type WorkingCopy } from "@/lib/cms/pages";
import { seoScore } from "@/lib/server/seo-score";

import { prisma } from "@/lib/db/prisma";
import { DEFAULT_TIMEZONE, utcToZoned } from "@/lib/cms/schedule-time";

const STATUS: Record<string, PageStatus> = {
  DRAFT: "Draft", IN_REVIEW: "In_Review", CHANGES_REQUESTED: "Changes_Requested", APPROVED: "Approved", SCHEDULED: "Scheduled", PUBLISHED: "Published", ARCHIVED: "Archived",
};
export const STATUS_TO_DB: Record<PageStatus, string> = { Draft: "DRAFT", In_Review: "IN_REVIEW", Changes_Requested: "CHANGES_REQUESTED", Approved: "APPROVED", Scheduled: "SCHEDULED", Published: "PUBLISHED", Archived: "ARCHIVED" };

/** Stored UTC instants → the UI's wall-clock schedule (shown in the default zone; `publishAtUtc` is the exact instant). */
function scheduleOut(p: { publishAt: Date | null; unpublishAt: Date | null }): AdminPageItem["schedule"] {
  if (!p.publishAt && !p.unpublishAt) return undefined;
  const pub = p.publishAt ? utcToZoned(p.publishAt) : null, un = p.unpublishAt ? utcToZoned(p.unpublishAt) : null;
  return {
    publishDate: pub?.date ?? "", publishTime: pub?.time ?? "", timezone: DEFAULT_TIMEZONE,
    unpublishDate: un?.date, unpublishTime: un?.time, publishAtUtc: p.publishAt?.toISOString(), unpublishAtUtc: p.unpublishAt?.toISOString(),
  };
}

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
      ...(s.globalBlockId ? { isGlobalBlock: true, globalBlockId: s.globalBlockId } : {}),
    }));
}
export function sectionsIn(list: PageSection[]): StoredSection[] {
  return list.map((s, i) => ({ id: s.id, type: labelToId(s.type), order: i, enabled: s.enabled, content: s.globalBlockId ? {} : s.content ?? {}, style: s.globalBlockId ? null : (s.style ?? null) as unknown as Record<string, unknown> | null, ...(s.globalBlockId ? { globalBlockId: s.globalBlockId } : {}) }));
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
    schedule: scheduleOut(p),
    reviewNotes: p.reviewNote ?? undefined,
    submittedAt: p.submittedForReviewAt?.toISOString(),
  };
}

const ACTIVITY: Record<string, NonNullable<AdminPageItem["reviewHistory"]>[number]["action"]> = {
  "page.submit_review": "SUBMITTED", "page.request_changes": "REQUESTED_CHANGES", "page.approve": "APPROVED", "page.schedule": "SCHEDULED",
  "page.cancel_schedule": "SCHEDULE_CANCELLED", "page.publish": "PUBLISHED", "page.unpublish": "UNPUBLISHED", "page.archive": "ARCHIVED", "page.unarchive": "RESTORED", "page.reset_to_draft": "RESET_TO_DRAFT",
};

/** Detail view: adds names, review/approval activity (from the audit log) and the current version number. */
export async function toAdminPageDetail(p: PageWithRelations): Promise<ReturnType<typeof toAdminPage>> {
  const base = toAdminPage(p);
  // Linked sections show the global block's CURRENT type/content/style (read-only in the builder; edit or detach the block).
  const linked = [...new Set(base.sections.map((x) => x.globalBlockId).filter((x): x is string => !!x))];
  if (linked.length) {
    const blocks = new Map((await prisma.globalBlock.findMany({ where: { id: { in: linked } } })).map((b) => [b.id, b]));
    base.sections = base.sections.map((x) => {
      const b = x.globalBlockId ? blocks.get(x.globalBlockId) : undefined;
      return b ? { ...x, type: idToLabel(b.type) as PageSection["type"], content: (b.content ?? {}) as Record<string, unknown>, style: ((b.style ?? x.style ?? {}) as unknown) as PageSection["style"], blockName: b.name } : x;
    });
  }
  const [logs, last, people] = await Promise.all([
    prisma.auditLog.findMany({ where: { entity: "Page", entityId: p.id, action: { in: Object.keys(ACTIVITY) } }, orderBy: { createdAt: "desc" }, take: 50, include: { actor: { select: { name: true, email: true, roles: { select: { role: { select: { name: true } } } } } } } }),
    prisma.pageVersion.aggregate({ where: { pageId: p.id }, _max: { version: true } }),
    prisma.user.findMany({ where: { id: { in: [p.submittedById, p.reviewedById, p.approvedById].filter((x): x is string => !!x) } }, select: { id: true, name: true, email: true } }),
  ]);
  const name = (id?: string | null) => { const u = people.find((x) => x.id === id); return u ? u.name || u.email : undefined; };
  return {
    ...base, submittedBy: name(p.submittedById), assignedReviewer: name(p.reviewedById), versionNumber: last._max.version ?? undefined,
    reviewHistory: logs.map((l) => {
      const md = (l.metadata ?? {}) as { note?: string | null; from?: string; reason?: string; publishAt?: string; slug?: string };
      return {
        id: l.id, actor: l.actor?.name || l.actor?.email || "System", role: l.actor?.roles.map((r) => r.role.name.replace(/_/g, " ").toLowerCase()).join(", ") || "scheduler",
        action: ACTIVITY[l.action], note: md.note ?? md.reason ?? (md.publishAt ? `Scheduled for ${md.publishAt}` : ""), timestamp: l.createdAt.toISOString(),
      };
    }),
  };
}

export function workingFromAdmin(ui: AdminPageItem, pageType?: string): WorkingCopy {
  const slug = ui.slug.startsWith("/") ? ui.slug : `/${ui.slug}`;
  return { title: ui.title, slug, pageType, seo: seoIn(ui.seo ?? {}), sections: sectionsIn(ui.sections ?? []) };
}
