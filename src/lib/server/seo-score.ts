import type { StoredSeo, StoredSection } from "@/lib/cms/pages";

export interface SeoFinding { type: "Missing Title" | "Missing Meta Description" | "Missing H1" | "Missing ALT text" | "Noindex" | "Redirect Issue"; severity: "high" | "medium" | "low"; recommendation: string }

/** Finds SEO problems for one page's working copy (also feeds the 0-100 score). */
export function pageFindings(seo: StoredSeo, sections: StoredSection[], isRouteBound: boolean): SeoFinding[] {
  const out: SeoFinding[] = [];
  if (!seo.title?.trim() && !isRouteBound) out.push({ type: "Missing Title", severity: "high", recommendation: "Add an SEO title (30–65 characters)." });
  if (!seo.description?.trim() && !isRouteBound) out.push({ type: "Missing Meta Description", severity: "medium", recommendation: "Add a meta description (70–160 characters)." });
  const hasH1 = isRouteBound || sections.some((s) => s.enabled && (s.type === "hero" || s.type === "builtIn"));
  if (!hasH1) out.push({ type: "Missing H1", severity: "medium", recommendation: "Add a Hero section so the page has a main heading." });
  if (/noindex/i.test(seo.robots ?? "")) out.push({ type: "Noindex", severity: "low", recommendation: "This page is excluded from search engines. Confirm that is intended." });
  return out;
}

export function seoScore(seo: StoredSeo, sections: StoredSection[], isRouteBound: boolean): number {
  let score = 0;
  const t = seo.title?.trim().length ?? 0, d = seo.description?.trim().length ?? 0;
  if (t >= 20 && t <= 65) score += 25; else if (t > 0) score += 12;
  if (d >= 70 && d <= 165) score += 25; else if (d > 0) score += 12;
  if (seo.ogImage) score += 10;
  if (seo.canonicalUrl) score += 5;
  if (seo.focusKeyword) score += 10;
  if (!/noindex/i.test(seo.robots ?? "")) score += 10;
  if (isRouteBound || sections.some((s) => s.enabled && s.type === "hero")) score += 15;
  return Math.min(100, score);
}
