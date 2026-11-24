import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError, refreshPublicSite } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { templateSlug } from "./templates";
import { RESET_ON_EDIT, resetToDraftAfterEdit } from "./page-workflow";
import { loadPage, workingCopy, type StoredSection, type WorkingCopy } from "./working-copy";

const json = (v: unknown) => v as Prisma.InputJsonValue;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "block";

export const blockSchema = z.object({
  name: z.string().trim().min(1).max(120), slug: templateSlug.optional(), type: z.string().min(1).max(60).default("custom"),
  description: z.string().max(500).nullish(), content: z.record(z.string(), z.unknown()), style: z.record(z.string(), z.unknown()).nullish(),
});
export const blockUpdateSchema = blockSchema.partial().refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" });

export interface BlockUsage { pageId: string; title: string; slug: string; status: string; sectionCount: number; live: boolean; inDraft: boolean }

/** Pages referencing a block, via live sections (relation) and unpublished drafts (JSON containment). */
export async function blockUsage(blockId: string): Promise<BlockUsage[]> {
  const [live, drafts] = await Promise.all([
    prisma.pageSection.groupBy({ by: ["pageId"], where: { globalBlockId: blockId, page: { deletedAt: null } }, _count: { _all: true } }),
    prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT id FROM "Page" WHERE "deletedAt" IS NULL AND draft->'sections' @> ${JSON.stringify([{ globalBlockId: blockId }])}::jsonb`),
  ]);
  const ids = [...new Set([...live.map((l) => l.pageId), ...drafts.map((d) => d.id)])];
  if (!ids.length) return [];
  const pages = await prisma.page.findMany({ where: { id: { in: ids } }, select: { id: true, title: true, slug: true, status: true }, orderBy: { title: "asc" } });
  return pages.map((p) => ({
    pageId: p.id, title: p.title, slug: p.slug, status: p.status,
    sectionCount: live.find((l) => l.pageId === p.id)?._count._all ?? 0, live: live.some((l) => l.pageId === p.id), inDraft: drafts.some((d) => d.id === p.id),
  }));
}

export async function listBlocks(actor: Actor) {
  assertCan(actor, "global_blocks.view");
  const [blocks, counts] = await Promise.all([
    prisma.globalBlock.findMany({ orderBy: { name: "asc" } }),
    prisma.pageSection.groupBy({ by: ["globalBlockId"], where: { globalBlockId: { not: null } }, _count: { _all: true } }),
  ]);
  return blocks.map((b) => ({ ...b, usageCount: counts.find((c) => c.globalBlockId === b.id)?._count._all ?? 0 }));
}

async function mustBlock(id: string) {
  const b = await prisma.globalBlock.findUnique({ where: { id } });
  if (!b) throw new HttpError(404, "NOT_FOUND", "Global block not found");
  return b;
}

export async function getBlock(actor: Actor, id: string) {
  assertCan(actor, "global_blocks.view");
  return { ...(await mustBlock(id)), usage: await blockUsage(id) };
}

export async function createBlock(actor: Actor, input: z.infer<typeof blockSchema>) {
  assertCan(actor, "global_blocks.manage");
  try {
    return await prisma.$transaction(async (tx) => {
      const b = await tx.globalBlock.create({ data: { name: input.name, slug: input.slug ?? slugify(input.name), type: input.type, description: input.description ?? null, content: json(input.content), style: input.style ? json(input.style) : undefined, createdById: actor.id, updatedById: actor.id } });
      await auditTx(tx, { actorId: actor.id, action: "global_block.create", entity: "GlobalBlock", entityId: b.id, metadata: { slug: b.slug } });
      return b;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A global block with that slug already exists");
    throw e;
  }
}

export async function updateBlock(actor: Actor, id: string, input: z.infer<typeof blockUpdateSchema>) {
  assertCan(actor, "global_blocks.manage");
  const before = await mustBlock(id);
  const b = await prisma.$transaction(async (tx) => {
    const u = await tx.globalBlock.update({
      where: { id },
      data: { name: input.name, slug: input.slug, type: input.type, description: input.description, content: input.content ? json(input.content) : undefined, style: input.style === undefined ? undefined : input.style ? json(input.style) : Prisma.JsonNull, updatedById: actor.id },
    });
    await auditTx(tx, { actorId: actor.id, action: "global_block.update", entity: "GlobalBlock", entityId: id, metadata: { fields: Object.keys(input) } });
    // Draft-reset rule: pages that inherit this block and are in review / approved / scheduled no longer match what was approved.
    const material = JSON.stringify([before.type, before.content, before.style]) !== JSON.stringify([u.type, u.content, u.style]);
    if (material) {
      const users = await tx.page.findMany({ where: { deletedAt: null, status: { in: RESET_ON_EDIT }, OR: [{ sections: { some: { globalBlockId: id } } }] }, select: { id: true } });
      const drafts = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT id FROM "Page" WHERE "deletedAt" IS NULL AND draft->'sections' @> ${JSON.stringify([{ globalBlockId: id }])}::jsonb`);
      for (const pid of new Set([...users.map((x) => x.id), ...drafts.map((x) => x.id)])) await resetToDraftAfterEdit(tx, pid, actor.id, `global block "${u.name}" changed`);
    }
    return u;
  }).catch((e) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A global block with that slug already exists");
    throw e;
  });
  refreshPublicSite(); // every page that inherits the block just changed
  return b;
}

/** A block that is still referenced cannot be deleted; detach it first. */
export async function deleteBlock(actor: Actor, id: string) {
  assertCan(actor, "global_blocks.manage");
  const b = await mustBlock(id);
  const usage = await blockUsage(id);
  if (usage.length) throw new HttpError(409, "BLOCK_IN_USE", `This block is used on ${usage.length} page${usage.length > 1 ? "s" : ""}. Detach it first.`, { usage });
  await prisma.$transaction(async (tx) => {
    await tx.globalBlock.delete({ where: { id } });
    await auditTx(tx, { actorId: actor.id, action: "global_block.delete", entity: "GlobalBlock", entityId: id, metadata: { slug: b.slug } });
  });
}

/**
 * Detach: linked sections become independent copies of the block's current type/content/style.
 * Without `pageId` every usage is detached (the step required before deleting a block).
 */
export async function detachBlock(actor: Actor, id: string, scope: { pageId?: string; sectionId?: string } = {}) {
  assertCan(actor, "global_blocks.manage");
  const block = await mustBlock(id);
  const result = await prisma.$transaction(async (tx) => {
    const live = await tx.pageSection.findMany({ where: { globalBlockId: id, ...(scope.pageId ? { pageId: scope.pageId } : {}), ...(scope.sectionId ? { id: scope.sectionId } : {}) }, select: { id: true } });
    for (const s of live) {
      await tx.pageSection.update({ where: { id: s.id }, data: { type: block.type, content: json(block.content), style: block.style === null ? Prisma.JsonNull : json(block.style), globalBlockId: null } });
    }
    // Drafts carry their own copy of the section list.
    const drafts = await tx.$queryRaw<Array<{ id: string; draft: WorkingCopy }>>(
      Prisma.sql`SELECT id, draft FROM "Page" WHERE "deletedAt" IS NULL AND draft->'sections' @> ${JSON.stringify([{ globalBlockId: id }])}::jsonb ${scope.pageId ? Prisma.sql`AND id = ${scope.pageId}` : Prisma.empty}`,
    );
    let draftSections = 0;
    for (const d of drafts) {
      const sections = d.draft.sections.map((s) => {
        if (s.globalBlockId !== id || (scope.sectionId && s.id !== scope.sectionId)) return s;
        draftSections++;
        return { ...s, type: block.type, content: block.content as Record<string, unknown>, style: (block.style ?? null) as Record<string, unknown> | null, globalBlockId: null };
      });
      await tx.page.update({ where: { id: d.id }, data: { draft: json({ ...d.draft, sections }) } });
    }
    await auditTx(tx, { actorId: actor.id, action: "global_block.detach", entity: "GlobalBlock", entityId: id, metadata: { pageId: scope.pageId ?? null, liveSections: live.length, draftSections } });
    return { detachedLive: live.length, detachedDraft: draftSections };
  });
  if (result.detachedLive) refreshPublicSite();
  return result;
}

/** Adds a section linked to the block to a page's working copy (creating a draft; live content is untouched until publish). */
export async function linkBlockToPage(actor: Actor, id: string, pageId: string, position?: number) {
  assertCan(actor, "pages.edit");
  assertCan(actor, "global_blocks.view");
  const block = await mustBlock(id);
  const page = await loadPage(prisma, pageId);
  const w = workingCopy(page);
  const sections: StoredSection[] = [...w.sections].sort((a, b) => a.order - b.order);
  const section: StoredSection = { id: randomUUID(), type: block.type, order: 0, enabled: true, content: {}, style: null, globalBlockId: block.id };
  sections.splice(Math.min(Math.max(position ?? sections.length, 0), sections.length), 0, section);
  const draft: WorkingCopy = { ...w, sections: sections.map((s, i) => ({ ...s, order: i })) };
  await prisma.$transaction(async (tx) => {
    await tx.page.update({ where: { id: pageId }, data: { draft: json(draft), updatedById: actor.id } });
    await auditTx(tx, { actorId: actor.id, action: "global_block.link", entity: "GlobalBlock", entityId: id, metadata: { pageId, position: position ?? null } });
  });
  return { pageId, sectionId: section.id, sections: draft.sections.length };
}
