import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as l from "@/lib/crm/leads";
import { date, flag, int, list } from "@/lib/server/query";
import type { LeadPriority, LeadStatus } from "@prisma/client";
export const GET = admin("leads.view", async ({ request, session }) => {
  const sp = new URL(request.url).searchParams;
  const { leads, total } = await l.listLeads(actorFromSession(session), {
    status: list(sp, "status")?.map((s) => s.toUpperCase()) as LeadStatus[] | undefined, priority: list(sp, "priority")?.map((s) => s.toUpperCase()) as LeadPriority[] | undefined,
    assignee: sp.get("assignee") ?? undefined, service: sp.get("service") ?? undefined, source: sp.get("source") ?? undefined, tag: sp.get("tag") ?? undefined, q: sp.get("q") ?? undefined,
    from: date(sp, "from"), to: date(sp, "to"), followUpDue: flag(sp, "followUpDue"), limit: int(sp, "limit", 500),
  });
  const res = ok(leads);
  res.headers.set("X-Total-Count", String(total));
  return res;
});
const patch = z.object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]), note: z.string().max(5000).optional() });
export const PATCH = admin(null, async ({ request, session }) => { const d = await body(request, patch); return ok(await l.changeLeadStatus(actorFromSession(session), d.id, d.status, d.note)); });
