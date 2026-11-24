import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { lead, loadOne, toLeadItem } from "@/lib/server/dto-leads";

export const GET = admin("leads.view", async () => {
  const leads = await prisma.lead.findMany({ where: { deletedAt: null }, include: lead, orderBy: { createdAt: "desc" }, take: 500 });
  return ok(leads.map(toLeadItem));
});

const patch = z.object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]) });

/** Status change: appends to statusHistory (never overwrites) and writes an audit event. */
export const PATCH = admin("leads.edit", async ({ request, session }) => {
  const d = await body(request, patch);
  const cur = await prisma.lead.findFirst({ where: { id: d.id, deletedAt: null } });
  if (!cur) throw new HttpError(404, "NOT_FOUND", "Lead not found");
  if (cur.status !== d.status) {
    const history = Array.isArray(cur.statusHistory) ? cur.statusHistory : [];
    await prisma.lead.update({ where: { id: d.id }, data: { status: d.status, statusHistory: [...history, { status: d.status, from: cur.status, at: new Date().toISOString(), by: session.userId }] } });
    await audit({ actorId: session.userId, action: "lead.status_change", entity: "Lead", entityId: d.id, metadata: { from: cur.status, to: d.status } });
  }
  return ok(toLeadItem(await loadOne(d.id)));
});
