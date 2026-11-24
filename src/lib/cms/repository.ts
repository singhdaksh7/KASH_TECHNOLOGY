import type {
  ArticleDocument,
  FooterConfig,
  GlobalSettings,
  HeaderConfig,
  PageDocument,
  FormDefinition,
  PageType,
  ProjectDocument,
  SeoFields,
  ThemeConfig,
} from "./types";

export interface PageSummary {
  slug: string;
  pageType: PageType;
  updatedAt?: string;
  seo?: SeoFields;
}

/**
 * The single seam between the public website and wherever content lives.
 *
 * Contract:
 *  - Methods NEVER throw. "Not available" is `null` / `[]`.
 *  - Public methods return PUBLISHED content only. Drafts are only reachable
 *    through getPreviewPage(), which needs a preview credential.
 *  - Implementations: ApiCmsRepository (production boundary, talks HTTP to the
 *    CMS backend) and StaticFallbackRepository (today's hardcoded content).
 */
export interface CmsRepository {
  getPageBySlug(slug: string): Promise<PageDocument | null>;
  getHomePage(): Promise<PageDocument | null>;
  /** Published pages for sitemap + generateStaticParams (never drafts). */
  listPublishedPages(): Promise<PageSummary[]>;
  getNavigation(): Promise<HeaderConfig | null>;
  getFooter(): Promise<FooterConfig | null>;
  getTheme(): Promise<Partial<ThemeConfig> | null>;
  getGlobalSettings(): Promise<GlobalSettings | null>;
  getPortfolio(): Promise<ProjectDocument[]>;
  getPortfolioProject(slug: string): Promise<ProjectDocument | null>;
  getArticles(): Promise<ArticleDocument[]>;
  getArticle(slug: string): Promise<ArticleDocument | null>;
  getForm(slug: string): Promise<FormDefinition | null>;
  /** Draft-capable read. `credential` is whatever authorizePreview() accepted. */
  getPreviewPage(id: string, credential: string): Promise<PageDocument | null>;
}
