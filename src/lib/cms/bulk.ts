import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, can, type Actor } from "@/lib/rbac/actor";
import { recordActivity } from "@/lib/crm/leads";
import { afterContentPublished } from "./publish-hooks";
import { publishPageInTx } from "./page-workflow";
import { ACTION_PERMISSIONS, FAST_TRACK_FROM, assertTransition } from "./workflow";

/**
 * Bulk operations are all-or-nothing: every id is validated first (existence, permission, legal transition),
 * then the whole batch runs in ONE transaction. Any failure rolls everything back and reports which item failed.
 */
export const BATCH_LIMITS = { pages: 50, portfolio: 50, leads: 200, media: 200 } as const;
const ids = (max: number) => z.array(z.string().min(1)).min(1).max(max).refine((a) => new Set(a).size === a.length, "Duplicate ids");

export const pagesBulkSchema = z.object({ action: z.enum(["publish", "archive", "unarchive"]), ids: ids(BATCH_LIMITS.pages) });
export const portfolioBulkSchema = z.object({ action: z.enum(["publish", "archive"]), ids: ids(BATCH_LIMITS.portfolio) });
export const leadsBulkSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("assign"), ids: ids(BATCH_LIMITS.leads), assignedToId: z.string().nullable() }),
  z.object({ action: z.literal("tag"), ids: ids(BATCH_LIMITS.leads), add: z.array(z.string().trim().min(1).max(40)).max(10).default([]), remove: z.array(z.string().trim().min(1).max(40)).max(10).default([]) }),
  z.object({ action: z.literal("status"), ids: ids(BATCH_LIMITS.leads), status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]) }),
  z.object({ action: z.literal("priority"), ids: ids(BATCH_LIMITS.leads), priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]) }),
]);
export const mediaBulkSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("move"), ids: ids(BATCH_LIMITS.media), folderId: z.string().nullable() }),
  z.object({ action: z.literal("tag"), ids: ids(BATCH_LIMITS.media), add: z.array(z.string().trim().min(1).max(40)).max(10).default([]), remove: z.array(z.string().trim().min(1).max(40)).max(10).default([]) }),
]);

export interface BulkResult { action: string; requested: number; changed: number; skipped: number; ids: { changed: string[]; skipped: string[] } }
const done = (action: string, requested: number, changed: string[], skipped: string[]): BulkResult => ({ action, requested, changed: changed.length, skipped: skipped.length, ids: { changed, skipped } });

function missing(requested: string[], found: string[]) {
  const set = new Set(found), gone = requested.filter((i) => !set.has(i));
  if (gone.length) throw new HttpError(404, "NOT_FOUND", `${gone.length} item(s) not found`, { missing: gone });
}

export async function bulkPages(actor: Actor, input: z.infer<typeof pagesBulkSchema>): Promise<BulkResult> {
  assertCan(actor, ...ACTION_PERMISSIONS[input.action === "publish" ? "publish" : input.action === "archive" ? "archive" : "unarchive"]);
  const pages = await prisma.page.findMany({ where: { id: { in: input.ids }, deletedAt: null }, select: { id: true, title: true, slug: true, status: true } });
  missing(input.ids, pages.map((p) => p.id));
  const target = input.action === "publish" ? "PUBLISHED" : input.action === "archive" ? "ARCHIVED" : "DRAFT";
  const todo: typeof pages = [], skipped: string[] = [], problems: Array<{ id: string; slug: string; reason: string }> = [];
  for (const p of pages) {
    if (p.status === target && input.action !== "unarchive") { skipped.push(p.id); continue; }
    if (input.action === "unarchive" && p.status !== "ARCHIVED") { skipped.push(p.id); continue; }
    const fastTrack = input.action === "publish" && FAST_TRACK_FROM.includes(p.status);
    if (fastTrack && !can(actor, "content.approve")) { problems.push({ id: p.id, slug: p.slug, reason: "Only an approver can publish content that has not been approved" }); continue; }
    try { assertTransition(p.status, target, { fastTrack }); todo.push(p); } catch (e) { problems.push({ id: p.id, slug: p.slug, reason: e instanceof Error ? e.message : "Invalid transition" }); }
  }
  if (problems.length) throw new HttpError(409, "BULK_REJECTED", "Nothing was changed: some items cannot make that move", { problems });
  const published: Array<{ id: string; title: string; slug: string; at: Date }> = [];
  await prisma.$transaction(async (tx) => {
    for (const p of todo) {
      if (input.action === "publish") {
        const fast = FAST_TRACK_FROM.includes(p.status);
        const r = await publishPageInTx(tx, p.id, p.status, actor.id, fast ? { approvedAt: new Date(), approvedById: actor.id } : {}, "bulk publish");
        published.push({ id: p.id, title: r.title, slug: r.slug, at: r.publishedAt });
      } else {
        const res = await tx.page.updateMany({ where: { id: p.id, status: p.status }, data: input.action === "archive" ? { status: "ARCHIVED", publishAt: null, unpublishAt: null, updatedById: actor.id } : { status: "DRAFT", updatedById: actor.id } });
        if (res.count !== 1) throw new HttpError(409, "CONFLICT", `Page ${p.slug} changed during the operation`);
      }
    }
    await auditTx(tx, { actorId: actor.id, action: `page.bulk_${input.action}`, entity: "Page", metadata: { ids: todo.map((p) => p.id), skipped } });
  });
  for (const p of published) await afterContentPublished({ entity: "Page", id: p.id, title: p.title, slug: p.slug, actorId: actor.id, via: "bulk", occurrence: String(p.at.getTime()) });
  for (const p of todo.filter((x) => input.action === "archive" && x.status === "PUBLISHED")) await afterContentPublished({ entity: "Page", id: p.id, title: p.title, slug: p.slug, actorId: actor.id, via: "bulk", action: "unpublish", occurrence: String(Date.now()) });
  return done(input.action, input.ids.length, todo.map((p) => p.id), skipped);
}

export async function bulkPortfolio(actor: Actor, input: z.infer<typeof portfolioBulkSchema>): Promise<BulkResult> {
  assertCan(actor, "portfolio.publish");
  const rows = await prisma.portfolioProject.findMany({ where: { id: { in: input.ids }, deletedAt: null }, select: { id: true, status: true, title: true, slug: true } });
  missing(input.ids, rows.map((r) => r.id));
  const target = input.action === "publish" ? "PUBLISHED" : "ARCHIVED";
  const todo = rows.filter((r) => r.status !== target), skipped = rows.filter((r) => r.status === target).map((r) => r.id);
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    if (todo.length) await tx.portfolioProject.updateMany({ where: { id: { in: todo.map((r) => r.id) } }, data: input.action === "publish" ? { status: "PUBLISHED", publishedAt: now, publishAt: null } : { status: "ARCHIVED", publishAt: null, unpublishAt: null } });
    await auditTx(tx, { actorId: actor.id, action: `portfolio.bulk_${input.action}`, entity: "PortfolioProject", metadata: { ids: todo.map((r) => r.id), skipped } });
  });
  for (const r of todo) await afterContentPublished({ entity: "PortfolioProject", id: r.id, title: r.title, slug: r.slug, actorId: actor.id, via: "bulk", action: input.action === "publish" ? "publish" : "unpublish", occurrence: String(now.getTime()) });
  return done(input.action, input.ids.length, todo.map((r) => r.id), skipped);
}

const mergeTags = (cur: string[], add: string[], remove: string[]) => {
  const rm = new Set(remove.map((t) => t.toLowerCase()));
  return [...new Set([...cur, ...add.map((t) => t.toLowerCase())])].filter((t) => !rm.has(t)).slice(0, 20);
};

export async function bulkLeads(actor: Actor, input: z.infer<typeof leadsBulkSchema>): Promise<BulkResult> {
  assertCan(actor, input.action === "assign" ? "leads.assign" : "leads.edit");
  const leads = await prisma.lead.findMany({ where: { id: { in: input.ids }, deletedAt: null } });
  missing(input.ids, leads.map((l) => l.id));
  if (input.action === "assign" && input.assignedToId && !(await prisma.user.findFirst({ where: { id: input.assignedToId, deletedAt: null, status: "ACTIVE" }, select: { id: true } }))) {
    throw new HttpError(400, "VALIDATION_ERROR", "Assignee must be an active team member");
  }
  const changed: string[] = [];
  await prisma.$transaction(async (tx) => {
    for (const l of leads) {
      if (input.action === "assign") {
        if (l.assignedToId === input.assignedToId) continue;
        await tx.lead.update({ where: { id: l.id }, data: { assignedToId: input.assignedToId } });
        await recordActivity(tx, l.id, "ASSIGNED", actor.id, { from: l.assignedToId, to: input.assignedToId, bulk: true });
      } else if (input.action === "tag") {
        const tags = mergeTags(l.tags, input.add, input.remove);
        if (tags.join() === l.tags.join()) continue;
        await tx.lead.update({ where: { id: l.id }, data: { tags } });
        await recordActivity(tx, l.id, "UPDATED", actor.id, { tags, bulk: true });
      } else if (input.action === "status") {
        if (l.status === input.status) continue;
        const history = Array.isArray(l.statusHistory) ? l.statusHistory : [];
        await tx.lead.update({ where: { id: l.id }, data: { status: input.status, statusHistory: [...history, { status: input.status, from: l.status, at: new Date().toISOString(), by: actor.id }] as Prisma.InputJsonValue } });
        await recordActivity(tx, l.id, "STATUS_CHANGED", actor.id, { from: l.status, to: input.status, bulk: true });
      } else {
        if (l.priority === input.priority) continue;
        await tx.lead.update({ where: { id: l.id }, data: { priority: input.priority } });
        await recordActivity(tx, l.id, "PRIORITY_CHANGED", actor.id, { from: l.priority, to: input.priority, bulk: true });
      }
      changed.push(l.id);
    }
    await auditTx(tx, { actorId: actor.id, action: `lead.bulk_${input.action}`, entity: "Lead", metadata: { ids: changed, requested: input.ids.length } });
  });
  return done(input.action, input.ids.length, changed, input.ids.filter((i) => !changed.includes(i)));
}

export async function bulkMedia(actor: Actor, input: z.infer<typeof mediaBulkSchema>): Promise<BulkResult> {
  assertCan(actor, input.action === "move" ? "media.folders" : "media.upload");
  const assets = await prisma.mediaAsset.findMany({ where: { id: { in: input.ids }, deletedAt: null } });
  missing(input.ids, assets.map((a) => a.id));
  if (input.action === "move" && input.folderId && !(await prisma.mediaFolder.findUnique({ where: { id: input.folderId }, select: { id: true } }))) throw new HttpError(404, "NOT_FOUND", "Folder not found");
  const changed: string[] = [];
  await prisma.$transaction(async (tx) => {
    for (const a of assets) {
      if (input.action === "move") {
        if (a.folderId === input.folderId) continue;
        await tx.mediaAsset.update({ where: { id: a.id }, data: { folderId: input.folderId } });
      } else {
        const tags = mergeTags(a.tags, input.add, input.remove);
        if (tags.join() === a.tags.join()) continue;
        await tx.mediaAsset.update({ where: { id: a.id }, data: { tags } });
      }
      changed.push(a.id);
    }
    await auditTx(tx, { actorId: actor.id, action: `media.bulk_${input.action}`, entity: "MediaAsset", metadata: { ids: changed, requested: input.ids.length, ...(input.action === "move" ? { folderId: input.folderId } : { add: input.add, remove: input.remove }) } });
  });
  return done(input.action, input.ids.length, changed, input.ids.filter((i) => !changed.includes(i)));
}
