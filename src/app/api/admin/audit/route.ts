import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";

export const GET = admin("audit.view", async ({ request }) => {
  const url = new URL(request.url);
  const actor = url.searchParams.get("actor");
  const action = url.searchParams.get("action");
  const entity = url.searchParams.get("entity");

  const where: Prisma.AuditLogWhereInput = {};
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (entity) where.entity = { contains: entity, mode: "insensitive" };
  if (actor) {
    where.actor = {
      OR: [
        { name: { contains: actor, mode: "insensitive" } },
        { email: { contains: actor, mode: "insensitive" } },
      ],
    };
  }

  const rows = await prisma.auditLog.findMany({
    where,
    take: 300,
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { email: true, name: true } } },
  });

  const out = rows.map((r) => ({
    id: r.id,
    action: r.action,
    entity: r.entity,
    entityId: r.entityId ?? undefined,
    actor: r.actor?.name || r.actor?.email || "system",
    at: r.createdAt.toISOString().replace("T", " ").slice(0, 19),
    metadata: r.metadata ?? undefined,
  }));

  return ok(out);
});
