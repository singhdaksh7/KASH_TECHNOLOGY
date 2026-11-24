/**
 * Slugs that CMS pages may not claim at the top level. Static routes already
 * win in the Next.js router, but we also refuse to render/sitemap them from
 * the CMS so the two worlds can never disagree about a URL.
 */
export const RESERVED_TOP_LEVEL_SLUGS = new Set([
  "admin", "api", "preview", "_next", "sitemap.xml", "robots.txt", "favicon.ico",
  "about", "contact", "insights", "portfolio", "services", "solutions", "work",
  "privacy", "terms", "privacy-policy", "terms-of-service", "terms-and-conditions",
  // services
  "website-development", "custom-software-development", "mobile-app-development",
  "erp-development", "crm-development", "ecommerce-development", "ai-automation",
  "business-automation", "saas-development", "api-integration", "social-media-management",
  "content-creation", "video-editing", "digital-marketing", "performance-marketing",
  "lead-generation", "branding", "seo-services",
  // locations
  "baghpat", "baraut", "meerut", "ghaziabad", "noida", "greater-noida", "delhi-ncr", "western-up",
]);

export function normalizeSlug(slug: string): string {
  return slug.trim().replace(/^\/+|\/+$/g, "").toLowerCase();
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlugSegment(seg: string): boolean {
  return SLUG_RE.test(seg) && seg.length <= 80;
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_TOP_LEVEL_SLUGS.has(normalizeSlug(slug).split("/")[0]);
}
