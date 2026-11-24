import { Prisma, type LeadPriority, type TaskRelationType, type TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, can, type Actor } from "@/lib/rbac/actor";
import { notifySafe } from "@/lib/notifications";
import { recordActivity } from "./leads";

const RELATION_PERMISSION: Record<TaskRelationType, string> = { LEAD: "leads.view", PAGE: "pages.view", ARTICLE: "articles.view", PORTFOLIO: "portfolio.view" };

async function relatedExists(type: TaskRelationType, id: string) {
  const where = { id, deletedAt: null };
  const n = type === "LEAD" ? await prisma.lead.count({ where }) : type === "PAGE" ? await prisma.page.count({ where })
    : type === "ARTICLE" ? await prisma.article.count({ where }) : await prisma.portfolioProject.count({ where });
  return n > 0;
}

async function checkRelation(actor: Actor, relatedType?: TaskRelationType | null, relatedId?: string | null) {
  if (!relatedType && !relatedId) return;
  if (!relatedType || !relatedId) throw new HttpError(400, "VALIDATION_ERROR", "relatedType and relatedId must be provided together");
  assertCan(actor, RELATION_PERMISSION[relatedType]);
  if (!(await relatedExists(relatedType, relatedId))) throw new HttpError(404, "NOT_FOUND", `${relatedType} not found`);
}

async function checkAssignee(id?: string | null) {
  if (!id) return;
  if (!(await prisma.user.findFirst({ where: { id, deletedAt: null, status: "ACTIVE" }, select: { id: true } }))) throw new HttpError(400, "VALIDATION_ERROR", "Assignee must be an active team member");
}

/** tasks.manage sees everything; tasks.view sees tasks assigned to or created by the caller. */
const visibility = (actor: Actor): Prisma.TaskWhereInput => (can(actor, "tasks.manage") ? {} : { OR: [{ assignedToId: actor.id }, { createdById: actor.id }] });

export interface TaskFilters { status?: TaskStatus[]; priority?: LeadPriority[]; assignee?: string; relatedType?: TaskRelationType; relatedId?: string; overdue?: boolean; q?: string; limit?: number }

export async function listTasks(actor: Actor, f: TaskFilters) {
  assertCan(actor, "tasks.view", "tasks.manage");
  const and: Prisma.TaskWhereInput[] = [visibility(actor)];
  if (f.status?.length) and.push({ status: { in: f.status } });
  if (f.priority?.length) and.push({ priority: { in: f.priority } });
  if (f.assignee === "unassigned") and.push({ assignedToId: null });
  else if (f.assignee) and.push({ assignedToId: f.assignee === "me" ? actor.id : f.assignee });
  if (f.relatedType) and.push({ relatedType: f.relatedType });
  if (f.relatedId) and.push({ relatedId: f.relatedId });
  if (f.overdue) and.push({ dueAt: { lt: new Date() }, status: { in: ["TODO", "IN_PROGRESS"] } });
  if (f.q) and.push({ title: { contains: f.q, mode: "insensitive" } });
  return prisma.task.findMany({
    where: { AND: and }, orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }], take: Math.min(f.limit ?? 200, 500),
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });
}

async function mustVisibleTask(actor: Actor, id: string) {
  assertCan(actor, "tasks.view", "tasks.manage");
  const task = await prisma.task.findFirst({ where: { id, ...visibility(actor) }, include: { assignedTo: { select: { id: true, name: true, email: true } } } });
  if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");
  return task;
}
export const getTask = mustVisibleTask;

export interface TaskInput { title: string; description?: string | null; status?: TaskStatus; priority?: LeadPriority; dueAt?: Date | null; assignedToId?: string | null; relatedType?: TaskRelationType | null; relatedId?: string | null }

export async function createTask(actor: Actor, input: TaskInput) {
  assertCan(actor, "tasks.manage");
  await checkRelation(actor, input.relatedType, input.relatedId);
  await checkAssignee(input.assignedToId);
  const task = await prisma.$transaction(async (tx) => {
    const t = await tx.task.create({
      data: { title: input.title, description: input.description ?? null, status: input.status ?? "TODO", priority: input.priority ?? "MEDIUM", dueAt: input.dueAt ?? null,
        assignedToId: input.assignedToId ?? null, relatedType: input.relatedType ?? null, relatedId: input.relatedId ?? null, createdById: actor.id,
        completedAt: input.status === "DONE" ? new Date() : null },
    });
    if (t.relatedType === "LEAD" && t.relatedId) await recordActivity(tx, t.relatedId, "TASK_CREATED", actor.id, { taskId: t.id, title: t.title });
    await auditTx(tx, { actorId: actor.id, action: "task.create", entity: "Task", entityId: t.id, metadata: { related: t.relatedType ? `${t.relatedType}:${t.relatedId}` : null } });
    return t;
  });
  if (task.assignedToId && task.assignedToId !== actor.id) {
    await notifySafe({ userIds: [task.assignedToId], type: "TASK_ASSIGNED", title: `Task assigned: ${task.title}`, message: task.dueAt ? `Due ${task.dueAt.toISOString()}` : "A task was assigned to you.", entityType: "Task", entityId: task.id, link: "/admin/tasks", dedupeKey: `task:${task.id}:assigned:${task.assignedToId}` });
  }
  return task;
}

export async function updateTask(actor: Actor, id: string, input: Partial<TaskInput>) {
  const cur = await mustVisibleTask(actor, id);
  const statusOnly = Object.keys(input).every((k) => k === "status") && Object.keys(input).length > 0;
  if (!can(actor, "tasks.manage")) {
    // tasks.view holders may only move the status of a task that is assigned to them.
    if (!(statusOnly && cur.assignedToId === actor.id)) throw new HttpError(403, "FORBIDDEN", "Insufficient permission");
  }
  if (input.assignedToId !== undefined) await checkAssignee(input.assignedToId);
  if (input.relatedType !== undefined || input.relatedId !== undefined) await checkRelation(actor, input.relatedType ?? cur.relatedType, input.relatedId ?? cur.relatedId);
  const data: Prisma.TaskUncheckedUpdateInput = { ...input };
  if (input.status) data.completedAt = input.status === "DONE" ? cur.completedAt ?? new Date() : null;
  const task = await prisma.$transaction(async (tx) => {
    const t = await tx.task.update({ where: { id }, data });
    await auditTx(tx, { actorId: actor.id, action: "task.update", entity: "Task", entityId: id, metadata: { fields: Object.keys(input) } });
    return t;
  });
  if (input.assignedToId && input.assignedToId !== cur.assignedToId && input.assignedToId !== actor.id) {
    await notifySafe({ userIds: [input.assignedToId], type: "TASK_ASSIGNED", title: `Task assigned: ${task.title}`, message: "A task was assigned to you.", entityType: "Task", entityId: id, link: "/admin/tasks", dedupeKey: `task:${id}:assigned:${input.assignedToId}` });
  }
  return task;
}

export async function deleteTask(actor: Actor, id: string) {
  assertCan(actor, "tasks.manage");
  await mustVisibleTask(actor, id);
  await prisma.$transaction(async (tx) => {
    await tx.task.delete({ where: { id } });
    await auditTx(tx, { actorId: actor.id, action: "task.delete", entity: "Task", entityId: id });
  });
}
