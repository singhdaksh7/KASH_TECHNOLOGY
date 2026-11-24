import { SITE_CONFIG } from "@/lib/constants";
import { INSIGHT_ARTICLES } from "@/lib/insights-data";
import { ALL_PORTFOLIO_PROJECTS } from "@/data/portfolioData";
import { CASE_STUDIES } from "@/data/case-studies";
import { DEFAULT_THEME } from "@/lib/theme/theme";
import type { CmsRepository } from "../repository";
import { FALLBACK_FOOTER, FALLBACK_HEADER } from "../fallback-content";
import { normalizeRichText } from "../richtext";
import type { ArticleDocument, GlobalSettings, ProjectDocument } from "../types";

/**
 * Adapter over the content that is hardcoded in the repo today. It makes the
 * public site fully functional with an empty CMS database: page-level
 * methods return null (the existing route implementation IS the fallback),
 * while config/list methods return the current static data.
 */

const PROJECTS: ProjectDocument[] = [
  ...Object.values(CASE_STUDIES).map(
    (c): ProjectDocument => ({
      id: `case-${c.slug}`,
      title: c.title,
      slug: c.slug,
      status: "published",
      projectStatus: "REAL PROJECT",
      category: c.category,
      description: c.description,
      technologies: c.technologies,
      problem: normalizeRichText(c.problem.map((p) => `${p}`)),
      solution: normalizeRichText(c.solution.map((p) => `${p}`)),
      features: c.features.map((f) => f.title),
      internalHref: `/work/${c.slug}`,
    }),
  ),
  ...ALL_PORTFOLIO_PROJECTS.map(
    (p): ProjectDocument => ({
      id: p.id,
      title: p.title,
      slug: p.id,
      status: "published",
      // Truthfulness: static "concept" entries are concepts, never presented as client work.
      projectStatus: p.status === "real" ? "REAL PROJECT" : "CONCEPT",
      category: p.category,
      description: p.description,
      services: [p.pillar],
      internalHref: p.href,
    }),
  ),
];

const ARTICLES: ArticleDocument[] = INSIGHT_ARTICLES.map((a) => ({
  id: a.slug,
  title: a.title,
  slug: a.slug,
  status: "published",
  excerpt: a.excerpt,
  category: a.category,
  author: a.author,
  publishedAt: a.publishedAt,
  readTime: a.readTime,
  content: normalizeRichText(a.contentHtml),
}));

const SETTINGS: GlobalSettings = {
  siteName: SITE_CONFIG.companyName,
  siteUrl: SITE_CONFIG.websiteUrl,
  tagline: SITE_CONFIG.tagline,
  defaultSeo: {
    title: "KASH Technology | Web, Software, Social Media & Digital Marketing Agency",
    description:
      "KASH Technology helps businesses build websites, apps and custom software, create video and social content, and grow through digital marketing, SEO, lead generation and automation.",
    ogImage: "/images/logo/kash-logo-emblem.jpg",
    index: true,
    follow: true,
  },
  contactEmail: SITE_CONFIG.contactEmail,
  contactPhone: SITE_CONFIG.contactPhonePrimary,
  social: FALLBACK_FOOTER.social,
  organization: {
    name: SITE_CONFIG.companyName,
    logo: "/images/logo/kash-logo-emblem.jpg",
    description:
      "Full-service digital agency delivering tailored, affordable, and scalable web platforms, mobile apps, video content, social media management, and performance marketing automation.",
  },
};

export class StaticFallbackRepository implements CmsRepository {
  async getPageBySlug() {
    return null;
  }
  async getHomePage() {
    return null;
  }
  async listPublishedPages() {
    return [];
  }
  async getNavigation() {
    return FALLBACK_HEADER;
  }
  async getFooter() {
    return FALLBACK_FOOTER;
  }
  async getTheme() {
    return DEFAULT_THEME;
  }
  async getGlobalSettings() {
    return SETTINGS;
  }
  async getPortfolio() {
    return PROJECTS;
  }
  async getPortfolioProject(slug: string) {
    return PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  async getArticles() {
    return ARTICLES;
  }
  async getArticle(slug: string) {
    return ARTICLES.find((a) => a.slug === slug) ?? null;
  }
  async getPreviewPage() {
    return null;
  }
}
