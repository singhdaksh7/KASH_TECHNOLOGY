import { prisma } from "@/lib/db/prisma";
import { pageInclude, workingCopy } from "./working-copy";
import { runSeoAudit, type AuditInput } from "./seo-audit";

const hrefsIn = (v: unknown, out: string[] = []): string[] => {
  if (Array.isArray(v)) v.forEach((x) => hrefsIn(x, out));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (/(href|url|link)$/i.test(k) && typeof x === "string") out.push(x); else hrefsIn(x, out); }
  return out;
};

/** Loads everything the audit needs from the database. Audits each page's working copy (what editors see). */
export async function loadAuditInput(): Promise<AuditInput> {
  const [pages, redirects, media, settings, navItems, articles, projects] = await Promise.all([
    prisma.page.findMany({ where: { deletedAt: null }, include: pageInclude }),
    prisma.redirect.findMany({ select: { id: true, sourcePath: true, destination: true, active: true } }),
    prisma.mediaAsset.findMany({ where: { deletedAt: null, mimeType: { startsWith: "image/" } }, select: { id: true, filename: true, publicUrl: true, alt: true }, take: 2000 }),
    prisma.globalSetting.findMany({ where: { key: { in: ["navigation", "header", "footer"] } } }),
    prisma.navigationItem.findMany({ where: { enabled: true }, select: { href: true } }),
    prisma.article.findMany({ where: { status: "PUBLISHED", deletedAt: null }, select: { slug: true } }),
    prisma.portfolioProject.findMany({ where: { status: "PUBLISHED", deletedAt: null }, select: { slug: true } }),
  ]);
  return {
    pages: pages.map((p) => { const w = workingCopy(p); return { id: p.id, title: w.title, slug: w.slug, status: p.status, seo: w.seo, sections: w.sections }; }),
    redirects, media,
    navHrefs: [...settings.flatMap((s) => hrefsIn(s.value)), ...navItems.map((n) => n.href)],
    knownPaths: [...articles.map((a) => `/insights/${a.slug}`), ...projects.map((p) => `/work/${p.slug}`)],
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  };
}

export async function auditSite() {
  return runSeoAudit(await loadAuditInput());
}
