import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { clientSchema } from "@/lib/server/showcase-admin";

export const GET = admin<{ id: string }>("showcase.view", async ({ params }) => {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { reviews: true },
  });
  if (!client) throw new HttpError(404, "NOT_FOUND", "Client not found");
  return ok(client);
});

export const PUT = admin<{ id: string }>("showcase.manage", async ({ request, params, session }) => {
  const d = await body(request, clientSchema);
  const row = await prisma.client.update({
    where: { id: params.id },
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
    action: "client.update",
    entity: "Client",
    entityId: row.id,
  });
  refreshPublicSite();
  return ok(row);
});

export const DELETE = admin<{ id: string }>("showcase.manage", async ({ params, session }) => {
  await prisma.client.delete({ where: { id: params.id } });
  await audit({
    actorId: session.userId,
    action: "client.delete",
    entity: "Client",
    entityId: params.id,
  });
  refreshPublicSite();
  return ok({ deleted: true });
});

