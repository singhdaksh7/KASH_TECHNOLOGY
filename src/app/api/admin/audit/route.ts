import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import type { AuditItem } from "@/lib/admin-client/types";

export const GET = admin("audit.view", async () => {
  const rows = await prisma.auditLog.findMany({ take: 300, orderBy: { createdAt: "desc" }, include: { actor: { select: { email: true, name: true } } } });
  const out: AuditItem[] = rows.map((r) => ({
    id: r.id, action: r.action, entity: r.entity, entityId: r.entityId ?? undefined,
    actor: r.actor?.name || r.actor?.email || "system", at: r.createdAt.toISOString().replace("T", " ").slice(0, 19), metadata: r.metadata ?? undefined,
  }));
  return ok(out);
});
