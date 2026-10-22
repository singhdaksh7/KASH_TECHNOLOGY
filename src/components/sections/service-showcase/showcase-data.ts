export interface ShowcaseService {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  accent: string;
  category: "BUILD" | "CREATE" | "GROW" | "SCALE";
  statsLabel: string;
  statsValue: string;
}

export const SHOWCASE_SERVICES: ShowcaseService[] = [
  {
    id: "web-products",
    number: "01",
    title: "Websites & Digital Products",
    description: "Fast, conversion-focused websites and powerful web platforms engineered around your business.",
    tags: ["Business Websites", "E-commerce", "Web Applications", "Customer Portals"],
    href: "/website-development",
    accent: "#f36b21",
    category: "BUILD",
    statsLabel: "Lighthouse Performance",
    statsValue: "99/100",
  },
  {
    id: "apps-custom-software",
    number: "02",
    title: "Apps & Custom Software",
    description: "Purpose-built mobile applications and custom software that replace disconnected tools and manual workflows.",
    tags: ["iOS & Android", "Internal Tools", "Dashboards", "Custom Platforms"],
    href: "/custom-software-development",
    accent: "#c5a880",
    category: "BUILD",
    statsLabel: "System Reliability",
    statsValue: "99.99%",
  },
  {
    id: "social-media",
    number: "03",
    title: "Social Media Management",
    description: "Active, consistent social presence across Instagram, LinkedIn, and Facebook that builds brand authority and audience trust.",
    tags: ["Content Calendars", "Post Scheduling", "Community Growth", "Monthly Reporting"],
    href: "/social-media-management",
    accent: "#f36b21",
    category: "GROW",
    statsLabel: "Publishing Cadence",
    statsValue: "Consistent & Active",
  },
  {
    id: "video-content",
    number: "04",
    title: "Video & Content Creation",
    description: "High-retention reels, short-form edits, and branded creatives designed to capture attention and communicate your value.",
    tags: ["Short-form Reels", "YouTube Edits", "Brand Creatives", "Motion Graphics"],
    href: "/content-creation",
    accent: "#c5a880",
    category: "CREATE",
    statsLabel: "Production Quality",
    statsValue: "Studio-Grade",
  },
  {
    id: "marketing-leadgen",
    number: "05",
    title: "Marketing & Lead Generation",
    description: "Data-driven performance campaigns and conversion funnels engineered to capture qualified leads and grow sales.",
    tags: ["Meta & Google Ads", "Funnel Planning", "Lead Capture", "Remarketing"],
    href: "/digital-marketing",
    accent: "#f36b21",
    category: "GROW",
    statsLabel: "Lead Funnel Engine",
    statsValue: "Multi-Channel",
  },
  {
    id: "ai-automation",
    number: "06",
    title: "AI & Business Automation",
    description: "Intelligent workflows, CRM integrations, and automated pipelines that connect your marketing to sales and operations.",
    tags: ["AI Workflows", "CRM Sync", "WhatsApp Pipelines", "System Integrations"],
    href: "/ai-automation",
    accent: "#c5a880",
    category: "SCALE",
    statsLabel: "Operational Impact",
    statsValue: "Zero Repetitive Work",
  },
];
