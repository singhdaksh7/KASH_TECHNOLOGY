import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { reviewSchema } from "@/lib/server/showcase-admin";

export const GET = admin<{ id: string }>("showcase.view", async ({ params }) => {
  const review = await prisma.clientReview.findUnique({
    where: { id: params.id },
    include: { client: true },
  });
  if (!review) throw new HttpError(404, "NOT_FOUND", "Review not found");
  return ok(review);
});

export const PUT = admin<{ id: string }>("showcase.manage", async ({ request, params, session }) => {
  const d = await body(request, reviewSchema);
  const row = await prisma.clientReview.update({
    where: { id: params.id },
    data: {
      ...d,
      reviewDate: d.reviewDate ? new Date(d.reviewDate) : undefined,
      clientId: d.clientId || null,
      companyName: d.companyName || null,
      location: d.location || null,
      photoUrl: d.photoUrl || null,
      shortReview: d.shortReview || null,
    },
  });
  await audit({
    actorId: session.userId,
    action: "review.update",
    entity: "ClientReview",
    entityId: row.id,
  });
  refreshPublicSite();
  return ok(row);
});

export const DELETE = admin<{ id: string }>("showcase.manage", async ({ params, session }) => {
  await prisma.clientReview.delete({ where: { id: params.id } });
  await audit({
    actorId: session.userId,
    action: "review.delete",
    entity: "ClientReview",
    entityId: params.id,
  });
  refreshPublicSite();
  return ok({ deleted: true });
});

