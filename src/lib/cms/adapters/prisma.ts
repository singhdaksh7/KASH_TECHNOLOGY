import type { CmsRepository, PageSummary } from "../repository";
import { prisma } from "@/lib/db/prisma";
import { logOnce } from "../log";
import { normalizeRichText } from "../richtext";
import { FALLBACK_FOOTER, FALLBACK_HEADER } from "../fallback-content";
import { workingCopy, pageInclude, type StoredSeo } from "../pages";
import type {
  ArticleDocument, FooterConfig, FormDefinition, GlobalSettings, HeaderConfig, NavItem, PageDocument, PageType, ProjectDocument, ProjectStatus, SeoFields, ThemeConfig,
} from "../types";
import type { Prisma } from "@prisma/client";

/**
 * Direct-database adapter used by the Next.js server (same app as the admin). Everything returned is PUBLISHED content,
 * mapped to the canonical contracts. Any failure resolves to null/[] so the static fallback takes over.
 */
const enabled = () => !!process.env.DATABASE_URL;
async function safe<T>(label: string, fallback: T, fn: () => Promise<T>): Promise<T> {
  if (!enabled()) return fallback;
  try {
    return await fn();
  } catch (e) {
    logOnce(`db:${label}`, `Database read failed for ${label}; using fallback (${e instanceof Error ? e.message.split("\n").pop()?.slice(0, 120) : "error"})`);
    return fallback;
  }
}

const seoFields = (s: StoredSeo | null | undefined): SeoFields | undefined => {
  if (!s) return undefined;
  const robots = (s.robots ?? "").toLowerCase();
  const keywords = [s.focusKeyword, ...(s.secondaryKeywords ?? "").split(",")].map((k) => k?.trim()).filter((k): k is string => !!k);
  const out: SeoFields = {
    title: s.title ?? undefined, description: s.description ?? undefined, canonical: s.canonicalUrl ?? undefined,
    keywords: keywords.length ? keywords : undefined, ogTitle: s.ogTitle ?? undefined, ogDescription: s.ogDescription ?? undefined,
    ogImage: s.ogImage ?? undefined, twitterImage: s.twitterImage ?? undefined,
    index: robots.includes("noindex") ? false : undefined, follow: robots.includes("nofollow") ? false : undefined,
  };
  return Object.values(out).some((v) => v !== undefined) ? out : undefined;
};

const PAGE_TYPE: Record<string, PageType> = { HOME: "home", SERVICE: "service", LOCATION: "location", LANDING: "landing" };
const slugOut = (s: string) => s.replace(/^\/+|\/+$/g, "");

type PublishedRow = Prisma.PageGetPayload<{ include: { sections: true; seo: true } }>;
function toPageDocument(p: PublishedRow, status: "published" | "draft" = "published"): PageDocument {
  return {
    id: p.id, title: p.title, slug: slugOut(p.slug), status, pageType: PAGE_TYPE[p.pageType] ?? "page",
    seo: seoFields(p.seo as unknown as StoredSeo),
    updatedAt: p.updatedAt.toISOString(), publishedAt: p.publishedAt?.toISOString(),
    sections: [...p.sections].sort((a, b) => a.order - b.order).map((s) => ({
      id: s.id, type: s.type, order: s.order, enabled: s.enabled,
      content: (s.content ?? {}) as Record<string, unknown>, style: (s.style ?? undefined) as Record<string, unknown> | undefined,
    })),
  };
}

const livePageWhere = (slug: string) => ({ slug, status: "PUBLISHED" as const, deletedAt: null, OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] });

/* ───────── admin-shaped settings → canonical configs ───────── */
type NavLink = { label?: string; url?: string; visible?: boolean; children?: NavLink[] };
const navItems = (links: NavLink[] | undefined): NavItem[] =>
  (links ?? []).filter((l) => l.visible !== false && l.label && l.url).map((l) => ({
    label: String(l.label), href: String(l.url),
    children: l.children?.length ? navItems(l.children) : undefined,
  }));

const setting = async (key: string) => (await prisma.globalSetting.findUnique({ where: { key } }))?.value as Record<string, unknown> | null | undefined;

export class PrismaCmsRepository implements CmsRepository {
  getPageBySlug(slug: string) {
    return safe<PageDocument | null>("page", null, async () => {
      const p = await prisma.page.findFirst({ where: livePageWhere(`/${slugOut(slug)}`), include: { sections: true, seo: true } });
      return p ? toPageDocument(p) : null;
    });
  }
  getHomePage() {
    return safe<PageDocument | null>("home", null, async () => {
      const p = await prisma.page.findFirst({ where: livePageWhere("/"), include: { sections: true, seo: true } });
      return p ? toPageDocument(p) : null;
    });
  }
  listPublishedPages() {
    return safe<PageSummary[]>("pages", [], async () => {
      const rows = await prisma.page.findMany({ where: { status: "PUBLISHED", deletedAt: null }, include: { seo: true } });
      return rows.map((p) => ({ slug: slugOut(p.slug), pageType: PAGE_TYPE[p.pageType] ?? "page", updatedAt: p.updatedAt.toISOString(), seo: seoFields(p.seo as unknown as StoredSeo) }));
    });
  }
  getNavigation() {
    return safe<HeaderConfig | null>("navigation", null, async () => {
      const [nav, header] = await Promise.all([setting("navigation"), setting("header")]);
      if (!nav && !header) return null;
      const links = Array.isArray(nav) ? (nav as NavLink[]) : ((nav as { links?: NavLink[] } | null | undefined)?.links ?? undefined);
      const h = (header ?? {}) as Record<string, unknown>;
      const str = (k: string) => (typeof h[k] === "string" && (h[k] as string).trim() ? (h[k] as string) : undefined);
      const menu = links ? navItems(links) : FALLBACK_HEADER.menu;
      return {
        menu: menu.length ? menu : FALLBACK_HEADER.menu,
        primaryCta: str("primaryCtaText") ? { label: str("primaryCtaText")!, href: str("primaryCtaUrl") ?? "/contact" } : FALLBACK_HEADER.primaryCta,
        secondaryCta: str("secondaryCtaText") ? { label: str("secondaryCtaText")!, href: str("secondaryCtaUrl") ?? "/contact" } : header ? undefined : FALLBACK_HEADER.secondaryCta,
        announcement: h.showAnnouncement === true && str("announcementText") ? { text: str("announcementText")!, href: str("announcementLink") } : undefined,
        logo: str("logoUrl") ? { src: str("logoUrl") } : undefined,
        sticky: h.sticky !== false,
      };
    });
  }
  getFooter() {
    return safe<FooterConfig | null>("footer", null, async () => {
      const f = (await setting("footer")) as Record<string, unknown> | null | undefined;
      if (!f) return null;
      const list = (v: unknown): NavItem[] => (Array.isArray(v) ? v.flatMap((x) => (x && typeof x === "object" && (x as { label?: string }).label && (x as { url?: string }).url ? [{ label: String((x as { label: string }).label), href: String((x as { url: string }).url) }] : [])) : []);
      const str = (k: string) => (typeof f[k] === "string" && (f[k] as string).trim() ? (f[k] as string) : undefined);
      const social = (f.socialLinks && typeof f.socialLinks === "object" ? (f.socialLinks as Record<string, string>) : {});
      const wa = str("whatsapp");
      const digits = wa?.replace(/[^\d]/g, "");
      const columns = [
        { title: "Quick Links", links: list(f.quickLinks) },
        { title: "Our Services", links: list(f.servicesLinks) },
      ].filter((c) => c.links.length);
      return {
        description: str("description") ?? FALLBACK_FOOTER.description,
        columns: columns.length ? columns : FALLBACK_FOOTER.columns,
        phone: str("phone"), email: str("email"),
        whatsapp: wa?.startsWith("http") ? wa : digits ? `https://wa.me/${digits}` : undefined,
        social: (["linkedin", "github", "instagram", "youtube", "twitter", "facebook"] as const).flatMap((p) => (social[p] ? [{ platform: p, href: social[p] }] : [])),
        newsletter: { enabled: f.showNewsletter !== false, formSlug: "newsletter", heading: str("newsletterHeadline") },
        note: FALLBACK_FOOTER.note,
        copyright: str("copyrightText") ?? FALLBACK_FOOTER.copyright,
        legal: list(f.legalLinks).length ? list(f.legalLinks) : FALLBACK_FOOTER.legal,
      };
    });
  }
  getTheme() {
    return safe<Partial<ThemeConfig> | null>("theme", null, async () => {
      const row = await prisma.themeSetting.findUnique({ where: { key: "theme" } });
      if (!row) return null;
      const t = row.value as Record<string, unknown>;
      const px = (v: unknown) => (typeof v === "number" ? `${v}px` : undefined);
      const spacing = ({ Compact: "3rem", Normal: "5rem", Spacious: "7rem" } as Record<string, string>)[String(t.sectionSpacing)];
      return {
        colorPrimary: t.primaryOrange as string, colorSecondary: t.secondaryOrange as string, colorIvory: t.ivory as string,
        colorBackground: t.white as string, colorText: t.black as string, colorMuted: t.bodyText as string, colorBorder: t.borderColor as string,
        radiusButton: px(t.buttonRadius), radiusCard: px(t.cardRadius), containerWidth: px(t.containerWidth), sectionSpacing: spacing,
      };
    });
  }
  getGlobalSettings() {
    return safe<GlobalSettings | null>("settings", null, async () => null);
  }
  getPortfolio() {
    return safe<ProjectDocument[]>("portfolio", [], async () => {
      const rows = await prisma.portfolioProject.findMany({ where: { status: "PUBLISHED", deletedAt: null }, include: { category: true }, orderBy: [{ publishedAt: "desc" }] });
      return rows.map(toProject);
    });
  }
  getPortfolioProject(slug: string) {
    return safe<ProjectDocument | null>("project", null, async () => {
      const p = await prisma.portfolioProject.findFirst({ where: { slug, status: "PUBLISHED", deletedAt: null }, include: { category: true } });
      return p ? toProject(p) : null;
    });
  }
  getArticles() {
    return safe<ArticleDocument[]>("articles", [], async () => {
      const rows = await prisma.article.findMany({ where: { status: "PUBLISHED", deletedAt: null }, include: { category: true }, orderBy: { publishedAt: "desc" } });
      return rows.map(toArticle);
    });
  }
  getArticle(slug: string) {
    return safe<ArticleDocument | null>("article", null, async () => {
      const a = await prisma.article.findFirst({ where: { slug, status: "PUBLISHED", deletedAt: null }, include: { category: true } });
      return a ? toArticle(a) : null;
    });
  }
  getForm(slug: string) {
    return safe<FormDefinition | null>("form", null, async () => {
      const f = await prisma.form.findFirst({ where: { slug, active: true }, include: { fields: { orderBy: { order: "asc" } } } });
      if (!f) return null;
      const s = (f.settings ?? {}) as { description?: string; submitButtonText?: string; successMessage?: string };
      return {
        slug: f.slug, title: f.name, description: s.description, submitButtonText: s.submitButtonText ?? "Submit",
        successMessage: s.successMessage ?? "Thank you — we'll be in touch shortly.",
        fields: f.fields.map((x) => ({
          name: x.name, label: x.label, type: (x.type === "SELECT" ? "select" : x.type.toLowerCase()) as FormDefinition["fields"][number]["type"], required: x.required,
          placeholder: ((x.validation ?? {}) as { placeholder?: string }).placeholder, options: Array.isArray(x.options) ? (x.options as string[]) : undefined,
        })),
      };
    });
  }
  getPreviewPage(id: string) {
    // Authorization is decided by authorizePreview() before this is called; this returns the DRAFT working copy.
    return safe<PageDocument | null>("preview", null, async () => {
      const p = await prisma.page.findFirst({ where: { id, deletedAt: null }, include: pageInclude });
      if (!p) return null;
      const w = workingCopy(p);
      return {
        id: p.id, title: w.title, slug: slugOut(w.slug), status: "draft", pageType: PAGE_TYPE[p.pageType] ?? "page", seo: seoFields(w.seo),
        sections: w.sections.map((s) => ({ id: s.id, type: s.type, order: s.order, enabled: s.enabled, content: s.content ?? {}, style: s.style ?? undefined })),
      } as PageDocument;
    });
  }
}

type ProjectRowFull = Prisma.PortfolioProjectGetPayload<{ include: { category: true } }>;
function toProject(p: ProjectRowFull): ProjectDocument {
  const c = (p.content ?? {}) as Record<string, unknown>;
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const features = arr<{ title?: string }>(c.features).map((f) => f.title).filter((t): t is string => !!t);
  const kind = (c.projectType as ProjectStatus) ?? "CONCEPT";
  const behaviour = c.clickBehaviour as string | undefined;
  const internal = behaviour === "Open Case Study" && typeof c.caseStudyUrl === "string" && c.caseStudyUrl.startsWith("/") ? c.caseStudyUrl : undefined;
  return {
    id: p.id, title: p.title, slug: p.slug, status: "published", projectStatus: kind, category: p.category?.name ?? String(c.category ?? ""),
    thumbnail: (c.thumbnail as string) || undefined, hero: (c.heroImage as string) || undefined, gallery: arr<string>(c.gallery),
    description: p.summary ?? String(c.shortDescription ?? ""), technologies: arr<string>(c.technologies), services: arr<string>(c.services),
    problem: normalizeRichText(arr<string>(c.problem)), solution: normalizeRichText(arr<string>(c.solution)), features,
    architecture: normalizeRichText(arr<{ label?: string; description?: string }>(c.architecture).map((a) => `${a.label ?? ""}${a.description ? ` — ${a.description}` : ""}`)),
    process: arr<string>(c.developmentProcess).map((d, i) => ({ title: `Step ${i + 1}`, description: d })),
    externalUrl: (c.externalUrl as string) || undefined, internalHref: internal,
    seo: seoFields(c.seo ? ({ title: (c.seo as Record<string, string>).title, description: (c.seo as Record<string, string>).metaDescription, ogImage: (c.seo as Record<string, string>).ogImage } as StoredSeo) : null),
  };
}

type ArticleRowFull = Prisma.ArticleGetPayload<{ include: { category: true } }>;
function toArticle(a: ArticleRowFull): ArticleDocument {
  const c = (a.content ?? {}) as Record<string, unknown>;
  const seo = (c.seo ?? {}) as Record<string, string>;
  return {
    id: a.id, title: a.title, slug: a.slug, status: "published", excerpt: a.excerpt ?? "", category: a.category?.name ?? "",
    author: { name: String(c.authorName ?? "KASH Technology"), role: (c.authorRole as string) || undefined },
    cover: (c.cover as string) || undefined, publishedAt: String(c.publishedLabel || a.publishedAt?.toISOString().slice(0, 10) || ""),
    readTime: (c.readTime as string) || undefined, content: normalizeRichText(c.body ?? ""),
    seo: seoFields({ title: seo.title, description: seo.metaDescription, ogImage: seo.ogImage } as StoredSeo),
    relatedSlugs: Array.isArray(c.relatedSlugs) ? (c.relatedSlugs as string[]) : undefined,
  };
}
