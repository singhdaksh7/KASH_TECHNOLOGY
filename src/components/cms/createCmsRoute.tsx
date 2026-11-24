import type { Metadata } from "next";
import type { ComponentType } from "react";
import { cms, getSettings } from "@/lib/cms";
import type { PageType } from "@/lib/cms/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildPageSchemas } from "@/lib/seo/schema";
import { normalizePath } from "@/lib/seo/url";
import { CmsPageRenderer } from "./CmsPageRenderer";
import { JsonLd } from "./JsonLd";

interface CmsRouteOptions<P> {
  /** Route path, e.g. "/website-development" or "/" . */
  path: string;
  pageType: PageType;
  /** The existing, approved page implementation. Rendered whenever no published CMS page exists. */
  Fallback: ComponentType<P>;
  /** The existing static metadata (kept as the second SEO tier). */
  metadata?: Metadata;
}

/**
 * Progressive-migration wrapper for existing static routes.
 *
 *   published CMS page for this path  → CmsPageRenderer + CMS SEO + schema
 *   otherwise                         → the untouched existing implementation + existing metadata
 *
 * With no CMS configured the adapter makes no network call, so the route stays fully static.
 */
export function createCmsRoute<P extends object = object>({ path, pageType, Fallback, metadata }: CmsRouteOptions<P>) {
  const slug = path === "/" ? "" : path.replace(/^\//, "");

  async function load() {
    const page = pageType === "home" ? await cms.getHomePage() : await cms.getPageBySlug(slug);
    // Only honour a CMS page of a compatible type (a "page" can't hijack a service route by accident).
    return page && page.status === "published" ? page : null;
  }

  async function generateMetadata(): Promise<Metadata> {
    const page = await load();
    if (!page) return metadata ?? {};
    const settings = await getSettings();
    // A page that wraps the built-in implementation keeps the approved route metadata unless SEO was edited in the CMS.
    const builtIn = page.sections.some((s) => s.type === "builtIn" && s.enabled);
    return buildMetadata({ path: normalizePath(path), seo: builtIn ? page.seo : page.seo ?? { title: page.title }, fallback: metadata, settings });
  }

  // Next passes `params`/`searchParams` to pages; forwarding those Promises into client Fallbacks forces dynamic rendering,
  // so the approved implementations are rendered without them (they never read route props).
  async function Page() {
    const props = {} as P;
    const page = await load();
    if (!page) return <Fallback {...props} />;
    // A published page whose only content is the built-in block renders exactly the approved implementation.
    if (page.sections.length > 0 && page.sections.every((s) => s.type === "builtIn" || !s.enabled) && page.sections.some((s) => s.type === "builtIn" && s.enabled)) return <Fallback {...props} />;
    const settings = await getSettings();
    return (
      <>
        <JsonLd data={buildPageSchemas(page, normalizePath(path), settings)} />
        <CmsPageRenderer page={page} legacy={<Fallback {...props} />} />
      </>
    );
  }

  return { generateMetadata, Page };
}
