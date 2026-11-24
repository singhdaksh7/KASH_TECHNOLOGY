import { prisma } from "@/lib/db/prisma";
import { admin, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { pageInclude } from "@/lib/cms/pages";
import { toAdminPage } from "@/lib/server/dto-pages";

export const POST = admin<{ id: string }>("pages.publish", async ({ session, params }) => {
  const page = await prisma.page.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!page) throw new HttpError(404, "NOT_FOUND", "Page not found");
  const updated = await prisma.page.update({ where: { id: page.id }, data: { status: "DRAFT", updatedById: session.userId }, include: pageInclude });
  await audit({ actorId: session.userId, action: "page.unpublish", entity: "Page", entityId: page.id });
  refreshPublicSite();
  return ok(toAdminPage(updated));
});
