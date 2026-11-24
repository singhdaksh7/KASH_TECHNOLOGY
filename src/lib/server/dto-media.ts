import { prisma } from "@/lib/db/prisma";
import type { MediaItem } from "@/lib/admin-client/types";
import { humanSize } from "@/lib/storage/validate";
import type { MediaAsset } from "@prisma/client";

/** Counts references to each asset URL across all JSON content (pages, drafts, projects, articles, settings). */
export async function usageCounts(urls: string[]): Promise<Map<string, number>> {
  const [sections, pages, projects, articles, globals, themes, seos] = await Promise.all([
    prisma.pageSection.findMany({ select: { content: true, style: true } }),
    prisma.page.findMany({ where: { deletedAt: null }, select: { draft: true } }),
    prisma.portfolioProject.findMany({ where: { deletedAt: null }, select: { content: true } }),
    prisma.article.findMany({ where: { deletedAt: null }, select: { content: true } }),
    prisma.globalSetting.findMany({ select: { value: true } }),
    prisma.themeSetting.findMany({ select: { value: true } }),
    prisma.seoMetadata.findMany({ select: { ogImage: true, twitterImage: true } }),
  ]);
  const corpus = JSON.stringify([sections, pages, projects, articles, globals, themes, seos]);
  const out = new Map<string, number>();
  for (const u of urls) {
    let n = 0;
    for (let i = corpus.indexOf(u); i !== -1; i = corpus.indexOf(u, i + u.length)) n++;
    out.set(u, n);
  }
  return out;
}

export function toMediaItem(m: MediaAsset, usage = 0): MediaItem {
  return {
    id: m.id, filename: m.filename, url: m.publicUrl,
    type: m.mimeType.startsWith("image/") ? "image" : m.mimeType.startsWith("video/") ? "video" : "pdf",
    altText: m.alt ?? "", title: m.title ?? "", caption: m.caption ?? "",
    folder: m.folderId ?? undefined, tags: m.tags,
    dimensions: m.width && m.height ? `${m.width}×${m.height}` : undefined, fileSize: humanSize(m.size),
    uploadedAt: m.createdAt.toISOString().slice(0, 10), usageCount: usage,
  };
}
