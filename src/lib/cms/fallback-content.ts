import { SITE_CONFIG } from "@/lib/constants";
import type { FooterConfig, HeaderConfig } from "./types";

/**
 * Today's hardcoded header/footer, expressed as CMS configs. This is the
 * single source of truth for the fallback; Footer.tsx imports it so the
 * rendered output is identical whether or not the CMS has content.
 */

export const FALLBACK_HEADER: HeaderConfig = {
  menu: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Website Development", href: "/website-development" },
        { label: "Custom Software & CRM", href: "/custom-software-development" },
        { label: "Mobile App Development", href: "/mobile-app-development" },
        { label: "ERP / CRM Systems", href: "/erp-development" },
        { label: "SaaS Development", href: "/saas-development" },
        { label: "AI & Automation", href: "/ai-automation" },
        { label: "Content Creation", href: "/content-creation" },
        { label: "Video Editing", href: "/video-editing" },
        { label: "Branding", href: "/branding" },
        { label: "Digital Marketing", href: "/digital-marketing" },
        { label: "Social Media Management", href: "/social-media-management" },
        { label: "SEO Services", href: "/seo-services" },
      ],
    },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Packages", href: "/services#packages" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: { label: "Start Your Project", href: "/contact" },
  secondaryCta: { label: "Get a Free Audit", href: "/contact?type=audit" },
  sticky: true,
};

export const FALLBACK_FOOTER: FooterConfig = {
  description: "A full-service digital & technology agency helping businesses Build, Create and Grow.",
  columns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Packages", href: "/services#packages" },
        { label: "Insights", href: "/insights" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Our Services",
      links: [
        { label: "Website Development", href: "/website-development" },
        { label: "Mobile App Development", href: "/mobile-app-development" },
        { label: "Custom Software / CRM / ERP", href: "/custom-software-development" },
        { label: "Social Media Management", href: "/social-media-management" },
        { label: "Content & Video Production", href: "/content-creation" },
        { label: "SEO & Digital Marketing", href: "/seo-services" },
        { label: "Lead Generation", href: "/lead-generation" },
      ],
    },
  ],
  phone: SITE_CONFIG.contactPhonePrimary,
  email: SITE_CONFIG.contactEmail,
  whatsapp: SITE_CONFIG.whatsappUrl,
  social: [
    ...(SITE_CONFIG.social.linkedin ? [{ platform: "linkedin" as const, href: SITE_CONFIG.social.linkedin }] : []),
    ...(SITE_CONFIG.social.github ? [{ platform: "github" as const, href: SITE_CONFIG.social.github }] : []),
    ...(SITE_CONFIG.social.instagram ? [{ platform: "instagram" as const, href: SITE_CONFIG.social.instagram }] : []),
    ...(SITE_CONFIG.social.youtube ? [{ platform: "youtube" as const, href: SITE_CONFIG.social.youtube }] : []),
  ],
  newsletter: {
    enabled: true,
    formSlug: "newsletter",
    heading: "Stay in the Loop",
  },
  note: "Serving businesses across Delhi NCR & Western UP",
  copyright: "© 2026 KASH Technology. All Rights Reserved.",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Sitemap", href: "/sitemap" },
  ],
};
