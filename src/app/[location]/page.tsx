import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms, getSettings } from "@/lib/cms";
import { isReservedSlug, isValidSlugSegment } from "@/lib/cms/reserved-slugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildPageSchemas } from "@/lib/seo/schema";
import { CmsPageRenderer } from "@/components/cms/CmsPageRenderer";
import { JsonLd } from "@/components/cms/JsonLd";

/**
 * CMS-created custom pages at /<slug>.
 * NOTE: the dynamic segment is named [location] (not [slug]) because Next.js forbids two different
 * dynamic names at the same level and app/[location]/[service] already exists. The param is a CMS slug here.
 * Next.js always prefers static routes (/services, /about, …) over this dynamic segment, and
 * RESERVED_TOP_LEVEL_SLUGS additionally blocks the CMS from claiming those names.
 * Unknown / draft / reserved slugs → 404.
 */
export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ location: string }>;
}

export async function generateStaticParams() {
  const pages = await cms.listPublishedPages();
  return pages
    .map((p) => p.slug.replace(/^\/+|\/+$/g, ""))
    .filter((s) => s && s !== "home" && !s.includes("/") && isValidSlugSegment(s) && !isReservedSlug(s))
    .map((location) => ({ location }));
}

async function load(slug: string) {
  if (!isValidSlugSegment(slug) || isReservedSlug(slug)) return null;
  const page = await cms.getPageBySlug(slug);
  return page && page.status === "published" ? page : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: slug } = await params;
  const page = await load(slug);
  if (!page) return { robots: { index: false, follow: false } };
  const settings = await getSettings();
  return buildMetadata({ path: `/${slug}`, seo: page.seo ?? { title: page.title }, settings });
}

export default async function CmsCustomPage({ params }: Props) {
  const { location: slug } = await params;
  const page = await load(slug);
  if (!page) notFound();
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={buildPageSchemas(page, `/${slug}`, settings)} />
      <CmsPageRenderer page={page} />
    </>
  );
}
