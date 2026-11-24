/**
 * CMS domain contracts.
 *
 * These types are the ONLY shape the public website knows about. React
 * components never import Prisma types; the API adapter validates incoming
 * JSON against the zod schemas in ./schemas.ts and maps it to these types.
 */

export type PublishStatus = "draft" | "published" | "archived";
export type PageType = "home" | "page" | "service" | "location" | "landing";

/* ───────── SEO ───────── */
export interface SeoFields {
  title?: string;
  description?: string;
  /** Absolute URL, or a path (resolved against the site URL). */
  canonical?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterImage?: string;
  /** Defaults to true. */
  index?: boolean;
  /** Defaults to true. */
  follow?: boolean;
}

/* ───────── Section style ───────── */
export type SectionBackground = "default" | "ivory" | "dark" | "primary" | "transparent";
export type SectionTextColor = "auto" | "light" | "dark";
export type SectionSpacing = "none" | "sm" | "md" | "lg" | "xl";
export type SectionContainer = "narrow" | "default" | "wide" | "full";
export type SectionAlignment = "left" | "center" | "right";
export type SectionRadius = "none" | "sm" | "md" | "lg" | "xl";
export type SectionShadow = "none" | "sm" | "md" | "lg";

export interface SectionStyle {
  background?: SectionBackground;
  textColor?: SectionTextColor;
  paddingTop?: SectionSpacing;
  paddingBottom?: SectionSpacing;
  container?: SectionContainer;
  alignment?: SectionAlignment;
  borderRadius?: SectionRadius;
  shadow?: SectionShadow;
  /** Restricted to [a-z0-9 _-]; see sanitizeCustomClass. */
  customClass?: string;
}

/* ───────── Rich text (structured JSON, rendered as React — never raw HTML) ───────── */
export type RichTextInline =
  | { type: "text"; text: string; bold?: boolean; italic?: boolean; code?: boolean }
  | { type: "link"; href: string; children: RichTextInline[] };

export type RichTextBlock =
  | { type: "paragraph"; children: RichTextInline[] }
  | { type: "heading"; level: 2 | 3 | 4; children: RichTextInline[] }
  | { type: "list"; ordered?: boolean; items: RichTextInline[][] }
  | { type: "quote"; children: RichTextInline[] }
  | { type: "image"; src: string; alt: string }
  | { type: "divider" };

/**
 * Rich text may arrive as structured blocks (preferred), as plain paragraphs,
 * or as an HTML string that is sanitized server-side into the same block tree.
 */
export type RichTextValue = RichTextBlock[];

/* ───────── Sections ───────── */
export const SECTION_TYPES = [
  "builtIn",
  "textImage",
  "customEmbed",
  "serviceShowcase",
  "agencyPillars",
  "hero",
  "richText",
  "imageText",
  "servicesGrid",
  "portfolioGrid",
  "featuredProject",
  "cta",
  "faq",
  "stats",
  "trustStrip",
  "logoStrip",
  "founder",
  "team",
  "process",
  "video",
  "gallery",
  "contactForm",
  "pricing",
  "testimonials",
  "insightsFeed",
  "spacer",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface CtaLink {
  label: string;
  href: string;
}

export interface Section {
  id: string;
  /** Kept as string so unknown future types survive parsing and fail gracefully at render. */
  type: SectionType | (string & {});
  order: number;
  enabled: boolean;
  /** Section-type specific payload. Narrowed by each section component. */
  content: Record<string, unknown>;
  /** Builder style JSON; interpreted by resolveStyle() (unknown values ignored). */
  style?: SectionStyle | Record<string, unknown>;
}

export interface PageDocument {
  id: string;
  title: string;
  /** No leading slash. Empty string or "home" means the homepage. Nested: "noida/custom-software-development". */
  slug: string;
  status: PublishStatus;
  pageType: PageType;
  seo?: SeoFields;
  sections: Section[];
  /** ISO timestamps. */
  updatedAt?: string;
  publishedAt?: string;
  /** Optional per-page breadcrumb trail override. */
  breadcrumbs?: { label: string; href?: string }[];
  /** Optional FAQ list used for FAQPage schema when a faq section exists. */
  schemaType?: "WebPage" | "Service";
}

/* ───────── Navigation / header ───────── */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeaderConfig {
  logo?: { src?: string; alt?: string };
  menu: NavItem[];
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  announcement?: { text: string; href?: string };
  sticky: boolean;
}

/* ───────── Footer ───────── */
export interface FooterColumn {
  title: string;
  /** Visual accent for the column heading (kept to the KASH palette). */
  accent?: "primary" | "gold" | "neutral";
  links: NavItem[];
  /** Render links in a 2-column grid (used for "Areas We Serve"). */
  grid?: boolean;
}

export interface SocialLink {
  platform: "linkedin" | "github" | "facebook" | "twitter" | "instagram" | "youtube" | "whatsapp";
  href: string;
}

export interface FooterConfig {
  logo?: { src?: string; alt?: string };
  description: string;
  tagline?: string;
  columns: FooterColumn[];
  phone?: string;
  email?: string;
  whatsapp?: string;
  social: SocialLink[];
  newsletter?: { enabled: boolean; formSlug?: string; heading?: string };
  note?: string;
  copyright: string;
  legal: NavItem[];
}

/* ───────── Theme ───────── */
export interface ThemeConfig {
  colorPrimary: string;
  colorSecondary: string;
  colorIvory: string;
  colorBackground: string;
  colorText: string;
  colorMuted: string;
  colorBorder: string;
  radiusButton: string;
  radiusCard: string;
  containerWidth: string;
  sectionSpacing: string;
}

/* ───────── Global settings ───────── */
export interface GlobalSettings {
  siteName: string;
  siteUrl: string;
  tagline?: string;
  defaultSeo: SeoFields;
  contactEmail?: string;
  contactPhone?: string;
  social: SocialLink[];
  /** Used for Organization schema. Must be real data — never invent ratings. */
  organization?: { name: string; logo?: string; description?: string };
}

/* ───────── Portfolio ───────── */
export type ProjectStatus = "REAL PROJECT" | "PROTOTYPE" | "IN DEVELOPMENT" | "STAGING" | "CONCEPT";

export interface ProjectDocument {
  id: string;
  title: string;
  slug: string;
  status: PublishStatus;
  projectStatus: ProjectStatus;
  category: string;
  thumbnail?: string;
  hero?: string;
  gallery?: string[];
  description: string;
  technologies?: string[];
  services?: string[];
  problem?: RichTextValue;
  solution?: RichTextValue;
  features?: string[];
  architecture?: RichTextValue;
  process?: { title: string; description: string }[];
  externalUrl?: string;
  /** Internal case-study path (e.g. /work/exora) when a bespoke static page exists. */
  internalHref?: string;
  seo?: SeoFields;
}

/* ───────── Articles ───────── */
export interface ArticleDocument {
  id: string;
  title: string;
  slug: string;
  status: PublishStatus;
  excerpt: string;
  category: string;
  author: { name: string; role?: string };
  cover?: string;
  /** Free text ("August 2026") or ISO date. */
  publishedAt: string;
  readTime?: string;
  content: RichTextValue;
  seo?: SeoFields;
  relatedSlugs?: string[];
}

/* ───────── Forms ───────── */
export interface FormFieldDefinition {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file" | "hidden";
  required: boolean;
  placeholder?: string;
  options?: string[];
  /** Advanced forms (all optional; absent = single step, always visible). */
  step?: number;
  section?: string;
  description?: string;
  conditionalRules?: unknown;
}
export interface FormDefinition {
  slug: string;
  title: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  successRedirectUrl?: string;
  /** Titles for multi-step forms (index 0 = step 1). */
  steps?: string[];
  fields: FormFieldDefinition[];
}
