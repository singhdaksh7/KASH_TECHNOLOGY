export const SITE_CONFIG = {
  companyName: "KASH Technologies",
  websiteUrl: "https://kashtechnologies.com",
  contactEmail: "hello@kashtechnologies.com",
  products: {
    exora: {
      name: "Exora",
      description: "Cryptocurrency Exchange",
      caseStudyPath: "/work/exora",
      externalUrl: null,
    },
    schoolsync: {
      name: "SchoolSync",
      description: "Multi-Tenant School ERP",
      caseStudyPath: "/work/schoolsync",
      externalUrl: null,
    },
    launchpad: {
      name: "BSC Crypto Launchpad",
      description: "Crypto Launchpad",
      caseStudyPath: "/work/crypto-launchpad",
      externalUrl: null,
    },
  },
  social: {
    github: null,
    linkedin: null,
    twitter: null,
  },
  navLinks: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
