import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { portfolioSchema, savePortfolio } from "@/lib/server/content-admin";
import { toPortfolioItem } from "@/lib/server/dto-content";
import { requirePermission } from "@/lib/rbac/permissions";

export const GET = admin<{ id: string }>("portfolio.view", async ({ params }) => {
  const p = await prisma.portfolioProject.findFirst({ where: { id: params.id, deletedAt: null }, include: { category: true } });
  if (!p) throw new HttpError(404, "NOT_FOUND", "Project not found");
  return ok(toPortfolioItem(p));
});

export const PUT = admin<{ id: string }>("portfolio.edit", async ({ request, session, params }) => {
  const d = await body(request, portfolioSchema);
  // Changing publication state needs the publish permission as well.
  const cur = await prisma.portfolioProject.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!cur) throw new HttpError(404, "NOT_FOUND", "Project not found");
  const wasPublished = cur.status === "PUBLISHED";
  if ((d.status === "Published") !== wasPublished) {
    const pub = await requirePermission("portfolio.publish", { request });
    if (pub.error) return pub.error;
  }
  const row = await savePortfolio(params.id, d);
  await audit({ actorId: session.userId, action: d.status === "Published" && !wasPublished ? "portfolio.publish" : "portfolio.update", entity: "PortfolioProject", entityId: row.id });
  refreshPublicSite();
  return ok(toPortfolioItem(row));
});

export const DELETE = admin<{ id: string }>("portfolio.publish", async ({ session, params }) => {
  const p = await prisma.portfolioProject.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!p) throw new HttpError(404, "NOT_FOUND", "Project not found");
  await prisma.portfolioProject.update({ where: { id: p.id }, data: { deletedAt: new Date(), status: "DRAFT", slug: `${p.slug}~deleted~${Date.now()}` } });
  await audit({ actorId: session.userId, action: "portfolio.delete", entity: "PortfolioProject", entityId: p.id });
  refreshPublicSite();
  return ok({ deleted: true });
});
