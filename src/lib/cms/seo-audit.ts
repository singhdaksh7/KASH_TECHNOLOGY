import type { StoredSeo } from "./working-copy";

/** The parts of a page section the audit reads (a StoredSection satisfies this). */
export interface StoredSection { type: string; order: number; enabled: boolean; content: unknown }

/**
 * SEO audit engine. Pure: takes plain data, returns findings. Nothing here fabricates traffic, rankings or
 * Search Console numbers — every finding is derived from content that is actually stored in the CMS.
 */
export type Severity = "CRITICAL" | "WARNING" | "RECOMMENDATION" | "PASSED";
export type SeoCheck =
  | "MISSING_TITLE" | "DUPLICATE_TITLE" | "TITLE_TOO_LONG" | "MISSING_META_DESCRIPTION" | "DUPLICATE_META_DESCRIPTION" | "DESCRIPTION_TOO_LONG"
  | "MISSING_H1" | "MULTIPLE_H1" | "MISSING_CANONICAL" | "INVALID_CANONICAL" | "NOINDEX" | "MISSING_OG_IMAGE" | "MISSING_IMAGE_ALT"
  | "BROKEN_INTERNAL_LINK" | "ORPHAN_PAGE" | "REDIRECT_CHAIN" | "REDIRECT_LOOP" | "MISSING_SCHEMA";
export const ALL_CHECKS: SeoCheck[] = [
  "MISSING_TITLE", "DUPLICATE_TITLE", "TITLE_TOO_LONG", "MISSING_META_DESCRIPTION", "DUPLICATE_META_DESCRIPTION", "DESCRIPTION_TOO_LONG", "MISSING_H1", "MULTIPLE_H1",
  "MISSING_CANONICAL", "INVALID_CANONICAL", "NOINDEX", "MISSING_OG_IMAGE", "MISSING_IMAGE_ALT", "BROKEN_INTERNAL_LINK", "ORPHAN_PAGE", "REDIRECT_CHAIN", "REDIRECT_LOOP", "MISSING_SCHEMA",
];

export interface SeoIssue {
  id: string; type: SeoCheck; severity: Exclude<Severity, "PASSED">; entityType: "Page" | "Redirect" | "MediaAsset"; entityId: string;
  /** Human label: page title, redirect source or media filename. */
  entityLabel: string;
  url: string; message: string; recommendation: string;
}
export interface AuditPage { id: string; title: string; slug: string; status: string; seo: StoredSeo; sections: StoredSection[] }
export interface AuditInput {
  pages: AuditPage[];
  redirects: Array<{ id: string; sourcePath: string; destination: string; active: boolean }>;
  media: Array<{ id: string; filename: string; publicUrl: string; alt: string | null }>;
  /** hrefs found in navigation / header / footer settings; used to decide which pages are linked from the site chrome. */
  navHrefs: string[];
  /** Extra valid internal paths (static routes, portfolio/article URLs…). */
  knownPaths?: string[];
  siteUrl?: string;
}
export interface AuditReport {
  generatedAt: string;
  summary: { critical: number; warning: number; recommendation: number; passed: number; pagesAudited: number; issues: number };
  issues: SeoIssue[];
  passed: Array<{ type: SeoCheck; severity: "PASSED"; message: string }>;
  notes: string[];
}

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

// ── helpers ─────────────────────────────────────────────────────────────────
const blank = (s: unknown) => typeof s !== "string" || !s.trim();
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const hostOf = (u?: string) => { try { return u ? new URL(u).host.replace(/^www\./, "") : undefined; } catch { return undefined; } };

function walk(value: unknown, visit: (key: string | null, v: unknown, parent: Record<string, unknown> | null) => void, key: string | null = null, parent: Record<string, unknown> | null = null, depth = 0) {
  if (depth > 12) return;
  visit(key, value, parent);
  if (Array.isArray(value)) value.forEach((x) => walk(x, visit, key, parent, depth + 1));
  else if (isObj(value)) for (const [k, v] of Object.entries(value)) walk(v, visit, k, value, depth + 1);
}

const isEnabled = (s: StoredSection) => s.enabled !== false;
const isRouteBound = (p: AuditPage) => p.sections.some((s) => s.type === "builtIn");

export function countH1(sections: StoredSection[]): number {
  let n = 0;
  for (const s of sections.filter(isEnabled)) {
    if (s.type === "hero") { n += 1; continue; }
    walk(s.content, (_k, v) => { if (typeof v === "string") n += (v.match(/<h1[\s>]/gi) ?? []).length; });
  }
  return n;
}

const IMG_KEYS = ["src", "url", "image", "imageUrl", "thumbnail", "heroImage", "logo", "photo", "avatar"];
const looksLikeImage = (v: string) => /\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i.test(v) || v.startsWith("/uploads/");

/** Images in section content that have no alternative text. */
export function imagesMissingAlt(sections: StoredSection[]): string[] {
  const missing = new Set<string>();
  for (const s of sections.filter(isEnabled)) {
    walk(s.content, (_k, v, parent) => {
      if (typeof v === "string") {
        for (const tag of v.match(/<img\b[^>]*>/gi) ?? []) if (!/\balt\s*=/i.test(tag)) missing.add(tag.match(/src\s*=\s*["']([^"']+)/i)?.[1] ?? "(inline image)");
      }
      if (isObj(v)) {
        for (const k of IMG_KEYS) {
          const val = v[k];
          if (typeof val === "string" && looksLikeImage(val) && ![v.alt, v.imageAlt, v.altText, v[`${k}Alt`]].some((a) => typeof a === "string" && a.trim())) missing.add(val);
        }
      }
      void parent;
    });
  }
  return [...missing];
}

/** Local path for an href, or null when it is not an internal page link we can verify. */
export function normalizeInternal(href: string, siteHost?: string): string | null {
  let h = href.trim();
  if (!h || h.startsWith("#") || /^(mailto:|tel:|javascript:|data:|sms:)/i.test(h) || h.startsWith("//")) return null;
  if (/^https?:\/\//i.test(h)) {
    try { const u = new URL(h); if (!siteHost || u.host.replace(/^www\./, "") !== siteHost) return null; h = u.pathname; } catch { return null; }
  }
  if (!h.startsWith("/")) return null;
  h = h.split("#")[0].split("?")[0];
  try { h = decodeURI(h); } catch { /* keep raw */ }
  if (/^\/(uploads|api|_next|images|admin)(\/|$)/.test(h) || /\.[a-z0-9]{2,5}$/i.test(h)) return null;
  return h.length > 1 ? h.replace(/\/+$/, "") : "/";
}

export function internalLinks(sections: StoredSection[], siteHost?: string): string[] {
  const out = new Set<string>();
  const add = (v: string) => { const p = normalizeInternal(v, siteHost); if (p) out.add(p); };
  for (const s of sections.filter(isEnabled)) {
    walk(s.content, (k, v) => {
      if (typeof v !== "string") return;
      if (k && /(href|url|link)$/i.test(k)) add(v);
      for (const m of v.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) add(m[1]);
    });
  }
  return [...out];
}

export function validCanonical(value: string, siteHost?: string): { ok: boolean; reason?: string } {
  const v = value.trim();
  if (/\s/.test(v)) return { ok: false, reason: "contains whitespace" };
  if (v.startsWith("/")) return v.startsWith("//") ? { ok: false, reason: "protocol-relative URL" } : { ok: true };
  try {
    const u = new URL(v);
    if (!/^https?:$/.test(u.protocol)) return { ok: false, reason: "must use http or https" };
    if (siteHost && u.host.replace(/^www\./, "") !== siteHost) return { ok: false, reason: `points to another domain (${u.host})` };
    return { ok: true };
  } catch { return { ok: false, reason: "is not a valid URL" }; }
}

export interface RedirectFinding { kind: "chain" | "loop"; sourcePath: string; path: string[] }
/** Detects redirect chains (≥2 hops) and loops across active redirects. */
export function analyzeRedirects(redirects: AuditInput["redirects"]): Map<string, RedirectFinding> {
  const next = new Map<string, string>();
  for (const r of redirects) if (r.active) next.set(r.sourcePath, r.destination);
  const out = new Map<string, RedirectFinding>();
  for (const start of next.keys()) {
    const path = [start];
    let cur = next.get(start);
    let kind: "chain" | "loop" | null = null;
    while (cur !== undefined) {
      if (path.includes(cur)) { path.push(cur); kind = "loop"; break; }
      path.push(cur);
      if (!next.has(cur)) break;
      cur = next.get(cur);
    }
    if (kind === "loop") out.set(start, { kind, sourcePath: start, path });
    else if (path.length > 2) out.set(start, { kind: "chain", sourcePath: start, path });
  }
  return out;
}

// ── engine ──────────────────────────────────────────────────────────────────
export function runSeoAudit(input: AuditInput, now = new Date()): AuditReport {
  const siteHost = hostOf(input.siteUrl);
  const base = input.siteUrl?.replace(/\/+$/, "") ?? "";
  const urlOf = (path: string) => `${base}${path}`;
  const issues: SeoIssue[] = [];
  const notes: string[] = [];
  const pages = input.pages.filter((p) => p.status !== "ARCHIVED");
  const live = (p: AuditPage) => p.status === "PUBLISHED";
  /** Problems on pages nobody can see yet are downgraded: CRITICAL only matters for live pages. */
  const sev = (s: Exclude<Severity, "PASSED">, p: AuditPage): SeoIssue["severity"] => (s === "CRITICAL" && !live(p) ? "WARNING" : s);
  const add = (type: SeoCheck, severity: SeoIssue["severity"], p: AuditPage, message: string, recommendation: string, suffix = "") =>
    issues.push({ id: `${type}:Page:${p.id}${suffix}`, type, severity, entityType: "Page", entityId: p.id, entityLabel: p.title, url: urlOf(p.slug), message, recommendation });

  const titleGroups = new Map<string, AuditPage[]>(), descGroups = new Map<string, AuditPage[]>();
  const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

  for (const p of pages) {
    const seo = p.seo ?? {};
    const bound = isRouteBound(p);
    if (blank(seo.title)) { if (!bound) add("MISSING_TITLE", sev("CRITICAL", p), p, "The page has no SEO title.", "Add a unique SEO title of 30–60 characters."); }
    else {
      (titleGroups.get(norm(seo.title as string)) ?? titleGroups.set(norm(seo.title as string), []).get(norm(seo.title as string))!).push(p);
      if ((seo.title as string).trim().length > TITLE_MAX) add("TITLE_TOO_LONG", "WARNING", p, `The SEO title is ${(seo.title as string).trim().length} characters (limit ${TITLE_MAX}).`, "Shorten the title so search engines do not truncate it.");
    }
    if (blank(seo.description)) { if (!bound) add("MISSING_META_DESCRIPTION", sev("WARNING", p), p, "The page has no meta description.", "Add a meta description of 70–160 characters."); }
    else {
      (descGroups.get(norm(seo.description as string)) ?? descGroups.set(norm(seo.description as string), []).get(norm(seo.description as string))!).push(p);
      if ((seo.description as string).trim().length > DESCRIPTION_MAX) add("DESCRIPTION_TOO_LONG", "WARNING", p, `The meta description is ${(seo.description as string).trim().length} characters (limit ${DESCRIPTION_MAX}).`, "Shorten the description so it is not cut off in results.");
    }
    if (!bound) {
      const h1 = countH1(p.sections);
      if (h1 === 0) add("MISSING_H1", sev("CRITICAL", p), p, "The page has no H1 heading.", "Add a Hero section (or a single H1) as the page's main heading.");
      else if (h1 > 1) add("MULTIPLE_H1", "WARNING", p, `The page has ${h1} H1 headings.`, "Keep exactly one H1 per page; use H2/H3 for the rest.");
    }
    if (blank(seo.canonicalUrl)) { if (live(p)) add("MISSING_CANONICAL", "RECOMMENDATION", p, "No canonical URL is set.", "Set a canonical URL to consolidate duplicate versions of this page."); }
    else {
      const c = validCanonical(seo.canonicalUrl as string, siteHost);
      if (!c.ok) add("INVALID_CANONICAL", "WARNING", p, `The canonical URL ${c.reason}.`, "Use an absolute URL on your own domain, or a local path starting with '/'.");
    }
    if (/noindex/i.test(seo.robots ?? "") && live(p)) add("NOINDEX", "WARNING", p, "This published page is set to noindex and is hidden from search engines.", "Confirm that excluding this page from search is intended.");
    if (live(p) && blank(seo.ogImage)) add("MISSING_OG_IMAGE", "RECOMMENDATION", p, "No Open Graph image is set.", "Add a 1200×630 social sharing image.");
    if (live(p) && (seo.structuredData == null || (isObj(seo.structuredData) && !Object.keys(seo.structuredData).length))) add("MISSING_SCHEMA", "RECOMMENDATION", p, "No structured data (schema.org JSON-LD) is defined.", "Add structured data suited to the page type (Organization, Service, FAQPage…).");
    if (!bound) {
      const imgs = imagesMissingAlt(p.sections);
      if (imgs.length) add("MISSING_IMAGE_ALT", sev("WARNING", p), p, `${imgs.length} image${imgs.length > 1 ? "s" : ""} missing alt text (e.g. ${imgs.slice(0, 3).join(", ")}).`, "Describe each meaningful image in its alt text.");
    }
  }
  for (const [type, groups] of [["DUPLICATE_TITLE", titleGroups], ["DUPLICATE_META_DESCRIPTION", descGroups]] as const) {
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      for (const p of group) {
        const others = group.filter((o) => o.id !== p.id).map((o) => o.slug);
        add(type, "WARNING", p, `${type === "DUPLICATE_TITLE" ? "The SEO title" : "The meta description"} is also used by ${others.slice(0, 4).join(", ")}${others.length > 4 ? ` and ${others.length - 4} more` : ""}.`,
          `Give every page a unique ${type === "DUPLICATE_TITLE" ? "title" : "description"}.`);
      }
    }
  }

  // Internal links, redirects and orphans
  const redirectMap = new Map(input.redirects.filter((r) => r.active).map((r) => [r.sourcePath, r.destination]));
  const publishedPaths = new Set(pages.filter(live).map((p) => (p.slug.length > 1 ? p.slug.replace(/\/+$/, "") : "/")));
  const known = new Set([...(input.knownPaths ?? []), ...publishedPaths]);
  const inbound = new Map<string, Set<string>>();
  const link = (from: string, to: string) => { (inbound.get(to) ?? inbound.set(to, new Set()).get(to)!).add(from); };
  for (const p of pages) {
    if (isRouteBound(p)) continue;
    const broken = new Set<string>();
    for (const target of internalLinks(p.sections, siteHost)) {
      const via = redirectMap.has(target) ? redirectMap.get(target)! : target;
      const resolved = normalizeInternal(via, siteHost) ?? via;
      link(p.id, resolved);
      if (!known.has(target) && !(redirectMap.has(target) && (known.has(resolved) || !resolved.startsWith("/")))) broken.add(target);
    }
    if (broken.size) add("BROKEN_INTERNAL_LINK", sev("CRITICAL", p), p, `${broken.size} internal link${broken.size > 1 ? "s" : ""} point to pages that do not exist or are not published: ${[...broken].slice(0, 5).join(", ")}.`, "Fix or remove these links, or publish the target pages.");
  }
  if (input.navHrefs.length) {
    for (const h of input.navHrefs) { const t = normalizeInternal(h, siteHost); if (t) link("nav", redirectMap.has(t) ? normalizeInternal(redirectMap.get(t)!, siteHost) ?? t : t); }
    for (const p of pages.filter(live)) {
      const path = p.slug.length > 1 ? p.slug.replace(/\/+$/, "") : "/";
      if (path === "/") continue;
      const sources = [...(inbound.get(path) ?? [])].filter((s) => s !== p.id);
      if (!sources.length) add("ORPHAN_PAGE", "WARNING", p, "No other page or menu links to this page.", "Link to it from a related page or from the navigation.");
    }
  } else {
    notes.push("Orphan-page check skipped: no navigation links were found in settings, so inbound links cannot be assessed.");
  }

  for (const f of analyzeRedirects(input.redirects).values()) {
    const r = input.redirects.find((x) => x.sourcePath === f.sourcePath && x.active)!;
    issues.push(f.kind === "loop"
      ? { id: `REDIRECT_LOOP:Redirect:${r.id}`, type: "REDIRECT_LOOP", severity: "CRITICAL", entityType: "Redirect", entityId: r.id, entityLabel: r.sourcePath, url: urlOf(r.sourcePath), message: `Redirect loop: ${f.path.join(" → ")}.`, recommendation: "Break the loop by pointing one redirect at a real page." }
      : { id: `REDIRECT_CHAIN:Redirect:${r.id}`, type: "REDIRECT_CHAIN", severity: "WARNING", entityType: "Redirect", entityId: r.id, entityLabel: r.sourcePath, url: urlOf(r.sourcePath), message: `Redirect chain (${f.path.length - 1} hops): ${f.path.join(" → ")}.`, recommendation: `Point ${f.sourcePath} directly at ${f.path[f.path.length - 1]}.` });
  }

  for (const m of input.media) {
    if (blank(m.alt)) issues.push({ id: `MISSING_IMAGE_ALT:MediaAsset:${m.id}`, type: "MISSING_IMAGE_ALT", severity: "RECOMMENDATION", entityType: "MediaAsset", entityId: m.id, entityLabel: m.filename, url: m.publicUrl, message: `Media file "${m.filename}" has no alt text.`, recommendation: "Add alt text in the Media Library." });
  }

  const order = { CRITICAL: 0, WARNING: 1, RECOMMENDATION: 2 } as const;
  issues.sort((a, b) => order[a.severity] - order[b.severity] || a.type.localeCompare(b.type) || a.url.localeCompare(b.url));
  const firing = new Set(issues.map((i) => i.type));
  const passed = ALL_CHECKS.filter((c) => !firing.has(c) && !(c === "ORPHAN_PAGE" && !input.navHrefs.length))
    .map((type) => ({ type, severity: "PASSED" as const, message: `No ${type.toLowerCase().replace(/_/g, " ")} findings.` }));
  return {
    generatedAt: now.toISOString(),
    summary: {
      critical: issues.filter((i) => i.severity === "CRITICAL").length, warning: issues.filter((i) => i.severity === "WARNING").length,
      recommendation: issues.filter((i) => i.severity === "RECOMMENDATION").length, passed: passed.length, pagesAudited: pages.length, issues: issues.length,
    },
    issues, passed, notes,
  };
}
