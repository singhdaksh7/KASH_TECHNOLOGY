import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";

export const MAX_FOLDER_DEPTH = 6;
export const folderNameSchema = z.string().trim().min(1).max(80).refine((n) => !/[\\/\u0000-\u001f]/.test(n) && n !== "." && n !== "..", "Folder names cannot contain slashes or control characters");
export const createFolderSchema = z.object({ name: folderNameSchema, parentId: z.string().nullish() });
export const updateFolderSchema = z.object({ name: folderNameSchema.optional(), parentId: z.string().nullable().optional() }).refine((v) => v.name !== undefined || v.parentId !== undefined, { message: "Nothing to update" });

type Folder = { id: string; name: string; parentId: string | null };

/** Pure helpers over an in-memory folder list (the tree is small). */
export function folderPath(all: Folder[], id: string): string[] {
  const byId = new Map(all.map((f) => [f.id, f]));
  const out: string[] = [];
  for (let cur = byId.get(id), guard = 0; cur && guard < 50; cur = cur.parentId ? byId.get(cur.parentId) : undefined, guard++) out.unshift(cur.name);
  return out;
}
export const depthOf = (all: Folder[], id: string | null) => (id ? folderPath(all, id).length : 0);
export function descendantIds(all: Folder[], id: string): Set<string> {
  const out = new Set<string>();
  const stack = [id];
  while (stack.length) { const cur = stack.pop()!; for (const f of all) if (f.parentId === cur && !out.has(f.id)) { out.add(f.id); stack.push(f.id); } }
  return out;
}
export function subtreeHeight(all: Folder[], id: string): number {
  const kids = all.filter((f) => f.parentId === id);
  return 1 + (kids.length ? Math.max(...kids.map((k) => subtreeHeight(all, k.id))) : 0);
}

export async function listFolders(actor: Actor) {
  assertCan(actor, "media.view", "media.folders");
  const [folders, assetCounts] = await Promise.all([
    prisma.mediaFolder.findMany({ orderBy: { name: "asc" } }),
    prisma.mediaAsset.groupBy({ by: ["folderId"], where: { deletedAt: null }, _count: { _all: true } }),
  ]);
  const unfiled = assetCounts.find((c) => c.folderId === null)?._count._all ?? 0;
  return {
    folders: folders.map((f) => ({
      id: f.id, name: f.name, parentId: f.parentId, path: folderPath(folders, f.id).join("/"), depth: depthOf(folders, f.id),
      assetCount: assetCounts.find((c) => c.folderId === f.id)?._count._all ?? 0, childCount: folders.filter((x) => x.parentId === f.id).length, createdAt: f.createdAt, updatedAt: f.updatedAt,
    })),
    unfiledAssetCount: unfiled,
  };
}

async function assertNameFree(parentId: string | null, name: string, exceptId?: string) {
  const clash = await prisma.mediaFolder.findFirst({ where: { parentId, name: { equals: name, mode: "insensitive" }, ...(exceptId ? { id: { not: exceptId } } : {}) }, select: { id: true } });
  if (clash) throw new HttpError(409, "CONFLICT", "A folder with that name already exists here");
}

export async function createFolder(actor: Actor, input: z.infer<typeof createFolderSchema>) {
  assertCan(actor, "media.folders");
  const parentId = input.parentId ?? null;
  const all = await prisma.mediaFolder.findMany({ select: { id: true, name: true, parentId: true } });
  if (parentId && !all.some((f) => f.id === parentId)) throw new HttpError(404, "NOT_FOUND", "Parent folder not found");
  if (depthOf(all, parentId) + 1 > MAX_FOLDER_DEPTH) throw new HttpError(400, "VALIDATION_ERROR", `Folders can be nested at most ${MAX_FOLDER_DEPTH} levels deep`);
  await assertNameFree(parentId, input.name);
  return prisma.$transaction(async (tx) => {
    const f = await tx.mediaFolder.create({ data: { name: input.name, parentId, createdById: actor.id } });
    await auditTx(tx, { actorId: actor.id, action: "media_folder.create", entity: "MediaFolder", entityId: f.id, metadata: { name: f.name, parentId } });
    return f;
  });
}

export async function updateFolder(actor: Actor, id: string, input: z.infer<typeof updateFolderSchema>) {
  assertCan(actor, "media.folders");
  const all = await prisma.mediaFolder.findMany({ select: { id: true, name: true, parentId: true } });
  const cur = all.find((f) => f.id === id);
  if (!cur) throw new HttpError(404, "NOT_FOUND", "Folder not found");
  const parentId = input.parentId === undefined ? cur.parentId : input.parentId;
  const name = input.name ?? cur.name;
  if (parentId) {
    if (!all.some((f) => f.id === parentId)) throw new HttpError(404, "NOT_FOUND", "Parent folder not found");
    if (parentId === id || descendantIds(all, id).has(parentId)) throw new HttpError(400, "VALIDATION_ERROR", "A folder cannot be moved into itself or one of its subfolders");
  }
  if (depthOf(all, parentId) + subtreeHeight(all, id) > MAX_FOLDER_DEPTH) throw new HttpError(400, "VALIDATION_ERROR", `Folders can be nested at most ${MAX_FOLDER_DEPTH} levels deep`);
  await assertNameFree(parentId, name, id);
  return prisma.$transaction(async (tx) => {
    const f = await tx.mediaFolder.update({ where: { id }, data: { name, parentId } });
    await auditTx(tx, { actorId: actor.id, action: "media_folder.update", entity: "MediaFolder", entityId: id, metadata: { from: { name: cur.name, parentId: cur.parentId }, to: { name, parentId } } });
    return f;
  });
}

/** Non-empty folders are protected unless the caller explicitly asks to move the contents up one level. */
export async function deleteFolder(actor: Actor, id: string, opts: { moveContentsToParent?: boolean } = {}) {
  assertCan(actor, "media.folders");
  const folder = await prisma.mediaFolder.findUnique({ where: { id } });
  if (!folder) throw new HttpError(404, "NOT_FOUND", "Folder not found");
  const [children, assets] = await Promise.all([prisma.mediaFolder.count({ where: { parentId: id } }), prisma.mediaAsset.count({ where: { folderId: id, deletedAt: null } })]);
  if ((children || assets) && !opts.moveContentsToParent) {
    throw new HttpError(409, "FOLDER_NOT_EMPTY", "This folder still contains items. Move them first, or delete with moveContentsToParent=true.", { subfolders: children, assets });
  }
  await prisma.$transaction(async (tx) => {
    if (opts.moveContentsToParent) {
      const kids = await tx.mediaFolder.findMany({ where: { parentId: id }, select: { id: true, name: true } });
      for (const k of kids) {
        const clash = await tx.mediaFolder.findFirst({ where: { parentId: folder.parentId, name: { equals: k.name, mode: "insensitive" } }, select: { id: true } });
        if (clash) throw new HttpError(409, "CONFLICT", `A folder named "${k.name}" already exists in the destination`);
      }
      await tx.mediaFolder.updateMany({ where: { parentId: id }, data: { parentId: folder.parentId } });
      await tx.mediaAsset.updateMany({ where: { folderId: id }, data: { folderId: folder.parentId } });
    }
    await tx.mediaAsset.updateMany({ where: { folderId: id, deletedAt: { not: null } }, data: { folderId: null } }); // soft-deleted leftovers must not block the FK
    await tx.mediaFolder.delete({ where: { id } });
    await auditTx(tx, { actorId: actor.id, action: "media_folder.delete", entity: "MediaFolder", entityId: id, metadata: { name: folder.name, movedToParent: !!opts.moveContentsToParent, subfolders: children, assets } });
  });
}

export async function moveAsset(actor: Actor, assetId: string, folderId: string | null) {
  assertCan(actor, "media.folders");
  const asset = await prisma.mediaAsset.findFirst({ where: { id: assetId, deletedAt: null } });
  if (!asset) throw new HttpError(404, "NOT_FOUND", "Media asset not found");
  if (folderId && !(await prisma.mediaFolder.findUnique({ where: { id: folderId }, select: { id: true } }))) throw new HttpError(404, "NOT_FOUND", "Folder not found");
  return prisma.$transaction(async (tx) => {
    const u = await tx.mediaAsset.update({ where: { id: assetId }, data: { folderId } });
    await auditTx(tx, { actorId: actor.id, action: "media.move", entity: "MediaAsset", entityId: assetId, metadata: { from: asset.folderId, to: folderId } });
    return u;
  });
}

// ── Usage tracking ──────────────────────────────────────────────────────────
export interface MediaUsageItem {
  entityType: "Page" | "PageSection" | "GlobalBlock" | "Portfolio" | "Article" | "Header" | "Footer" | "Theme" | "Setting";
  entityId: string; label: string; location: string; pageId?: string;
}

/** LIKE pattern matching `term` anywhere, with LIKE wildcards in `term` escaped. */
export const likePattern = (term: string) => `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

export async function findMediaUsage(asset: { publicUrl: string }): Promise<MediaUsageItem[]> {
  const url = asset.publicUrl;
  const decoded = (() => { try { return decodeURI(url); } catch { return url; } })();
  const terms = [...new Set([url, decoded])].filter(Boolean);
  const items: MediaUsageItem[] = [];
  for (const term of terms) {
    const pat = likePattern(term);
    const [sections, drafts, seo, blocks, projects, articles, settings, theme] = await Promise.all([
      prisma.$queryRaw<Array<{ id: string; pageId: string; title: string }>>(Prisma.sql`SELECT ps.id, ps."pageId", p.title FROM "PageSection" ps JOIN "Page" p ON p.id = ps."pageId" WHERE p."deletedAt" IS NULL AND (ps.content::text LIKE ${pat} ESCAPE '\\' OR ps.style::text LIKE ${pat} ESCAPE '\\')`),
      prisma.$queryRaw<Array<{ id: string; title: string }>>(Prisma.sql`SELECT id, title FROM "Page" WHERE "deletedAt" IS NULL AND draft::text LIKE ${pat} ESCAPE '\\'`),
      prisma.$queryRaw<Array<{ pageId: string | null; entityType: string | null; entityId: string | null; title: string | null }>>(Prisma.sql`SELECT s."pageId", s."entityType", s."entityId", p.title FROM "SeoMetadata" s LEFT JOIN "Page" p ON p.id = s."pageId" WHERE s."ogImage" LIKE ${pat} ESCAPE '\\' OR s."twitterImage" LIKE ${pat} ESCAPE '\\'`),
      prisma.$queryRaw<Array<{ id: string; name: string }>>(Prisma.sql`SELECT id, name FROM "GlobalBlock" WHERE content::text LIKE ${pat} ESCAPE '\\' OR style::text LIKE ${pat} ESCAPE '\\'`),
      prisma.$queryRaw<Array<{ id: string; title: string }>>(Prisma.sql`SELECT id, title FROM "PortfolioProject" WHERE "deletedAt" IS NULL AND (content::text LIKE ${pat} ESCAPE '\\' OR summary LIKE ${pat} ESCAPE '\\')`),
      prisma.$queryRaw<Array<{ id: string; title: string }>>(Prisma.sql`SELECT id, title FROM "Article" WHERE "deletedAt" IS NULL AND content::text LIKE ${pat} ESCAPE '\\'`),
      prisma.$queryRaw<Array<{ id: string; key: string }>>(Prisma.sql`SELECT id, key FROM "GlobalSetting" WHERE value::text LIKE ${pat} ESCAPE '\\'`),
      prisma.$queryRaw<Array<{ id: string; key: string }>>(Prisma.sql`SELECT id, key FROM "ThemeSetting" WHERE value::text LIKE ${pat} ESCAPE '\\'`),
    ]);
    for (const s of sections) items.push({ entityType: "PageSection", entityId: s.id, pageId: s.pageId, label: s.title, location: "live section" });
    for (const d of drafts) items.push({ entityType: "Page", entityId: d.id, label: d.title, location: "unpublished draft" });
    for (const s of seo) items.push({ entityType: "Page", entityId: s.pageId ?? s.entityId ?? "", label: s.title ?? `${s.entityType ?? "Entity"} SEO`, location: "social image" });
    for (const b of blocks) items.push({ entityType: "GlobalBlock", entityId: b.id, label: b.name, location: "block content" });
    for (const p of projects) items.push({ entityType: "Portfolio", entityId: p.id, label: p.title, location: "project content" });
    for (const a of articles) items.push({ entityType: "Article", entityId: a.id, label: a.title, location: "article content" });
    for (const s of settings) items.push({ entityType: /header/i.test(s.key) ? "Header" : /footer/i.test(s.key) ? "Footer" : "Setting", entityId: s.id, label: s.key, location: "site setting" });
    for (const t of theme) items.push({ entityType: "Theme", entityId: t.id, label: t.key, location: "theme setting" });
  }
  const seen = new Set<string>();
  return items.filter((i) => { const k = `${i.entityType}:${i.entityId}:${i.location}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

export async function getAssetUsage(actor: Actor, assetId: string) {
  assertCan(actor, "media.view");
  const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
  if (!asset) throw new HttpError(404, "NOT_FOUND", "Media asset not found");
  const items = await findMediaUsage(asset);
  const byType: Record<string, number> = {};
  for (const i of items) byType[i.entityType] = (byType[i.entityType] ?? 0) + 1;
  return { assetId, publicUrl: asset.publicUrl, inUse: items.length > 0, total: items.length, byType, items };
}

/** Soft-deletes an asset. Refuses while it is referenced; `force` needs media.force_delete and is audited. */
export async function deleteMediaAsset(actor: Actor, assetId: string, opts: { force?: boolean } = {}) {
  assertCan(actor, "media.delete");
  const asset = await prisma.mediaAsset.findFirst({ where: { id: assetId, deletedAt: null } });
  if (!asset) throw new HttpError(404, "NOT_FOUND", "Media asset not found");
  const usage = await findMediaUsage(asset);
  if (usage.length && !opts.force) throw new HttpError(409, "MEDIA_IN_USE", `This file is used in ${usage.length} place${usage.length > 1 ? "s" : ""}. Remove it from those first.`, { total: usage.length, items: usage.slice(0, 50) });
  if (usage.length && opts.force) assertCan(actor, "media.force_delete");
  await prisma.$transaction(async (tx) => {
    await tx.mediaAsset.update({ where: { id: assetId }, data: { deletedAt: new Date() } });
    await auditTx(tx, { actorId: actor.id, action: opts.force && usage.length ? "media.force_delete" : "media.delete", entity: "MediaAsset", entityId: assetId, metadata: { filename: asset.filename, publicUrl: asset.publicUrl, forced: !!(opts.force && usage.length), usageCount: usage.length, usage: usage.slice(0, 25).map((u) => `${u.entityType}:${u.entityId}`) } });
  });
  return { id: assetId, deleted: true, forced: !!(opts.force && usage.length), usageCount: usage.length };
}

// ── Optimisation capability contract ────────────────────────────────────────
export type OptimizeFormat = "WEBP" | "AVIF";
const UNSUPPORTED = "Server-side image conversion is not available: the local storage provider keeps original files only and no image-processing library is a declared dependency. Enable a storage/CDN provider with transformation support to turn this on.";
export function mediaCapabilities() {
  return {
    provider: "local",
    optimization: {
      supported: false,
      formats: { WEBP: { supported: false, reason: UNSUPPORTED }, AVIF: { supported: false, reason: UNSUPPORTED } } as Record<OptimizeFormat, { supported: boolean; reason?: string }>,
    },
  };
}
export async function optimizeMedia(actor: Actor, assetId: string, format: OptimizeFormat) {
  assertCan(actor, "media.upload");
  const asset = await prisma.mediaAsset.findFirst({ where: { id: assetId, deletedAt: null } });
  if (!asset) throw new HttpError(404, "NOT_FOUND", "Media asset not found");
  if (!asset.mimeType.startsWith("image/")) throw new HttpError(400, "VALIDATION_ERROR", "Only images can be optimised");
  const cap = mediaCapabilities().optimization.formats[format];
  if (!cap.supported) throw new HttpError(501, "UNSUPPORTED_CAPABILITY", cap.reason ?? "Unsupported", { format, supported: false, originalBytes: asset.size });
  throw new HttpError(501, "UNSUPPORTED_CAPABILITY", "Unsupported"); // unreachable until a provider reports support
}
