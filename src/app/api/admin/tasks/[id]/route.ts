import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as t from "@/lib/crm/tasks";
const patch = z.object({
  title: z.string().trim().min(1).max(200), description: z.string().max(5000).nullable(), status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]), dueAt: z.coerce.date().nullable(), assignedToId: z.string().nullable(),
  relatedType: z.enum(["LEAD", "PAGE", "ARTICLE", "PORTFOLIO"]).nullable(), relatedId: z.string().nullable(),
}).partial().strict();
export const GET = admin<{ id: string }>(null, async ({ session, params }) => ok((await t.enrichTasks([await t.getTask(actorFromSession(session), params.id)]))[0]));
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await t.updateTask(actorFromSession(session), params.id, await body(request, patch))));
export const DELETE = admin<{ id: string }>(null, async ({ session, params }) => { await t.deleteTask(actorFromSession(session), params.id); return ok({ deleted: true }); });
