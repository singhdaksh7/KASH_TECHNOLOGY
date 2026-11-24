import { SITE_CONFIG } from "@/lib/constants";
import type { FooterConfig, HeaderConfig, NavItem } from "./types";

/**
 * Today's hardcoded header/footer, expressed as CMS configs. This is the
 * single source of truth for the fallback; Footer.tsx imports it so the
 * rendered output is identical whether or not the CMS has content.
 */

export const FALLBACK_HEADER: HeaderConfig = {
  menu: SITE_CONFIG.navLinks.map(
    (l): NavItem => ({
      label: l.label,
      href: l.href,
      children: "children" in l && l.children ? l.children.map((c) => ({ label: c.label, href: c.href })) : undefined,
    }),
  ),
  primaryCta: { label: "Start Your Project", href: SITE_CONFIG.bookingUrl },
  sticky: true,
};

export const FALLBACK_FOOTER: FooterConfig = {
  description:
    "KASH Technology is a full-service digital agency uniting engineering, creative content, performance marketing, and business automation.",
  tagline: "We Build. We Create. We Grow.",
  columns: [
    {
      title: "Technology",
      accent: "neutral",
      links: [
        { label: "Website Development", href: "/website-development" },
        { label: "Custom Software", href: "/custom-software-development" },
        { label: "Mobile Apps", href: "/mobile-app-development" },
        { label: "ERP / CRM", href: "/erp-development" },
        { label: "SaaS", href: "/saas-development" },
        { label: "AI Automation", href: "/ai-automation" },
      ],
    },
    {
      title: "Creative",
      accent: "gold",
      links: [
        { label: "Content Creation", href: "/content-creation" },
        { label: "Video Editing", href: "/video-editing" },
        { label: "Branding", href: "/branding" },
      ],
    },
    {
      title: "Marketing",
      accent: "primary",
      links: [
        { label: "Social Media Management", href: "/social-media-management" },
        { label: "Digital Marketing", href: "/digital-marketing" },
        { label: "Performance Marketing", href: "/performance-marketing" },
        { label: "Lead Generation", href: "/lead-generation" },
        { label: "SEO Services", href: "/seo-services" },
      ],
    },
    {
      title: "Areas We Serve",
      accent: "neutral",
      grid: true,
      links: [
        { label: "Delhi NCR", href: "/delhi-ncr" },
        { label: "Noida", href: "/noida" },
        { label: "Greater Noida", href: "/greater-noida" },
        { label: "Ghaziabad", href: "/ghaziabad" },
        { label: "Meerut", href: "/meerut" },
        { label: "Baghpat", href: "/baghpat" },
        { label: "Baraut", href: "/baraut" },
        { label: "Western UP", href: "/western-up" },
      ],
    },
  ],
  phone: SITE_CONFIG.contactPhonePrimary,
  email: SITE_CONFIG.contactEmail,
  whatsapp: SITE_CONFIG.whatsappUrl,
  social: [
    ...(SITE_CONFIG.social.linkedin ? [{ platform: "linkedin" as const, href: SITE_CONFIG.social.linkedin }] : []),
    ...(SITE_CONFIG.social.github ? [{ platform: "github" as const, href: SITE_CONFIG.social.github }] : []),
  ],
  note: SITE_CONFIG.locationText,
  copyright: "© 2026 KASH Technology. All rights reserved.",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
