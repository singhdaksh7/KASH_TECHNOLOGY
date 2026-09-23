export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  category: "Web Platforms" | "Mobile Apps" | "Enterprise Solutions" | "E-commerce" | "CRM / ERP" | "Dashboard / Analytics";
  previewType: "erp" | "mobile" | "health" | "edulearn" | "logistics" | "realestate" | "medicare" | "agriculture";
  href: string;
  status: "real" | "concept";
}

export const ALL_PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: "fintrack-erp",
    title: "FinTrack ERP",
    description: "Finance & operations ERP platform.",
    tag: "ERP / Finance",
    category: "CRM / ERP",
    previewType: "erp",
    href: "/contact",
    status: "concept",
  },
  {
    id: "shopease",
    title: "ShopEase",
    description: "E-commerce mobile app experience.",
    tag: "E-commerce / Retail",
    category: "Mobile Apps",
    previewType: "mobile",
    href: "/contact",
    status: "concept",
  },
  {
    id: "healthplus-crm",
    title: "HealthPlus CRM",
    description: "Healthcare CRM & patient platform.",
    tag: "Healthcare / CRM",
    category: "CRM / ERP",
    previewType: "health",
    href: "/contact",
    status: "concept",
  },
  {
    id: "edulearn-platform",
    title: "EduLearn Platform",
    description: "Online learning & assessment portal.",
    tag: "Education / E-learning",
    category: "Web Platforms",
    previewType: "edulearn",
    href: "/contact",
    status: "concept",
  },
  {
    id: "logimove-dashboard",
    title: "LogiMove Dashboard",
    description: "Logistics and fleet tracking system.",
    tag: "Logistics / Dashboard",
    category: "Dashboard / Analytics",
    previewType: "logistics",
    href: "/contact",
    status: "concept",
  },
  {
    id: "propertyhub-web",
    title: "PropertyHub Web",
    description: "Real estate listings and lead CRM.",
    tag: "Real Estate / Web",
    category: "Web Platforms",
    previewType: "realestate",
    href: "/contact",
    status: "concept",
  },
  {
    id: "medicare-app",
    title: "MediCare App",
    description: "Telemedicine & appointment bookings.",
    tag: "Healthcare / Mobile App",
    category: "Mobile Apps",
    previewType: "medicare",
    href: "/contact",
    status: "concept",
  },
  {
    id: "agrismart-solution",
    title: "AgriSmart Solution",
    description: "Crop monitoring & yield analytics.",
    tag: "Agriculture / Analytics",
    category: "Dashboard / Analytics",
    previewType: "agriculture",
    href: "/contact",
    status: "concept",
  },
];
