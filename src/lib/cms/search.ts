import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { assertCan, can, type Actor } from "@/lib/rbac/actor";

export const SEARCH_MIN = 2, SEARCH_MAX = 100;
export interface SearchHit { type: "page" | "portfolio" | "article" | "media" | "lead"; id: string; title: string; subtitle: string | null; status?: string; url: string }

/**
 * Cross-entity admin search. Each group is included only if the caller holds that entity's view permission,
 * so a result can never reveal the existence of data the caller cannot open. Soft-deleted rows are never returned.
 */
export async function adminSearch(actor: Actor, rawQuery: string, perType = 5) {
  assertCan(actor, "search.use");
  const q = rawQuery.trim();
  if (q.length < SEARCH_MIN) throw new HttpError(400, "VALIDATION_ERROR", `Search needs at least ${SEARCH_MIN} characters`);
  if (q.length > SEARCH_MAX) throw new HttpError(400, "VALIDATION_ERROR", `Search is limited to ${SEARCH_MAX} characters`);
  const take = Math.min(Math.max(perType, 1), 10);
  const like = { contains: q, mode: "insensitive" as const };
  const groups: Partial<Record<"pages" | "portfolio" | "articles" | "media" | "leads", SearchHit[]>> = {};
  const jobs: Array<Promise<void>> = [];

  if (can(actor, "pages.view")) jobs.push(prisma.page.findMany({ where: { deletedAt: null, OR: [{ title: like }, { slug: like }] }, select: { id: true, title: true, slug: true, status: true }, orderBy: { updatedAt: "desc" }, take })
    .then((r) => { groups.pages = r.map((p) => ({ type: "page", id: p.id, title: p.title, subtitle: p.slug, status: p.status, url: `/admin/pages/${p.id}` })); }));
  if (can(actor, "portfolio.view")) jobs.push(prisma.portfolioProject.findMany({ where: { deletedAt: null, OR: [{ title: like }, { slug: like }, { summary: like }] }, select: { id: true, title: true, slug: true, status: true }, orderBy: { updatedAt: "desc" }, take })
    .then((r) => { groups.portfolio = r.map((p) => ({ type: "portfolio", id: p.id, title: p.title, subtitle: p.slug, status: p.status, url: `/admin/portfolio/${p.id}` })); }));
  if (can(actor, "articles.view")) jobs.push(prisma.article.findMany({ where: { deletedAt: null, OR: [{ title: like }, { slug: like }, { excerpt: like }] }, select: { id: true, title: true, slug: true, status: true }, orderBy: { updatedAt: "desc" }, take })
    .then((r) => { groups.articles = r.map((a) => ({ type: "article", id: a.id, title: a.title, subtitle: a.slug, status: a.status, url: `/admin/articles/${a.id}` })); }));
  if (can(actor, "media.view")) jobs.push(prisma.mediaAsset.findMany({ where: { deletedAt: null, OR: [{ filename: like }, { alt: like }, { title: like }, { tags: { has: q.toLowerCase() } }] }, select: { id: true, filename: true, mimeType: true }, orderBy: { createdAt: "desc" }, take })
    .then((r) => { groups.media = r.map((m) => ({ type: "media", id: m.id, title: m.filename, subtitle: m.mimeType, url: `/admin/media?asset=${m.id}` })); }));
  if (can(actor, "leads.view")) jobs.push(prisma.lead.findMany({ where: { deletedAt: null, OR: [{ name: like }, { email: like }, { company: like }, { phone: like }] }, select: { id: true, name: true, email: true, company: true, status: true }, orderBy: { createdAt: "desc" }, take })
    .then((r) => { groups.leads = r.map((l) => ({ type: "lead", id: l.id, title: l.name || l.email || "Unnamed lead", subtitle: [l.email, l.company].filter(Boolean).join(" · ") || null, status: l.status, url: `/admin/leads?lead=${l.id}` })); }));

  await Promise.all(jobs);
  return { query: q, results: groups, total: Object.values(groups).reduce((n, g) => n + (g?.length ?? 0), 0) };
}
