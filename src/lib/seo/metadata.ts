import type { Metadata } from "next";
import type { GlobalSettings, SeoFields } from "@/lib/cms/types";
import { safeImageSrc } from "@/lib/cms/url-safety";
import { absoluteUrl, resolveCanonicalPath } from "./url";

interface BuildMetadataInput {
  /** The route's own path, e.g. "/website-development". */
  path: string;
  /** CMS SEO (highest priority). */
  seo?: SeoFields | null;
  /** The route's existing static metadata (second priority). */
  fallback?: Metadata;
  /** Global defaults (last resort). */
  settings?: Pick<GlobalSettings, "defaultSeo" | "siteName">;
  ogType?: "website" | "article";
  /** Forces noindex (preview, drafts). */
  forceNoIndex?: boolean;
}

function titleString(t: Metadata["title"]): string | undefined {
  if (typeof t === "string") return t;
  if (t && typeof t === "object" && "absolute" in t && typeof t.absolute === "string") return t.absolute;
  if (t && typeof t === "object" && "default" in t && typeof t.default === "string") return t.default;
  return undefined;
}

function fallbackImages(fb?: Metadata): string[] {
  const imgs = fb?.openGraph?.images;
  const arr = Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];
  return arr.map((i) => (typeof i === "string" ? i : i instanceof URL ? i.toString() : "url" in i ? String(i.url) : "")).filter(Boolean);
}

/**
 * Centralised metadata builder. Precedence per field:
 *   CMS SEO → route-specific existing metadata → global settings.
 * Exactly one canonical is emitted, always same-origin and normalised.
 */
export function buildMetadata({ path, seo, fallback, settings, ogType = "website", forceNoIndex }: BuildMetadataInput): Metadata {
  const g = settings?.defaultSeo;
  const title = seo?.title || titleString(fallback?.title) || g?.title;
  const description = seo?.description || fallback?.description || g?.description || undefined;
  const canonicalPath = resolveCanonicalPath(path, seo?.canonical);
  const canonicalUrl = absoluteUrl(canonicalPath);

  const ogTitle = seo?.ogTitle || seo?.title || (fallback?.openGraph?.title ? titleString(fallback.openGraph.title) : undefined) || title;
  const ogDescription =
    seo?.ogDescription || seo?.description || (typeof fallback?.openGraph?.description === "string" ? fallback.openGraph.description : undefined) || description;
  // First SAFE candidate wins (an invalid CMS image falls through to the next tier instead of dropping the image).
  const firstSafe = (...c: (string | undefined)[]) => c.map((x) => (x ? safeImageSrc(x) : null)).find((x): x is string => !!x) ?? null;
  const ogImage = firstSafe(seo?.ogImage, fallbackImages(fallback)[0], g?.ogImage);
  const twImage = firstSafe(seo?.twitterImage, seo?.ogImage, fallbackImages(fallback)[0], g?.ogImage);

  const index = forceNoIndex ? false : seo?.index ?? true;
  const follow = forceNoIndex ? false : seo?.follow ?? true;

  const keywords = seo?.keywords?.length ? seo.keywords : fallback?.keywords;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: ogType,
      url: canonicalUrl,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(settings?.siteName ? { siteName: settings.siteName } : {}),
      ...(ogImage ? { images: [{ url: absoluteUrl(ogImage) }] } : {}),
    },
    twitter: {
      card: twImage ? "summary_large_image" : "summary",
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(twImage ? { images: [absoluteUrl(twImage)] } : {}),
    },
    // Only emit when it differs from the layout default (index, follow).
    ...(!index || !follow ? { robots: { index, follow } } : {}),
  };
}
