import type { MetadataRoute } from "next";
import { cms, getPublishedArticles, getPortfolioProjects } from "@/lib/cms";
import { isReservedSlug, normalizeSlug } from "@/lib/cms/reserved-slugs";
import { absoluteUrl, normalizePath } from "./url";

type Entry = MetadataRoute.Sitemap[number];
type Freq = NonNullable<Entry["changeFrequency"]>;

/** Static routes: kept 1:1 with the pre-CMS sitemap (same URLs, priorities, frequencies). */
const STATIC_GROUPS: { paths: string[]; priority: number; freq: Freq }[] = [
  { paths: ["/"], priority: 1.0, freq: "weekly" },
  { paths: ["/services", "/solutions", "/portfolio", "/contact"], priority: 0.9, freq: "monthly" },
  { paths: ["/about"], priority: 0.8, freq: "monthly" },
  { paths: ["/privacy", "/terms"], priority: 0.3, freq: "yearly" },
  {
    paths: [
      "/website-development", "/custom-software-development", "/mobile-app-development", "/erp-development",
      "/crm-development", "/ecommerce-development", "/ai-automation", "/business-automation", "/saas-development",
      "/api-integration", "/social-media-management", "/content-creation", "/video-editing", "/digital-marketing",
      "/performance-marketing", "/lead-generation", "/branding", "/seo-services",
    ],
    priority: 0.85,
    freq: "monthly",
  },
  {
    paths: ["/baghpat", "/baraut", "/meerut", "/ghaziabad", "/noida", "/greater-noida", "/delhi-ncr", "/western-up"],
    priority: 0.8,
    freq: "monthly",
  },
  { paths: ["/baghpat/website-development", "/noida/custom-software-development", "/meerut/erp-development"], priority: 0.75, freq: "monthly" },
  { paths: ["/work/schoolsync", "/work/exora", "/work/crypto-launchpad"], priority: 0.8, freq: "monthly" },
  { paths: ["/insights"], priority: 0.8, freq: "weekly" },
];

/**
 * Combines static routes, published CMS pages, CMS portfolio projects and articles.
 * Never includes drafts, admin, API or preview URLs.
 */
export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const byUrl = new Map<string, Entry>();
  const add = (path: string, priority: number, freq: Freq, lastModified: Date | string = now) => {
    const url = absoluteUrl(normalizePath(path) === "/" ? "/" : normalizePath(path));
    if (!byUrl.has(url)) byUrl.set(url, { url, lastModified, changeFrequency: freq, priority });
  };

  for (const g of STATIC_GROUPS) for (const p of g.paths) add(p, g.priority, g.freq);

  const [pages, articles, projects] = await Promise.all([cms.listPublishedPages(), getPublishedArticles(), getPortfolioProjects()]);

  for (const page of pages) {
    const slug = normalizeSlug(page.slug);
    if (!slug || slug === "home") continue; // homepage already listed
    if (page.seo?.index === false) continue;
    const topLevelStaticOwned = isReservedSlug(slug) && !slug.includes("/");
    // Reserved static routes are already listed; nested (location/service) CMS-only combos are allowed.
    if (topLevelStaticOwned || slug.startsWith("admin") || slug.startsWith("api") || slug.startsWith("preview")) continue;
    add(`/${slug}`, 0.7, "monthly", page.updatedAt ?? now);
  }

  for (const a of articles) add(`/insights/${a.slug}`, 0.75, "monthly");

  // Only projects without a bespoke internal page get a generic /work/[slug] URL.
  for (const p of projects) if (!p.internalHref && p.status === "published") add(`/work/${p.slug}`, 0.7, "monthly");

  return [...byUrl.values()];
}
