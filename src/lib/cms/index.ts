import { cache } from "react";
import { ApiCmsRepository } from "./adapters/api";
import { StaticFallbackRepository } from "./adapters/static-fallback";
import type { CmsRepository } from "./repository";
import { cmsEnv } from "./env";
import { resolveTheme } from "@/lib/theme/theme";
import type { ArticleDocument, FooterConfig, GlobalSettings, HeaderConfig, ProjectDocument, ThemeConfig } from "./types";

export * from "./types";
export type { CmsRepository, PageSummary } from "./repository";

const fallback = new StaticFallbackRepository();
const api = new ApiCmsRepository();

/** First non-null/non-empty wins; the CMS is always consulted first, static content is the safety net. */
async function firstOf<T>(primary: () => Promise<T | null>, secondary: () => Promise<T | null>): Promise<T | null> {
  try {
    const p = await primary();
    if (p) return p;
  } catch {
    /* adapters should not throw; guard anyway */
  }
  return secondary();
}

async function listOf<T>(primary: () => Promise<T[]>, secondary: () => Promise<T[]>): Promise<T[]> {
  try {
    const p = await primary();
    if (p.length) return p;
  } catch {
    /* ignore */
  }
  return secondary();
}

/** Composed repository: API first (when configured), static fallback always available. */
export const cms: CmsRepository = {
  // Pages: only the CMS can produce them; null means "render the existing route implementation".
  getPageBySlug: (slug) => (cmsEnv.apiUrl ? api.getPageBySlug(slug) : fallback.getPageBySlug()),
  getHomePage: () => (cmsEnv.apiUrl ? api.getHomePage() : fallback.getHomePage()),
  listPublishedPages: () => (cmsEnv.apiUrl ? api.listPublishedPages() : fallback.listPublishedPages()),
  getPreviewPage: (id, credential) => api.getPreviewPage(id, credential),
  getNavigation: () => firstOf(() => api.getNavigation(), () => fallback.getNavigation()),
  getFooter: () => firstOf(() => api.getFooter(), () => fallback.getFooter()),
  getTheme: () => firstOf(() => api.getTheme(), () => fallback.getTheme()),
  getGlobalSettings: () => firstOf(() => api.getGlobalSettings(), () => fallback.getGlobalSettings()),
  getPortfolio: () => listOf(() => api.getPortfolio(), () => fallback.getPortfolio()),
  getPortfolioProject: (slug) => firstOf(() => api.getPortfolioProject(slug), () => fallback.getPortfolioProject(slug)),
  getArticles: () => listOf(() => api.getArticles(), () => fallback.getArticles()),
  getArticle: (slug) => firstOf(() => api.getArticle(slug), () => fallback.getArticle(slug)),
};

/* ───────── per-request memoised, non-null helpers for server components ───────── */
export const getHeaderConfig = cache(async (): Promise<HeaderConfig> => (await cms.getNavigation()) ?? (await fallback.getNavigation())!);
export const getFooterConfig = cache(async (): Promise<FooterConfig> => (await cms.getFooter()) ?? (await fallback.getFooter())!);
export const getThemeConfig = cache(async (): Promise<ThemeConfig> => resolveTheme(await cms.getTheme()));
export const getSettings = cache(async (): Promise<GlobalSettings> => (await cms.getGlobalSettings()) ?? (await fallback.getGlobalSettings())!);
export const getPortfolioProjects = cache(async (): Promise<ProjectDocument[]> => cms.getPortfolio());
export const getPublishedArticles = cache(async (): Promise<ArticleDocument[]> => cms.getArticles());
