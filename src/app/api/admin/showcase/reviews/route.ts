import { prisma } from "@/lib/db/prisma";
import { admin, body, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { reviewSchema } from "@/lib/server/showcase-admin";

export const GET = admin("showcase.view", async () => {
  const reviews = await prisma.clientReview.findMany({
    include: {
      client: { select: { id: true, name: true, logoUrl: true, photoUrl: true } },
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok(reviews);
});

export const POST = admin("showcase.manage", async ({ request, session }) => {
  const d = await body(request, reviewSchema);
  const row = await prisma.clientReview.create({
    data: {
      ...d,
      reviewDate: d.reviewDate ? new Date(d.reviewDate) : new Date(),
      clientId: d.clientId || null,
      companyName: d.companyName || null,
      location: d.location || null,
      photoUrl: d.photoUrl || null,
      shortReview: d.shortReview || null,
    },
  });
  await audit({
    actorId: session.userId,
    action: "review.create",
    entity: "ClientReview",
    entityId: row.id,
  });
  refreshPublicSite();
  return ok(row, 201);
});
