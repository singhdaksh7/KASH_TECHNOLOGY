import type { ZodType } from "zod";
import type { CmsRepository, PageSummary } from "../repository";
import { cmsEnv, CMS_TAG } from "../env";
import { logOnce } from "../log";
import { normalizeRichText } from "../richtext";
import { normalizeSlug } from "../reserved-slugs";
import {
  articleSchema,
  footerConfigSchema,
  globalSettingsSchema,
  headerConfigSchema,
  pageDocumentSchema,
  projectSchema,
  themeConfigSchema,
} from "../schemas";
import type { ArticleDocument, PageDocument, ProjectDocument } from "../types";

/**
 * Production adapter boundary.
 *
 * Talks to the CMS backend over HTTP (implemented elsewhere), validates every
 * response with zod, and converts failures into `null` / `[]` so the composed
 * repository can fall back to static content. HTTP contract (all JSON,
 * envelope `{ "data": … }`, 404 = not found):
 *
 *   GET {CMS_API_URL}/pages/home
 *   GET {CMS_API_URL}/pages?slug=<slug>        published page by slug
 *   GET {CMS_API_URL}/pages                    list: [{slug,pageType,updatedAt,seo}]
 *   GET {CMS_API_URL}/navigation | /footer | /theme | /settings
 *   GET {CMS_API_URL}/portfolio | /portfolio/<slug>
 *   GET {CMS_API_URL}/articles  | /articles/<slug>
 *   GET {CMS_API_URL}/preview/pages/<id>       draft-capable; Bearer = preview credential
 *
 * Optional `Authorization: Bearer ${CMS_API_TOKEN}` on public reads.
 */

type FetchResult = { ok: true; data: unknown } | { ok: false; notFound: boolean };

async function request(path: string, opts: { tags?: string[]; bearer?: string; noStore?: boolean } = {}): Promise<FetchResult> {
  const base = cmsEnv.apiUrl;
  if (!base) return { ok: false, notFound: false };
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const bearer = opts.bearer ?? cmsEnv.apiToken;
    if (bearer) headers.Authorization = `Bearer ${bearer}`;
    const res = await fetch(`${base}${path}`, {
      headers,
      signal: AbortSignal.timeout(cmsEnv.timeoutMs),
      ...(opts.noStore
        ? { cache: "no-store" as const }
        : { next: { revalidate: cmsEnv.revalidateSeconds, tags: [CMS_TAG, ...(opts.tags ?? [])] } }),
    });
    if (res.status === 404) return { ok: false, notFound: true };
    if (!res.ok) {
      logOnce(`http:${path.split("?")[0]}:${res.status}`, `API ${res.status} for ${path.split("?")[0]}; using fallback`);
      return { ok: false, notFound: false };
    }
    const json = (await res.json()) as { data?: unknown };
    return { ok: true, data: json && typeof json === "object" && "data" in json ? json.data : json };
  } catch {
    logOnce(`net:${path.split("?")[0]}`, `API unreachable for ${path.split("?")[0]}; using fallback`);
    return { ok: false, notFound: false };
  }
}

function parse<T>(schema: ZodType<T>, data: unknown, label: string): T | null {
  const r = schema.safeParse(data);
  if (!r.success) {
    logOnce(`schema:${label}`, `Invalid ${label} payload from API; ignoring`);
    return null;
  }
  return r.data;
}

function toPage(data: unknown): PageDocument | null {
  const page = parse(pageDocumentSchema, data, "page");
  // Defence in depth: the backend should never send drafts on public reads, but never trust it.
  return page ? (page as PageDocument) : null;
}

function toProject(data: unknown): ProjectDocument | null {
  const p = parse(projectSchema, data, "project");
  if (!p || p.status !== "published") return null;
  return {
    ...p,
    problem: p.problem ? normalizeRichText(p.problem) : undefined,
    solution: p.solution ? normalizeRichText(p.solution) : undefined,
    architecture: p.architecture ? normalizeRichText(p.architecture) : undefined,
  };
}

function toArticle(data: unknown): ArticleDocument | null {
  const a = parse(articleSchema, data, "article");
  if (!a || a.status !== "published") return null;
  return { ...a, content: normalizeRichText(a.content) };
}

function list<T>(data: unknown, map: (x: unknown) => T | null): T[] {
  return Array.isArray(data) ? data.map(map).filter((x): x is T => x !== null) : [];
}

export class ApiCmsRepository implements CmsRepository {
  async getPageBySlug(slug: string) {
    const s = normalizeSlug(slug);
    // Reserved-slug policy for NEW top-level custom pages lives in app/[location]/page.tsx;
    // existing static routes (services, locations) legitimately look up CMS overrides by their own slug.
    if (!s) return null;
    const r = await request(`/pages?slug=${encodeURIComponent(s)}`, { tags: [`${CMS_TAG}:page:${s}`] });
    if (!r.ok) return null;
    const page = toPage(r.data);
    return page && page.status === "published" ? page : null;
  }

  async getHomePage() {
    const r = await request("/pages/home", { tags: [`${CMS_TAG}:page:home`] });
    if (!r.ok) return null;
    const page = toPage(r.data);
    return page && page.status === "published" ? page : null;
  }

  async listPublishedPages(): Promise<PageSummary[]> {
    const r = await request("/pages", { tags: [`${CMS_TAG}:pages`] });
    if (!r.ok || !Array.isArray(r.data)) return [];
    return r.data
      .map((p) => {
        const page = pageDocumentSchema.pick({ slug: true, pageType: true, updatedAt: true, seo: true, status: true }).safeParse(p);
        if (!page.success || page.data.status !== "published") return null;
        const { status: _status, ...rest } = page.data;
        void _status;
        return rest as PageSummary;
      })
      .filter((x): x is PageSummary => x !== null);
  }

  async getNavigation() {
    const r = await request("/navigation", { tags: [`${CMS_TAG}:navigation`] });
    return r.ok ? parse(headerConfigSchema, r.data, "navigation") : null;
  }

  async getFooter() {
    const r = await request("/footer", { tags: [`${CMS_TAG}:footer`] });
    return r.ok ? parse(footerConfigSchema, r.data, "footer") : null;
  }

  async getTheme() {
    const r = await request("/theme", { tags: [`${CMS_TAG}:theme`] });
    return r.ok ? parse(themeConfigSchema, r.data, "theme") : null;
  }

  async getGlobalSettings() {
    const r = await request("/settings", { tags: [`${CMS_TAG}:settings`] });
    return r.ok ? parse(globalSettingsSchema, r.data, "settings") : null;
  }

  async getPortfolio() {
    const r = await request("/portfolio", { tags: [`${CMS_TAG}:portfolio`] });
    return r.ok ? list(r.data, toProject) : [];
  }

  async getPortfolioProject(slug: string) {
    const r = await request(`/portfolio/${encodeURIComponent(normalizeSlug(slug))}`, { tags: [`${CMS_TAG}:portfolio`] });
    return r.ok ? toProject(r.data) : null;
  }

  async getArticles() {
    const r = await request("/articles", { tags: [`${CMS_TAG}:articles`] });
    return r.ok ? list(r.data, toArticle) : [];
  }

  async getArticle(slug: string) {
    const r = await request(`/articles/${encodeURIComponent(normalizeSlug(slug))}`, { tags: [`${CMS_TAG}:articles`] });
    return r.ok ? toArticle(r.data) : null;
  }

  async getPreviewPage(id: string, credential: string) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
    const r = await request(`/preview/pages/${encodeURIComponent(id)}`, { bearer: credential, noStore: true });
    return r.ok ? toPage(r.data) : null;
  }
}
