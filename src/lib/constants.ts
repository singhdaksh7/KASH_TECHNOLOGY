export const SITE_CONFIG = {
  companyName: "KASH Technologies",
  websiteUrl: "https://kash-technology.com",
  contactEmail: "founder@kash-technology.com",
  contactPhonePrimary: "+91 97609 42003",
  contactPhoneAlternate: "+91 97606 58804",
  products: {
    exora: {
      name: "Exora",
      description: "Cryptocurrency Exchange",
      caseStudyPath: "/work/exora",
      externalUrl: "https://exorain.com",
    },
    schoolsync: {
      name: "SchoolSync",
      description: "Multi-Tenant School ERP",
      caseStudyPath: "/work/schoolsync",
      externalUrl: "https://zipinnovate.com",
    },
    launchpad: {
      name: "BSC Crypto Launchpad",
      description: "Crypto Launchpad",
      caseStudyPath: "/work/crypto-launchpad",
      externalUrl: "https://crypto-launchedpad-mvp.vercel.app",
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
