import { SITE_CONFIG } from "@/lib/constants";

export interface BusinessProfile {
  businessName: string;
  shortName: string;
  tagline: string;
  logo: string;
  favicon: string;
  websiteUrl: string;
  primaryEmail: string;
  phone: string;
  alternatePhone?: string;
  whatsapp: string;
  defaultLocale: string;
  timezone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  social: {
    linkedin?: string;
    github?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  organizationSchema: {
    legalName?: string;
    foundingYear?: string;
    priceRange?: string;
    knowsAbout?: string[];
  };
}

export function getDefaultBusinessProfile(): BusinessProfile {
  return {
    businessName: SITE_CONFIG.companyName,
    shortName: "KASH",
    tagline: SITE_CONFIG.tagline,
    logo: "/images/kash-logo.svg",
    favicon: "/favicon.ico",
    websiteUrl: SITE_CONFIG.websiteUrl,
    primaryEmail: SITE_CONFIG.contactEmail,
    phone: SITE_CONFIG.contactPhonePrimary,
    alternatePhone: SITE_CONFIG.contactPhoneAlternate,
    whatsapp: SITE_CONFIG.whatsappNumber,
    defaultLocale: "en-IN",
    timezone: "Asia/Kolkata",
    social: {
      linkedin: SITE_CONFIG.social.linkedin,
      github: SITE_CONFIG.social.github,
      facebook: SITE_CONFIG.social.facebook,
      twitter: SITE_CONFIG.social.twitter,
      instagram: SITE_CONFIG.social.instagram,
      youtube: SITE_CONFIG.social.youtube,
    },
    organizationSchema: {
      legalName: "KASH Technology Private Limited",
      foundingYear: "2024",
      priceRange: "$$",
      knowsAbout: [
        "Software Engineering",
        "Website Development",
        "Mobile App Development",
        "AI & Automation",
        "ERP & CRM",
        "Performance Marketing",
      ],
    },
  };
}
