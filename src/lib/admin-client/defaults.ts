import type { FooterConfig, HeaderConfig, NavigationLink, ThemeConfig } from "./types";

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primaryOrange: "#FF5A00", secondaryOrange: "#FF8A3D", ivory: "#FFF9F4", white: "#FFFFFF", black: "#0B0B0F",
  bodyText: "#4B5563", borderColor: "#E8E5E2", headingFont: "Geist Sans", bodyFont: "Geist Sans",
  buttonRadius: 10, cardRadius: 16, containerWidth: 1280, sectionSpacing: "Normal",
};

/* Approved defaults shown in the editors when nothing has been saved yet (mirror the live static header/footer). */
export const DEFAULT_NAVIGATION: NavigationLink[] = [
  { id: "nav-1", label: "Home", url: "/", openNewTab: false, visible: true },
  {
    id: "nav-2", label: "Services", url: "/services", openNewTab: false, visible: true,
    children: [
      ["Website Development", "/website-development"], ["Custom Software & CRM", "/custom-software-development"], ["Mobile App Development", "/mobile-app-development"],
      ["ERP / CRM Systems", "/erp-development"], ["SaaS Development", "/saas-development"], ["AI & Automation", "/ai-automation"],
      ["Content Creation", "/content-creation"], ["Video Editing", "/video-editing"], ["Branding", "/branding"],
      ["Digital Marketing", "/digital-marketing"], ["Social Media Management", "/social-media-management"], ["SEO Services", "/seo-services"],
    ].map(([label, url], i) => ({ id: `nav-2-${i + 1}`, label, url, openNewTab: false, visible: true })),
  },
  { id: "nav-3", label: "Portfolio", url: "/portfolio", openNewTab: false, visible: true },
  { id: "nav-4", label: "Packages", url: "/services#packages", openNewTab: false, visible: true },
  { id: "nav-5", label: "About", url: "/about", openNewTab: false, visible: true },
  { id: "nav-6", label: "Insights", url: "/insights", openNewTab: false, visible: true },
  { id: "nav-7", label: "Contact", url: "/contact", openNewTab: false, visible: true },
];

export const DEFAULT_HEADER: HeaderConfig = {
  logoUrl: "/images/logo/kash-logo-horizontal.jpg", sticky: true, showAnnouncement: false, announcementText: "", announcementLink: "",
  primaryCtaText: "Start Your Project", primaryCtaUrl: "/contact", secondaryCtaText: "Get a Free Audit", secondaryCtaUrl: "/contact?type=audit", mobileMenuType: "Drawer",
};

export const DEFAULT_FOOTER: FooterConfig = {
  description: "A full-service digital & technology agency helping businesses Build, Create and Grow.",
  phone: "+91 97609 42003", email: "founder@kash-technology.com", whatsapp: "",
  showNewsletter: true, newsletterHeadline: "Stay in the Loop", copyrightText: "© 2026 KASH Technology. All Rights Reserved.",
  quickLinks: [["Home", "/"], ["About Us", "/about"], ["Services", "/services"], ["Portfolio", "/portfolio"], ["Packages", "/services#packages"], ["Insights", "/insights"], ["Contact", "/contact"]].map(([label, url]) => ({ label, url })),
  servicesLinks: [["Website Development", "/website-development"], ["Mobile App Development", "/mobile-app-development"], ["Custom Software / CRM / ERP", "/custom-software-development"], ["Social Media Management", "/social-media-management"], ["Content & Video Production", "/content-creation"], ["SEO & Digital Marketing", "/seo-services"], ["Lead Generation", "/lead-generation"]].map(([label, url]) => ({ label, url })),
  legalLinks: [{ label: "Privacy Policy", url: "/privacy" }, { label: "Terms & Conditions", url: "/terms" }, { label: "Sitemap", url: "/sitemap" }],
  socialLinks: { linkedin: "https://linkedin.com/company/kash-technology", github: "https://github.com/kash-technology" },
};
