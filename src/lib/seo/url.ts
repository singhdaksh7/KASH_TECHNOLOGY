import { SITE_CONFIG } from "@/lib/constants";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.websiteUrl).replace(/\/+$/, "");
}

/** Canonical path form: leading slash, no trailing slash, no query/hash, lowercase. "/" stays "/". */
export function normalizePath(path: string): string {
  const clean = path.split(/[?#]/)[0].trim().toLowerCase().replace(/\/{2,}/g, "/");
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : "/";
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl()}${p}`;
}

/**
 * Resolves a CMS-provided canonical to a single same-site path. Cross-origin canonicals are ignored
 * (prevents a CMS typo from de-indexing a page); on any doubt the route's own path wins.
 */
export function resolveCanonicalPath(routePath: string, cmsCanonical?: string): string {
  if (!cmsCanonical) return normalizePath(routePath);
  try {
    if (/^https?:\/\//i.test(cmsCanonical)) {
      const u = new URL(cmsCanonical);
      if (u.origin !== new URL(siteUrl()).origin) return normalizePath(routePath);
      return normalizePath(u.pathname);
    }
    return normalizePath(cmsCanonical);
  } catch {
    return normalizePath(routePath);
  }
}
