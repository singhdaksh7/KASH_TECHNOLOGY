import { Prisma, type LeadPriority, type LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, can, type Actor } from "@/lib/rbac/actor";
import { notifySafe, usersWithPermission } from "@/lib/notifications";

export const LEAD_ACTIVITY_TYPES = ["CREATED", "STATUS_CHANGED", "ASSIGNED", "NOTE_ADDED", "FOLLOW_UP_SET", "EMAIL_SENT", "TASK_CREATED", "PRIORITY_CHANGED", "UPDATED"] as const;
export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPES)[number];

type Db = Prisma.TransactionClient | typeof prisma;
const json = (v: unknown) => v as Prisma.InputJsonValue;

/** Appends a LeadActivity and bumps Lead.lastActivityAt in one step. */
export async function recordActivity(db: Db, leadId: string, type: LeadActivityType, actorId: string | null, metadata?: Record<string, unknown>) {
  const now = new Date();
  await db.leadActivity.create({ data: { leadId, type, actorId: actorId ?? undefined, metadata: metadata ? json(metadata) : undefined, createdAt: now } });
  await db.lead.update({ where: { id: leadId }, data: { lastActivityAt: now } });
}

/** Called after any public lead creation: CREATED activity + one NEW_LEAD notification per lead. Never throws. */
export async function onLeadCreated(lead: { id: string; name?: string | null; service?: string | null; source?: string | null }) {
  try {
    await recordActivity(prisma, lead.id, "CREATED", null, { source: lead.source ?? null });
    await notifySafe({
      userIds: await usersWithPermission("leads.view"), type: "NEW_LEAD", title: `New lead${lead.name ? `: ${lead.name}` : ""}`,
      message: `${lead.service ? `Interested in ${lead.service}. ` : ""}Source: ${lead.source ?? "website"}.`, entityType: "Lead", entityId: lead.id,
      link: `/admin/leads`, dedupeKey: `lead:${lead.id}:new`,
    });
  } catch (e) {
    console.error("[leads] post-create hooks failed", e instanceof Error ? e.message : e);
  }
}

export const logEmailSent = (leadId: string, metadata: Record<string, unknown>) => recordActivity(prisma, leadId, "EMAIL_SENT", null, metadata).catch(() => undefined);

export interface LeadFilters {
  status?: LeadStatus[]; priority?: LeadPriority[]; assignee?: string; service?: string; source?: string; tag?: string; q?: string;
  from?: Date; to?: Date; followUpDue?: boolean; limit?: number;
}

export function buildLeadWhere(f: LeadFilters, actorId: string): Prisma.LeadWhereInput {
  const and: Prisma.LeadWhereInput[] = [{ deletedAt: null }];
  if (f.status?.length) and.push({ status: { in: f.status } });
  if (f.priority?.length) and.push({ priority: { in: f.priority } });
  if (f.assignee === "unassigned") and.push({ assignedToId: null });
  else if (f.assignee) and.push({ assignedToId: f.assignee === "me" ? actorId : f.assignee });
  if (f.service) and.push({ service: { contains: f.service, mode: "insensitive" } });
  if (f.source) and.push({ source: { contains: f.source, mode: "insensitive" } });
  if (f.tag) and.push({ tags: { has: f.tag } });
  if (f.from || f.to) and.push({ createdAt: { ...(f.from ? { gte: f.from } : {}), ...(f.to ? { lte: f.to } : {}) } });
  if (f.followUpDue) and.push({ nextFollowUpAt: { lte: new Date() }, status: { notIn: ["WON", "LOST"] } });
  if (f.q) and.push({ OR: ["name", "email", "company", "phone"].map((k) => ({ [k]: { contains: f.q, mode: "insensitive" } })) as Prisma.LeadWhereInput[] });
  return { AND: and };
}

const leadInclude = { notes: { orderBy: { createdAt: "desc" as const } }, assignedTo: { select: { id: true, name: true, email: true } } };

/** Decimal → number so JSON clients get a number, not a string. */
export const leadOut = <T extends { estimatedValue: Prisma.Decimal | null }>(l: T) => ({ ...l, estimatedValue: l.estimatedValue == null ? null : Number(l.estimatedValue) });

export async function listLeads(actor: Actor, f: LeadFilters) {
  const where = buildLeadWhere(f, actor.id);
  const [rows, total] = await Promise.all([
    prisma.lead.findMany({ where, include: leadInclude, orderBy: { createdAt: "desc" }, take: Math.min(f.limit ?? 500, 1000) }),
    prisma.lead.count({ where }),
  ]);
  return { leads: rows.map(leadOut), total };
}

export async function getLeadDetail(id: string) {
  const lead = await prisma.lead.findFirst({
    where: { id, deletedAt: null },
    include: { ...leadInclude, activities: { orderBy: { createdAt: "desc" }, take: 200 }, submissions: { orderBy: { createdAt: "desc" }, take: 20, select: { id: true, formId: true, values: true, createdAt: true, emailStatus: true } } },
  });
  if (!lead) throw new HttpError(404, "NOT_FOUND", "Lead not found");
  const tasks = await prisma.task.findMany({ where: { relatedType: "LEAD", relatedId: id }, orderBy: { createdAt: "desc" }, take: 50 });
  return { ...leadOut(lead), tasks };
}

async function mustLead(id: string) {
  const lead = await prisma.lead.findFirst({ where: { id, deletedAt: null } });
  if (!lead) throw new HttpError(404, "NOT_FOUND", "Lead not found");
  return lead;
}

/** Status change keeps the full history (append-only) and logs the activity. Optionally adds a note. */
export async function changeLeadStatus(actor: Actor, id: string, status: LeadStatus, note?: string) {
  assertCan(actor, "leads.edit");
  const cur = await mustLead(id);
  await prisma.$transaction(async (tx) => {
    if (cur.status !== status) {
      const history = Array.isArray(cur.statusHistory) ? cur.statusHistory : [];
      await tx.lead.update({ where: { id }, data: { status, statusHistory: json([...history, { status, from: cur.status, at: new Date().toISOString(), by: actor.id }]) } });
      await recordActivity(tx, id, "STATUS_CHANGED", actor.id, { from: cur.status, to: status });
      await auditTx(tx, { actorId: actor.id, action: "lead.status_change", entity: "Lead", entityId: id, metadata: { from: cur.status, to: status } });
    }
    if (note?.trim()) {
      await tx.leadNote.create({ data: { leadId: id, authorId: actor.id, body: note.trim() } });
      await recordActivity(tx, id, "NOTE_ADDED", actor.id, { length: note.trim().length });
    }
  });
  return getLeadDetail(id);
}

export async function addLeadNote(actor: Actor, id: string, body: string) {
  assertCan(actor, "leads.edit");
  await mustLead(id);
  const note = await prisma.$transaction(async (tx) => {
    const n = await tx.leadNote.create({ data: { leadId: id, authorId: actor.id, body: body.trim() } });
    await recordActivity(tx, id, "NOTE_ADDED", actor.id, { noteId: n.id });
    return n;
  });
  return note;
}

export async function assignLead(actor: Actor, id: string, assignedToId: string | null) {
  assertCan(actor, "leads.assign");
  const cur = await mustLead(id);
  if (assignedToId) {
    const u = await prisma.user.findFirst({ where: { id: assignedToId, deletedAt: null, status: "ACTIVE" }, select: { id: true } });
    if (!u) throw new HttpError(400, "VALIDATION_ERROR", "Assignee must be an active team member");
  }
  if (cur.assignedToId === assignedToId) return getLeadDetail(id);
  await prisma.$transaction(async (tx) => {
    await tx.lead.update({ where: { id }, data: { assignedToId } });
    await recordActivity(tx, id, "ASSIGNED", actor.id, { from: cur.assignedToId, to: assignedToId });
    await auditTx(tx, { actorId: actor.id, action: "lead.assign", entity: "Lead", entityId: id, metadata: { from: cur.assignedToId, to: assignedToId } });
  });
  if (assignedToId && assignedToId !== actor.id) {
    await notifySafe({
      userIds: [assignedToId], type: "LEAD_ASSIGNED", title: `Lead assigned: ${cur.name ?? cur.email ?? "Unnamed"}`, message: "A lead was assigned to you.",
      entityType: "Lead", entityId: id, link: "/admin/leads", dedupeKey: `lead:${id}:assigned:${assignedToId}:${Date.now()}`,
    });
  }
  return getLeadDetail(id);
}

export async function setLeadFollowUp(actor: Actor, id: string, nextFollowUpAt: Date | null, note?: string) {
  assertCan(actor, "leads.manage_followup");
  const cur = await mustLead(id);
  await prisma.$transaction(async (tx) => {
    await tx.lead.update({ where: { id }, data: { nextFollowUpAt } });
    await recordActivity(tx, id, "FOLLOW_UP_SET", actor.id, { from: cur.nextFollowUpAt?.toISOString() ?? null, to: nextFollowUpAt?.toISOString() ?? null });
    if (note?.trim()) {
      await tx.leadNote.create({ data: { leadId: id, authorId: actor.id, body: note.trim() } });
      await recordActivity(tx, id, "NOTE_ADDED", actor.id, { via: "follow_up" });
    }
    await auditTx(tx, { actorId: actor.id, action: "lead.follow_up", entity: "Lead", entityId: id, metadata: { to: nextFollowUpAt?.toISOString() ?? null } });
  });
  return getLeadDetail(id);
}

export async function updateLeadMeta(actor: Actor, id: string, input: { priority?: LeadPriority; estimatedValue?: number | null; tags?: string[] }) {
  assertCan(actor, "leads.edit");
  const cur = await mustLead(id);
  const data: Prisma.LeadUpdateInput = {};
  const changes: Record<string, unknown> = {};
  if (input.priority && input.priority !== cur.priority) { data.priority = input.priority; changes.priority = { from: cur.priority, to: input.priority }; }
  if (input.estimatedValue !== undefined) { data.estimatedValue = input.estimatedValue; changes.estimatedValue = { to: input.estimatedValue }; }
  if (input.tags) { data.tags = [...new Set(input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 20); changes.tags = data.tags; }
  if (!Object.keys(changes).length) return getLeadDetail(id);
  await prisma.$transaction(async (tx) => {
    await tx.lead.update({ where: { id }, data });
    await recordActivity(tx, id, input.priority && input.priority !== cur.priority ? "PRIORITY_CHANGED" : "UPDATED", actor.id, changes);
    await auditTx(tx, { actorId: actor.id, action: "lead.update", entity: "Lead", entityId: id, metadata: json(changes) });
  });
  return getLeadDetail(id);
}

/** Used by bulk operations to decide per-action permission. */
export const canBulkLead = (actor: Actor, action: "assign" | "tag" | "status" | "priority") => can(actor, action === "assign" ? "leads.assign" : "leads.edit");
