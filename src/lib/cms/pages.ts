import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { SECTION_LABELS } from "./section-compat";

/** A section as stored in drafts and snapshots (canonical ids, not builder labels). */
export interface StoredSection {
  id: string;
  type: string;
  order: number;
  enabled: boolean;
  content: Record<string, unknown>;
  style?: Record<string, unknown> | null;
}
export interface StoredSeo {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterImage?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string | null;
}
export interface WorkingCopy {
  title: string;
  slug: string;
  pageType?: string;
  seo: StoredSeo;
  sections: StoredSection[];
}

export type PageWithRelations = Prisma.PageGetPayload<{ include: { sections: true; seo: true; updatedBy: { select: { name: true; email: true } } } }>;
export const pageInclude = { sections: { orderBy: { order: "asc" as const } }, seo: true, updatedBy: { select: { name: true, email: true } } };

const seoOf = (s: PageWithRelations["seo"]): StoredSeo =>
  s
    ? {
        title: s.title, description: s.description, canonicalUrl: s.canonicalUrl, robots: s.robots, ogImage: s.ogImage,
        ogTitle: s.ogTitle, ogDescription: s.ogDescription, twitterImage: s.twitterImage,
        focusKeyword: s.focusKeyword, secondaryKeywords: s.secondaryKeywords,
      }
    : {};

/** What the admin edits: the unpublished draft when present, otherwise the live content. */
export function workingCopy(p: PageWithRelations): WorkingCopy {
  const d = p.draft as unknown as WorkingCopy | null;
  if (d && Array.isArray(d.sections)) return d;
  return {
    title: p.title,
    slug: p.slug,
    pageType: p.pageType,
    seo: seoOf(p.seo),
    sections: p.sections.map((s) => ({
      id: s.id, type: s.type, order: s.order, enabled: s.enabled,
      content: (s.content ?? {}) as Record<string, unknown>, style: (s.style ?? null) as Record<string, unknown> | null,
    })),
  };
}

export const hasUnpublishedChanges = (p: PageWithRelations) => !!p.draft;

/** Publishing validation: every section type must be renderable; content must be bounded JSON. */
export function validateWorkingCopy(w: WorkingCopy): string | null {
  if (!w.title.trim()) return "Title is required";
  if (!/^\/[a-z0-9/-]*$/.test(w.slug) || w.slug.includes("//")) return "Slug may contain lowercase letters, numbers, dashes and slashes";
  if (w.sections.length > 80) return "Too many sections (max 80)";
  for (const s of w.sections) {
    if (!(s.type in SECTION_LABELS)) return `Unsupported section type "${s.type}"`;
    if (JSON.stringify(s.content ?? {}).length > 200_000) return `Section "${s.type}" content is too large`;
  }
  return null;
}

const toInputJson = (v: unknown) => v as Prisma.InputJsonValue;
const seoData = (s: StoredSeo) => ({
  title: s.title ?? null, description: s.description ?? null, canonicalUrl: s.canonicalUrl ?? null, robots: s.robots ?? null,
  ogImage: s.ogImage ?? null, ogTitle: s.ogTitle ?? null, ogDescription: s.ogDescription ?? null, twitterImage: s.twitterImage ?? null,
  focusKeyword: s.focusKeyword ?? null, secondaryKeywords: s.secondaryKeywords ?? null,
});

/** Replaces the LIVE content of a page with `w` (used by publish and restore). */
export async function applyToLive(
  tx: Prisma.TransactionClient,
  pageId: string,
  w: WorkingCopy,
  userId: string,
  extra: Prisma.PageUpdateInput = {},
) {
  await tx.pageSection.deleteMany({ where: { pageId } });
  const sorted = [...w.sections].sort((a, b) => a.order - b.order);
  await tx.pageSection.createMany({
    data: sorted.map((s, i) => ({
      pageId, type: s.type, order: i, enabled: s.enabled, content: toInputJson(s.content ?? {}),
      style: s.style ? toInputJson(s.style) : Prisma.JsonNull,
    })),
  });
  await tx.seoMetadata.upsert({ where: { pageId }, update: seoData(w.seo), create: { pageId, ...seoData(w.seo) } });
  await tx.page.update({
    where: { id: pageId },
    data: { title: w.title, slug: w.slug, ...(w.pageType ? { pageType: w.pageType } : {}), updatedBy: { connect: { id: userId } }, draft: Prisma.JsonNull, ...extra },
  });
}

export async function snapshotPage(pageId: string, userId: string, reason?: string, client: Prisma.TransactionClient | typeof prisma = prisma) {
  const page = await client.page.findUniqueOrThrow({ where: { id: pageId }, include: { sections: { orderBy: { order: "asc" } }, seo: true } });
  const last = await client.pageVersion.aggregate({ where: { pageId }, _max: { version: true } });
  return client.pageVersion.create({
    data: { pageId, version: (last._max.version ?? 0) + 1, snapshot: toInputJson(page), createdById: userId, reason },
  });
}

export async function restorePage(pageId: string, version: number, userId: string) {
  const pv = await prisma.pageVersion.findUniqueOrThrow({ where: { pageId_version: { pageId, version } } });
  const snap = pv.snapshot as unknown as {
    title: string; slug: string; pageType: string;
    sections: StoredSection[]; seo: (StoredSeo & { id?: string }) | null;
  };
  const w: WorkingCopy = { title: snap.title, slug: snap.slug, pageType: snap.pageType, seo: snap.seo ?? {}, sections: snap.sections ?? [] };
  const problem = validateWorkingCopy(w);
  if (problem) throw new Error(problem);
  return prisma.$transaction(async (tx) => {
    await applyToLive(tx, pageId, w, userId);
    return snapshotPage(pageId, userId, `restore v${version}`, tx);
  });
}
