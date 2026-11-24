import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/seo/sitemap";

// Static routes + published CMS pages + projects + articles. Drafts, admin, API and preview are never listed.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap();
}
