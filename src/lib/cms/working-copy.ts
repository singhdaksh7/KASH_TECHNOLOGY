import { Prisma } from "@prisma/client";
import { HttpError } from "@/lib/server/api";

/** A section as stored in drafts and version snapshots. `globalBlockId` marks a section linked to a GlobalBlock. */
export interface StoredSection {
  id?: string;
  type: string;
  order: number;
  enabled: boolean;
  content: Record<string, unknown>;
  style?: Record<string, unknown> | null;
  globalBlockId?: string | null;
}
export interface StoredSeo {
  title?: string | null; description?: string | null; canonicalUrl?: string | null; robots?: string | null;
  ogImage?: string | null; ogTitle?: string | null; ogDescription?: string | null; twitterImage?: string | null;
  focusKeyword?: string | null; secondaryKeywords?: string | null; structuredData?: unknown;
}
export interface WorkingCopy { title: string; slug: string; pageType?: string; seo: StoredSeo; sections: StoredSection[] }

export const pageInclude = { sections: { orderBy: { order: "asc" as const } }, seo: true };
export type PageWithRelations = Prisma.PageGetPayload<{ include: typeof pageInclude }>;

export const SLUG_RE = /^\/[a-z0-9/-]*$/;

const seoOf = (s: PageWithRelations["seo"]): StoredSeo =>
  s ? {
    title: s.title, description: s.description, canonicalUrl: s.canonicalUrl, robots: s.robots, ogImage: s.ogImage, ogTitle: s.ogTitle,
    ogDescription: s.ogDescription, twitterImage: s.twitterImage, focusKeyword: s.focusKeyword, secondaryKeywords: s.secondaryKeywords,
    structuredData: s.structuredData,
  } : {};

/** What the editor sees: the unpublished draft when one exists, otherwise the live rows. */
export function workingCopy(p: PageWithRelations): WorkingCopy {
  const d = p.draft as unknown as WorkingCopy | null;
  if (d && Array.isArray(d.sections)) return d;
  return {
    title: p.title, slug: p.slug, pageType: p.pageType, seo: seoOf(p.seo),
    sections: p.sections.map((s) => ({
      id: s.id, type: s.type, order: s.order, enabled: s.enabled,
      content: (s.content ?? {}) as Record<string, unknown>, style: (s.style ?? null) as Record<string, unknown> | null, globalBlockId: s.globalBlockId,
    })),
  };
}

export function validateWorkingCopy(w: WorkingCopy): string | null {
  if (!w.title?.trim()) return "Title is required";
  if (!SLUG_RE.test(w.slug) || w.slug.includes("//")) return "Slug may contain lowercase letters, numbers, dashes and slashes";
  if (w.sections.length > 80) return "Too many sections (max 80)";
  for (const s of w.sections) if (JSON.stringify(s.content ?? {}).length > 200_000) return `Section "${s.type}" content is too large`;
  return null;
}

const json = (v: unknown) => v as Prisma.InputJsonValue;
const seoData = (s: StoredSeo) => ({
  title: s.title ?? null, description: s.description ?? null, canonicalUrl: s.canonicalUrl ?? null, robots: s.robots ?? null,
  ogImage: s.ogImage ?? null, ogTitle: s.ogTitle ?? null, ogDescription: s.ogDescription ?? null, twitterImage: s.twitterImage ?? null,
  focusKeyword: s.focusKeyword ?? null, secondaryKeywords: s.secondaryKeywords ?? null,
  ...(s.structuredData !== undefined ? { structuredData: s.structuredData === null ? Prisma.JsonNull : json(s.structuredData) } : {}),
});

/** Replaces the LIVE content of a page with `w` and clears its draft. Keeps global-block links. */
export async function applyToLive(tx: Prisma.TransactionClient, pageId: string, w: WorkingCopy, userId: string | null, extra: Prisma.PageUpdateInput = {}) {
  await tx.pageSection.deleteMany({ where: { pageId } });
  const sorted = [...w.sections].sort((a, b) => a.order - b.order);
  await tx.pageSection.createMany({
    data: sorted.map((s, i) => ({
      pageId, type: s.type, order: i, enabled: s.enabled, content: json(s.content ?? {}),
      style: s.style ? json(s.style) : Prisma.JsonNull, globalBlockId: s.globalBlockId ?? null,
    })),
  });
  await tx.seoMetadata.upsert({ where: { pageId }, update: seoData(w.seo), create: { pageId, ...seoData(w.seo) } });
  await tx.page.update({
    where: { id: pageId },
    data: { title: w.title, slug: w.slug, ...(w.pageType ? { pageType: w.pageType } : {}), ...(userId ? { updatedBy: { connect: { id: userId } } } : {}), draft: Prisma.JsonNull, ...extra },
  });
}

export async function snapshotPage(tx: Prisma.TransactionClient, pageId: string, userId: string | null, reason?: string) {
  const page = await tx.page.findUniqueOrThrow({ where: { id: pageId }, include: { sections: { orderBy: { order: "asc" } }, seo: true } });
  const last = await tx.pageVersion.aggregate({ where: { pageId }, _max: { version: true } });
  return tx.pageVersion.create({ data: { pageId, version: (last._max.version ?? 0) + 1, snapshot: json(page), createdById: userId ?? undefined, reason } });
}

export async function loadPage(tx: Prisma.TransactionClient | { page: Prisma.TransactionClient["page"] }, id: string) {
  const page = await tx.page.findFirst({ where: { id, deletedAt: null }, include: pageInclude });
  if (!page) throw new HttpError(404, "NOT_FOUND", "Page not found");
  return page;
}

export interface BlockLike { id: string; type: string; content: unknown; style: unknown }
/** Linked sections inherit the block's type/content/style at read time; unlinked sections are returned unchanged. */
export function resolveSections<S extends { type: string; content: unknown; style: unknown; globalBlockId?: string | null }>(
  sections: S[], blocks: Map<string, BlockLike>,
): S[] {
  return sections.map((s) => {
    const b = s.globalBlockId ? blocks.get(s.globalBlockId) : undefined;
    return b ? { ...s, type: b.type, content: b.content, style: b.style } : s;
  });
}
