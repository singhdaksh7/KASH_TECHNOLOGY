import { prisma } from "@/lib/db/prisma";
import { admin, body, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { clientSchema } from "@/lib/server/showcase-admin";

export const GET = admin("showcase.view", async () => {
  const clients = await prisma.client.findMany({
    include: {
      _count: { select: { reviews: true } },
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok(clients);
});

export const POST = admin("showcase.manage", async ({ request, session }) => {
  const d = await body(request, clientSchema);
  const row = await prisma.client.create({
    data: {
      ...d,
      websiteUrl: d.websiteUrl || null,
      logoUrl: d.logoUrl || null,
      photoUrl: d.photoUrl || null,
      contactName: d.contactName || null,
    },
  });
  await audit({
    actorId: session.userId,
    action: "client.create",
    entity: "Client",
    entityId: row.id,
  });
  refreshPublicSite();
  return ok(row, 201);
});
