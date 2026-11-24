import { z } from "zod";
import type { NavItem } from "./types";

/**
 * Runtime validators for data crossing the API boundary. Anything that fails
 * validation is treated as "CMS unavailable for this resource" and the
 * fallback adapter takes over.
 */

const str = z.string();
const optStr = z.string().optional();

export const seoSchema = z
  .object({
    title: optStr,
    description: optStr,
    canonical: optStr,
    keywords: z.array(str).optional(),
    ogTitle: optStr,
    ogDescription: optStr,
    ogImage: optStr,
    twitterImage: optStr,
    index: z.boolean().optional(),
    follow: z.boolean().optional(),
  })
  .partial();

export const sectionStyleSchema = z
  .object({
    background: z.enum(["default", "ivory", "dark", "primary", "transparent"]),
    textColor: z.enum(["auto", "light", "dark"]),
    paddingTop: z.enum(["none", "sm", "md", "lg", "xl"]),
    paddingBottom: z.enum(["none", "sm", "md", "lg", "xl"]),
    container: z.enum(["narrow", "default", "wide", "full"]),
    alignment: z.enum(["left", "center", "right"]),
    borderRadius: z.enum(["none", "sm", "md", "lg", "xl"]),
    shadow: z.enum(["none", "sm", "md", "lg"]),
    customClass: z.string().max(120),
  })
  .partial();

export const sectionSchema = z.object({
  id: str,
  type: str,
  order: z.number().default(0),
  enabled: z.boolean().default(true),
  content: z.record(z.string(), z.unknown()).default({}),
  style: sectionStyleSchema.optional(),
});

export const pageDocumentSchema = z.object({
  id: str,
  title: str,
  slug: str,
  status: z.enum(["draft", "published", "archived"]),
  pageType: z.enum(["home", "page", "service", "location", "landing"]).default("page"),
  seo: seoSchema.optional(),
  sections: z.array(sectionSchema).default([]),
  updatedAt: optStr,
  publishedAt: optStr,
  breadcrumbs: z.array(z.object({ label: str, href: optStr })).optional(),
  schemaType: z.enum(["WebPage", "Service"]).optional(),
});

const navItemSchema: z.ZodType<NavItem> = z.lazy(() =>
  z.object({ label: str, href: str, children: z.array(navItemSchema).optional() }),
);
const ctaSchema = z.object({ label: str, href: str });
const logoSchema = z.object({ src: optStr, alt: optStr });
const socialSchema = z.object({
  platform: z.enum(["linkedin", "github", "facebook", "twitter", "instagram", "youtube", "whatsapp"]),
  href: str,
});

export const headerConfigSchema = z.object({
  logo: logoSchema.optional(),
  menu: z.array(navItemSchema),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
  announcement: z.object({ text: str, href: optStr }).optional(),
  sticky: z.boolean().default(true),
});

export const footerConfigSchema = z.object({
  logo: logoSchema.optional(),
  description: str,
  tagline: optStr,
  columns: z.array(
    z.object({
      title: str,
      accent: z.enum(["primary", "gold", "neutral"]).optional(),
      links: z.array(navItemSchema),
      grid: z.boolean().optional(),
    }),
  ),
  phone: optStr,
  email: optStr,
  whatsapp: optStr,
  social: z.array(socialSchema).default([]),
  newsletter: z.object({ enabled: z.boolean(), formSlug: optStr, heading: optStr }).optional(),
  note: optStr,
  copyright: str,
  legal: z.array(navItemSchema).default([]),
});

export const themeConfigSchema = z
  .object({
    colorPrimary: str,
    colorSecondary: str,
    colorIvory: str,
    colorBackground: str,
    colorText: str,
    colorMuted: str,
    colorBorder: str,
    radiusButton: str,
    radiusCard: str,
    containerWidth: str,
    sectionSpacing: str,
  })
  .partial();

const richTextLoose = z.array(z.unknown());

export const projectSchema = z.object({
  id: str,
  title: str,
  slug: str,
  status: z.enum(["draft", "published", "archived"]),
  projectStatus: z.enum(["REAL PROJECT", "PROTOTYPE", "CONCEPT"]),
  category: str,
  thumbnail: optStr,
  hero: optStr,
  gallery: z.array(str).optional(),
  description: str,
  technologies: z.array(str).optional(),
  services: z.array(str).optional(),
  problem: richTextLoose.optional(),
  solution: richTextLoose.optional(),
  features: z.array(str).optional(),
  architecture: richTextLoose.optional(),
  process: z.array(z.object({ title: str, description: str })).optional(),
  externalUrl: optStr,
  internalHref: optStr,
  seo: seoSchema.optional(),
});

export const articleSchema = z.object({
  id: str,
  title: str,
  slug: str,
  status: z.enum(["draft", "published", "archived"]),
  excerpt: str,
  category: str,
  author: z.object({ name: str, role: optStr }),
  cover: optStr,
  publishedAt: str,
  readTime: optStr,
  content: z.union([richTextLoose, str]),
  seo: seoSchema.optional(),
  relatedSlugs: z.array(str).optional(),
});

export const globalSettingsSchema = z.object({
  siteName: str,
  siteUrl: str,
  tagline: optStr,
  defaultSeo: seoSchema.default({}),
  contactEmail: optStr,
  contactPhone: optStr,
  social: z.array(socialSchema).default([]),
  organization: z.object({ name: str, logo: optStr, description: optStr }).optional(),
});
