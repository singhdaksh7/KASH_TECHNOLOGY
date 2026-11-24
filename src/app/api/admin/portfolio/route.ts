import { prisma } from "@/lib/db/prisma";
import { admin, body, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { portfolioSchema, savePortfolio } from "@/lib/server/content-admin";
import { toPortfolioItem } from "@/lib/server/dto-content";

export const GET = admin("portfolio.view", async () => ok((await prisma.portfolioProject.findMany({ where: { deletedAt: null }, include: { category: true }, orderBy: { updatedAt: "desc" } })).map(toPortfolioItem)));

export const POST = admin("portfolio.edit", async ({ request, session }) => {
  const d = await body(request, portfolioSchema);
  const row = await savePortfolio(null, d);
  await audit({ actorId: session.userId, action: "portfolio.create", entity: "PortfolioProject", entityId: row.id });
  refreshPublicSite();
  return ok(toPortfolioItem(row), 201);
});
