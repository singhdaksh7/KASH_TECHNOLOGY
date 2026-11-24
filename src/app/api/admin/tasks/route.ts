import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as t from "@/lib/crm/tasks";
import { int, list } from "@/lib/server/query";
import { flag } from "@/lib/server/query";
import type { LeadPriority, TaskRelationType, TaskStatus } from "@prisma/client";
export const taskSchema = z.object({
  title: z.string().trim().min(1).max(200), description: z.string().max(5000).nullish(), status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(), dueAt: z.coerce.date().nullish(), assignedToId: z.string().nullish(),
  relatedType: z.enum(["LEAD", "PAGE", "ARTICLE", "PORTFOLIO"]).nullish(), relatedId: z.string().nullish(),
});
export const GET = admin(null, async ({ request, session }) => {
  const sp = new URL(request.url).searchParams;
  return ok(await t.listTasks(actorFromSession(session), { status: list(sp, "status")?.map((s) => s.toUpperCase()) as TaskStatus[] | undefined, priority: list(sp, "priority")?.map((s) => s.toUpperCase()) as LeadPriority[] | undefined,
    assignee: sp.get("assignee") ?? undefined, relatedType: (sp.get("relatedType")?.toUpperCase() as TaskRelationType | undefined), relatedId: sp.get("relatedId") ?? undefined, overdue: flag(sp, "overdue"), q: sp.get("q") ?? undefined, limit: int(sp, "limit", 200) }));
});
export const POST = admin(null, async ({ request, session }) => ok(await t.createTask(actorFromSession(session), await body(request, taskSchema)), 201));
