import { prisma } from "@/lib/db/prisma";
import { admin, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { applyToLive, pageInclude, snapshotPage, validateWorkingCopy, workingCopy } from "@/lib/cms/pages";
import { toAdminPage } from "@/lib/server/dto-pages";

/** Publish: validate → apply the working copy to live rows → PageVersion → audit → refresh public site. */
export const POST = admin<{ id: string }>("pages.publish", async ({ session, params }) => {
  const page = await prisma.page.findFirst({ where: { id: params.id, deletedAt: null }, include: pageInclude });
  if (!page) throw new HttpError(404, "NOT_FOUND", "Page not found");
  const w = workingCopy(page);
  const problem = validateWorkingCopy(w);
  if (problem) throw new HttpError(400, "VALIDATION_ERROR", problem);
  const clash = await prisma.page.findFirst({ where: { slug: w.slug, id: { not: page.id }, deletedAt: null }, select: { id: true } });
  if (clash) throw new HttpError(409, "CONFLICT", "Another page already uses that slug");
  await prisma.$transaction(async (tx) => {
    await applyToLive(tx, page.id, w, session.userId, { status: "PUBLISHED", publishedAt: new Date() });
    await snapshotPage(page.id, session.userId, "publish", tx);
  });
  await audit({ actorId: session.userId, action: "page.publish", entity: "Page", entityId: page.id, metadata: { slug: w.slug } });
  refreshPublicSite();
  return ok(toAdminPage((await prisma.page.findUniqueOrThrow({ where: { id: page.id }, include: pageInclude }))));
});
