import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { actorFromSession } from "@/lib/rbac/actor";
import { deleteMediaAsset } from "@/lib/cms/media";
import { storage } from "@/lib/storage/local";
import { toMediaItem } from "@/lib/server/dto-media";
import { readUpload } from "../route";

const meta = z.object({ altText: z.string().max(500).optional(), title: z.string().max(300).optional(), caption: z.string().max(1000).optional() });

export const PATCH = admin<{ id: string }>("media.upload", async ({ request, session, params }) => {
  const d = await body(request, meta);
  const row = await prisma.mediaAsset.update({ where: { id: params.id }, data: { alt: d.altText, title: d.title, caption: d.caption } });
  await audit({ actorId: session.userId, action: "media.update", entity: "MediaAsset", entityId: row.id });
  return ok(toMediaItem(row));
});

/** Replace the file but keep the record; the public URL changes, so every reference is rewritten. */
export const PUT = admin<{ id: string }>("media.upload", async ({ request, session, params }) => {
  const cur = await prisma.mediaAsset.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!cur) throw new HttpError(404, "NOT_FOUND", "Media not found");
  const u = await readUpload(request);
  const stored = await storage.upload({ key: u.key, body: u.buf, mimeType: u.mime });
  const row = await prisma.mediaAsset.update({
    where: { id: cur.id },
    data: { filename: u.filename, mimeType: u.mime, size: u.buf.length, width: u.dims?.width ?? null, height: u.dims?.height ?? null, storageKey: stored.key, publicUrl: stored.publicUrl },
  });
  // Old file is kept on disk until references are updated (editors may still point at it); remove after the rewrite.
  await rewriteReferences(cur.publicUrl, stored.publicUrl);
  await storage.delete(cur.storageKey);
  await audit({ actorId: session.userId, action: "media.replace", entity: "MediaAsset", entityId: row.id });
  return ok(toMediaItem(row));
});

async function rewriteReferences(from: string, to: string) {
  const swap = (v: unknown) => JSON.parse(JSON.stringify(v).split(JSON.stringify(from).slice(1, -1)).join(JSON.stringify(to).slice(1, -1)));
  const [sections, pages, projects, articles, globals, themes] = await Promise.all([
    prisma.pageSection.findMany({ select: { id: true, content: true, style: true } }),
    prisma.page.findMany({ where: { draft: { not: undefined } }, select: { id: true, draft: true } }),
    prisma.portfolioProject.findMany({ select: { id: true, content: true } }),
    prisma.article.findMany({ select: { id: true, content: true } }),
    prisma.globalSetting.findMany({ select: { id: true, value: true } }),
    prisma.themeSetting.findMany({ select: { id: true, value: true } }),
  ]);
  const has = (v: unknown) => !!v && JSON.stringify(v).includes(from);
  for (const s of sections) if (has(s.content) || has(s.style)) await prisma.pageSection.update({ where: { id: s.id }, data: { content: swap(s.content), ...(s.style ? { style: swap(s.style) } : {}) } });
  for (const p of pages) if (has(p.draft)) await prisma.page.update({ where: { id: p.id }, data: { draft: swap(p.draft) } });
  for (const p of projects) if (has(p.content)) await prisma.portfolioProject.update({ where: { id: p.id }, data: { content: swap(p.content) } });
  for (const a of articles) if (has(a.content)) await prisma.article.update({ where: { id: a.id }, data: { content: swap(a.content) } });
  for (const g of globals) if (has(g.value)) await prisma.globalSetting.update({ where: { id: g.id }, data: { value: swap(g.value) } });
  for (const t of themes) if (has(t.value)) await prisma.themeSetting.update({ where: { id: t.id }, data: { value: swap(t.value) } });
  await prisma.seoMetadata.updateMany({ where: { ogImage: from }, data: { ogImage: to } });
  await prisma.seoMetadata.updateMany({ where: { twitterImage: from }, data: { twitterImage: to } });
}

/**
 * Refuses to delete media that is still referenced (pages, drafts, global blocks, portfolio, articles, header/footer, theme, SEO images).
 * `?force=true` additionally requires `media.force_delete` and is audited. The stored file is removed after the record is soft-deleted.
 */
export const DELETE = admin<{ id: string }>(null, async ({ request, session, params }) => {
  const row = await prisma.mediaAsset.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!row) throw new HttpError(404, "NOT_FOUND", "Media not found");
  const result = await deleteMediaAsset(actorFromSession(session), params.id, { force: new URL(request.url).searchParams.get("force") === "true" });
  await storage.delete(row.storageKey);
  return ok(result);
});
