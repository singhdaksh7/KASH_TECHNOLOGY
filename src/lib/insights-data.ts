export type InsightCategory =
  | "Website Development"
  | "Custom Software"
  | "ERP & CRM"
  | "Mobile Apps"
  | "AI & Automation"
  | "E-commerce"
  | "SaaS"
  | "Technology for Businesses";

export interface InsightArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  contentHtml: string[];
}

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  "Website Development",
  "Custom Software",
  "ERP & CRM",
  "Mobile Apps",
  "AI & Automation",
  "E-commerce",
  "SaaS",
  "Technology for Businesses",
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "why-custom-software-outperforms-off-the-shelf-delhi-ncr",
    title: "Why Custom Software Outperforms Off-the-Shelf Packages for Growing Businesses in Delhi NCR",
    excerpt: "Commercial off-the-shelf software promises quick setup, but hidden subscription fees and rigid workflows often cripple growing companies. Here is why engineering custom solutions delivers higher long-term ROI.",
    category: "Custom Software",
    publishedAt: "August 2026",
    readTime: "6 min read",
    author: {
      name: "KASH Engineering Team",
      role: "Lead Systems Architect",
    },
    contentHtml: [
      "When a business reaches 20 to 100 employees, off-the-shelf commercial software inevitably begins to creak. What was initially marketed as an all-in-one platform quickly turns into a patchwork of disconnected spreadsheets, expensive third-party plugins, and rising per-user subscription fees.",
      "Across Delhi NCR and Western Uttar Pradesh, growing manufacturing units, wholesale traders, and logistics companies frequently encounter the same ceiling: standard software forces the company to alter its operational processes to fit the software, rather than the software conforming to the business.",
      "Custom software reverses this dynamic. By designing database models around your exact multi-branch workflows, approval hierarchies, and billing models, every user interaction directly saves time and eliminates administrative errors.",
      "Furthermore, custom software remains a proprietary asset on your balance sheet. Rather than paying endless recurring fees to external vendors, you own the code, control your data security, and scale your user base without artificial pricing tiers."
    ],
  },
  {
    slug: "migrating-spreadsheets-to-custom-erp-blueprint",
    title: "Migrating from Spreadsheets to a Custom ERP: The Practical Blueprint",
    excerpt: "Spreadsheets run the world until version conflicts, formula breaks, and data silos create financial blind spots. Learn how to execute a zero-downtime transition to a relational cloud ERP.",
    category: "ERP & CRM",
    publishedAt: "July 2026",
    readTime: "8 min read",
    author: {
      name: "KASH Engineering Team",
      role: "Database Architect",
    },
    contentHtml: [
      "Microsoft Excel and Google Sheets are extraordinary tools for early-stage exploration. However, as transaction volumes rise across multiple locations, spreadsheets introduce severe operational risks: accidental cell overrides, fragmented file versions, and zero auditable security.",
      "Transitioning to a custom ERP does not require shutting down operations. The process begins with schema normalization—analyzing existing spreadsheet rows and translating them into robust, relational PostgreSQL tables with ACID transactional guarantees.",
      "The next step is parallel validation. For two to three billing cycles, the custom ERP runs concurrently alongside existing spreadsheets, allowing your accounting and dispatch teams to verify total balance accuracy before cutting over completely.",
      "Once deployed, role-based access ensures that employees only access the modules necessary for their jobs, while leadership gains an instantaneous, real-time pulse of cash flow, inventory, and pending receivables."
    ],
  },
  {
    slug: "nextjs-architecture-for-indian-ecommerce-conversion",
    title: "Building Fast, High-Converting Web Platforms: Next.js Architecture for Indian E-Commerce",
    excerpt: "Every 100ms of latency on mobile devices reduces checkout conversion rates. Discover how modern Next.js server-side rendering and edge caching maximize sales on Indian networks.",
    category: "Website Development",
    publishedAt: "June 2026",
    readTime: "5 min read",
    author: {
      name: "KASH Engineering Team",
      role: "Frontend Performance Lead",
    },
    contentHtml: [
      "Over 75% of Indian e-commerce transactions now originate on mobile devices, often on fluctuating 4G/5G connections. Heavy, plugin-laden CMS websites that take 5 to 8 seconds to load suffer staggering cart abandonment rates.",
      "By adopting Next.js with React Server Components, the heavy computational work is executed on edge servers in Mumbai and Delhi, delivering pre-rendered, lightweight HTML and CSS directly to the visitor's smartphone.",
      "Coupled with instant UPI intent flows through Razorpay and Cashfree, one-click address completion, and zero cumulative layout shift (CLS), visitors experience native-app responsiveness inside standard mobile browsers.",
      "For businesses in competitive retail and B2B markets, speed is no longer just a technical metric—it is the single highest-leverage conversion driver available."
    ],
  },
];
