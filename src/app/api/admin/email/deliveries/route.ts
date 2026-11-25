import { z } from "zod";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession, assertCan } from "@/lib/rbac/actor";
import { prisma } from "@/lib/db/prisma";
import { safeSelect } from "@/lib/email/lead-mail";

/** Email delivery log (safe columns only: no provider payloads, no secrets). */
export const GET = admin(null, async ({ request, session }) => {
  assertCan(actorFromSession(session), "email_logs.view");
  const u = new URL(request.url);
  const status = z.enum(["QUEUED", "SENT", "FAILED", "SKIPPED"]).safeParse(u.searchParams.get("status") ?? undefined);
  const limit = Math.min(Math.max(Number(u.searchParams.get("limit")) || 100, 1), 200);
  const rows = await prisma.emailDelivery.findMany({ where: status.success ? { status: status.data } : {}, orderBy: { createdAt: "desc" }, take: limit, select: safeSelect });
  const leadIds = [...new Set(rows.filter((r) => r.entityType === "Lead" && r.entityId).map((r) => r.entityId as string))];
  const leads = leadIds.length ? await prisma.lead.findMany({ where: { id: { in: leadIds } }, select: { id: true, name: true } }) : [];
  return ok(rows.map((r) => ({ ...r, leadName: leads.find((l) => l.id === r.entityId)?.name ?? null })));
});
