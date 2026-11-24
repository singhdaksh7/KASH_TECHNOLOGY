import { z } from "zod";
import type { LeadPriority, LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { buildLeadWhere, changeLeadStatus } from "@/lib/crm/leads";
import { lead, loadLeadTasks, loadOne, toLeadItem } from "@/lib/server/dto-leads";
import { date, flag, int, list } from "@/lib/server/query";

/** Lead list (UI-shaped). Filters: status, priority, assignee (me|unassigned|id), service, source, tag, q, from, to, followUpDue, limit. Total in X-Total-Count. */
export const GET = admin("leads.view", async ({ request, session }) => {
  const sp = new URL(request.url).searchParams;
  const where = buildLeadWhere({
    status: list(sp, "status")?.map((s) => s.toUpperCase()) as LeadStatus[] | undefined, priority: list(sp, "priority")?.map((s) => s.toUpperCase()) as LeadPriority[] | undefined,
    assignee: sp.get("assignee") ?? undefined, service: sp.get("service") ?? undefined, source: sp.get("source") ?? undefined, tag: sp.get("tag") ?? undefined, q: sp.get("q") ?? undefined,
    from: date(sp, "from"), to: date(sp, "to"), followUpDue: flag(sp, "followUpDue"),
  }, session.userId);
  const [rows, total] = await Promise.all([prisma.lead.findMany({ where, include: lead, orderBy: { createdAt: "desc" }, take: Math.min(int(sp, "limit", 500), 1000) }), prisma.lead.count({ where })]);
  const tasks = await loadLeadTasks(rows.map((r) => r.id));
  const res = ok(rows.map((r) => toLeadItem(r, tasks.get(r.id) ?? [])));
  res.headers.set("X-Total-Count", String(total));
  return res;
});

const patch = z.object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]) });

/** Status change: append-only history + LeadActivity + audit (Phase 2 service). */
export const PATCH = admin(null, async ({ request, session }) => {
  const d = await body(request, patch);
  await changeLeadStatus(actorFromSession(session), d.id, d.status as LeadStatus);
  return ok(toLeadItem(await loadOne(d.id)));
});
