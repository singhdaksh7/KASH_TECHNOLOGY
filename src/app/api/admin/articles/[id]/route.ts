import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { articleSchema, saveArticle } from "@/lib/server/content-admin";
import { toArticleItem } from "@/lib/server/dto-content";
import { requirePermission } from "@/lib/rbac/permissions";

export const PUT = admin<{ id: string }>("articles.edit", async ({ request, session, params }) => {
  const d = await body(request, articleSchema);
  const cur = await prisma.article.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!cur) throw new HttpError(404, "NOT_FOUND", "Article not found");
  const was = cur.status === "PUBLISHED";
  if ((d.status === "Published") !== was) {
    const pub = await requirePermission("articles.publish", { request });
    if (pub.error) return pub.error;
  }
  const row = await saveArticle(params.id, d);
  await audit({ actorId: session.userId, action: d.status === "Published" && !was ? "article.publish" : "article.update", entity: "Article", entityId: row.id });
  refreshPublicSite();
  return ok(toArticleItem(row));
});

export const DELETE = admin<{ id: string }>("articles.publish", async ({ session, params }) => {
  const a = await prisma.article.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!a) throw new HttpError(404, "NOT_FOUND", "Article not found");
  await prisma.article.update({ where: { id: a.id }, data: { deletedAt: new Date(), status: "DRAFT", slug: `${a.slug}~deleted~${Date.now()}` } });
  await audit({ actorId: session.userId, action: "article.delete", entity: "Article", entityId: a.id });
  refreshPublicSite();
  return ok({ deleted: true });
});
