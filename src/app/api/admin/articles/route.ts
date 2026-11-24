import { prisma } from "@/lib/db/prisma";
import { admin, body, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { articleSchema, saveArticle } from "@/lib/server/content-admin";
import { toArticleItem } from "@/lib/server/dto-content";

export const GET = admin("articles.view", async () => ok((await prisma.article.findMany({ where: { deletedAt: null }, include: { category: true }, orderBy: { updatedAt: "desc" } })).map(toArticleItem)));

export const POST = admin("articles.edit", async ({ request, session }) => {
  const d = await body(request, articleSchema);
  const row = await saveArticle(null, d);
  await audit({ actorId: session.userId, action: "article.create", entity: "Article", entityId: row.id });
  refreshPublicSite();
  return ok(toArticleItem(row), 201);
});
