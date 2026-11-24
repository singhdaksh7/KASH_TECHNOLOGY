/**
 * URL / class safety helpers shared by rich text and section rendering.
 * Everything coming from the CMS is untrusted.
 */

const ALLOWED_LINK_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const ALLOWED_IMAGE_SCHEMES = new Set(["http", "https"]);

function stripControl(value: string): string {
  // Browsers ignore tabs/newlines/control chars inside schemes ("java\nscript:").
  return value.replace(/[\u0000- \u007f-\u009f]/g, "");
}

function check(value: unknown, schemes: Set<string>, allowFragmentAndQuery: boolean): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2048) return null;
  const compact = stripControl(trimmed);
  const scheme = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(compact);
  if (scheme) return schemes.has(scheme[1].toLowerCase()) ? trimmed : null;
  if (compact.startsWith("//")) return null; // protocol-relative: ambiguous, reject
  if (compact.startsWith("/")) return trimmed;
  if (allowFragmentAndQuery && (compact.startsWith("#") || compact.startsWith("?"))) return trimmed;
  return null;
}

/** Returns the href if it is safe to render in an anchor, otherwise null. */
export function safeHref(value: unknown): string | null {
  return check(value, ALLOWED_LINK_SCHEMES, true);
}

/** Returns the src if it is safe to render in an <img>/next/image, otherwise null. */
export function safeImageSrc(value: unknown): string | null {
  return check(value, ALLOWED_IMAGE_SCHEMES, false);
}

/** Only lowercase letters, digits, space, dash and underscore survive. */
export function sanitizeCustomClass(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
