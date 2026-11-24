import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { pageInclude, workingCopy } from "@/lib/cms/pages";
import { pageFindings } from "@/lib/server/seo-score";
import type { SeoIssue } from "@/lib/admin-client/types";

export const GET = admin("seo.view", async () => {
  const [pages, media, redirects] = await Promise.all([
    prisma.page.findMany({ where: { deletedAt: null }, include: pageInclude }),
    prisma.mediaAsset.findMany({ where: { deletedAt: null, mimeType: { startsWith: "image/" }, OR: [{ alt: null }, { alt: "" }] }, take: 100 }),
    prisma.redirect.findMany({ where: { active: true } }),
  ]);
  const issues: SeoIssue[] = [];
  let n = 0;
  for (const p of pages) {
    const w = workingCopy(p);
    const routeBound = w.sections.some((s) => s.type === "builtIn");
    for (const f of pageFindings(w.seo, w.sections, routeBound)) {
      issues.push({ id: `seo-${++n}`, pageTitle: w.title, slug: w.slug, type: f.type, severity: f.severity, recommendation: f.recommendation });
    }
  }
  for (const m of media) issues.push({ id: `seo-${++n}`, pageTitle: m.filename, slug: m.publicUrl, type: "Missing ALT text", severity: "low", recommendation: "Add alt text in the Media Library." });
  const map = new Map(redirects.map((r) => [r.sourcePath, r.destination]));
  for (const r of redirects) {
    const next = map.get(r.destination);
    if (next) issues.push({ id: `seo-${++n}`, pageTitle: "Redirect chain", slug: r.sourcePath, type: "Redirect Issue", severity: "medium", recommendation: `${r.sourcePath} → ${r.destination} → ${next}: point the first redirect at the final URL.` });
  }
  return ok(issues);
});
