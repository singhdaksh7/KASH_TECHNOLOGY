export interface CuratedLocalService {
  locationSlug: string;
  locationName: string;
  serviceSlug: string;
  serviceName: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  h1Primary: string;
  h1Accent: string;
  intro: string;
  deliverables: {
    title: string;
    description: string;
  }[];
  localContext: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const CURATED_LOCAL_SERVICES: Record<string, CuratedLocalService> = {
  "baghpat/website-development": {
    locationSlug: "baghpat",
    locationName: "Baghpat",
    serviceSlug: "website-development",
    serviceName: "Website Development",
    metaTitle: "Website Development Company in Baghpat | KASH Technology",
    metaDescription: "High-speed business website development, student admission portals, and e-commerce web applications engineered for businesses in Baghpat.",
    badge: "SERVING BUSINESSES IN BAGHPAT",
    h1Primary: "Website Development Company in",
    h1Accent: "Baghpat",
    intro: "KASH Technology builds high-performance, conversion-focused websites and web platforms for schools, coaching centers, property dealers, manufacturers, and retailers across Baghpat and Western UP. We engineer sub-second Next.js websites that rank high on Google and convert local inquiries into loyal clients.",
    deliverables: [
      {
        title: "Sub-Second Next.js Architecture",
        description: "Zero bloat, blazing fast load times on mobile 4G/5G connections across Baghpat.",
      },
      {
        title: "Localized Search Engine Optimization",
        description: "Built-in schema markup and metadata engineered to dominate local search queries in Baghpat district.",
      },
      {
        title: "WhatsApp & Mobile Call Conversion",
        description: "Frictionless click-to-WhatsApp inquiry triggers and contact forms routed directly to business owners.",
      },
      {
        title: "Mobile-First Responsive Layouts",
        description: "Flawless rendering across budget smartphones, tablets, and desktop computers.",
      },
    ],
    localContext: [
      {
        title: "Educational & Coaching Portals",
        description: "Digital prospectus, online student fee collection, and admission inquiry forms for Baghpat academies.",
      },
      {
        title: "Wholesale & Trader Showcases",
        description: "Digital product catalogs enabling Mandi distributors and traders to showcase products to out-of-town buyers.",
      },
      {
        title: "Property & Plot Listing Sites",
        description: "Modern web platforms for local property dealers to display plots, layouts, and legal approvals.",
      },
    ],
    faqs: [
      {
        question: "How long does it take to launch a business website in Baghpat?",
        answer: "Most custom business websites are designed, developed, tested, and launched in production within 2 to 3 weeks.",
      },
      {
        question: "Can our website accept online UPI and card payments?",
        answer: "Yes. We integrate secure Indian payment gateways including Razorpay and Cashfree, supporting instant UPI, QR codes, debit cards, and net banking.",
      },
    ],
  },

  "noida/custom-software-development": {
    locationSlug: "noida",
    locationName: "Noida",
    serviceSlug: "custom-software-development",
    serviceName: "Custom Software Development",
    metaTitle: "Custom Software Development Company in Noida | KASH Technology",
    metaDescription: "Enterprise custom software development, multi-tenant SaaS engineering, and workflow automation for startups and enterprises in Noida.",
    badge: "SERVING BUSINESSES IN NOIDA",
    h1Primary: "Custom Software Development for Businesses in",
    h1Accent: "Noida",
    intro: "KASH Technology partners directly with high-growth startups, B2B tech firms, and established corporate enterprises across Noida. We design, architect, and ship bespoke cloud backends, multi-tenant SaaS platforms, API microservices, and automated internal tools built for high transaction volume.",
    deliverables: [
      {
        title: "Multi-Tenant SaaS Engineering",
        description: "Isolated tenant databases, role-based permission policies, and subscription billing systems.",
      },
      {
        title: "High-Throughput Microservice APIs",
        description: "Event-driven distributed architectures built with TypeScript, Node.js, Python, and PostgreSQL.",
      },
      {
        title: "Direct Senior Developer Collaboration",
        description: "No account manager layers. Partner directly with technical architects who write your production code.",
      },
      {
        title: "Enterprise Security & Audit Logging",
        description: "End-to-end cryptographic data encryption, SOC2-aligned access policies, and audit logging.",
      },
    ],
    localContext: [
      {
        title: "B2B SaaS & Tech Startups in Sectors 62 & 135",
        description: "Rapid MVP prototyping and enterprise scaling for venture-backed and bootstrapped ventures.",
      },
      {
        title: "Fintech & Automated Transaction Routing",
        description: "Sub-second ledger synchronization, biometric security, and banking API integrations.",
      },
      {
        title: "Corporate Process Automation",
        description: "Replacing disconnected legacy software with custom unified workflow systems.",
      },
    ],
    faqs: [
      {
        question: "How do you manage sprint development with Noida tech teams?",
        answer: "We integrate directly into your sprint cycles with weekly staging releases, daily Slack/video syncs, and full Git repository access.",
      },
      {
        question: "Do you build software that can handle large user spikes?",
        answer: "Yes. We engineer serverless and containerized systems deployed on AWS and Vercel edge infrastructure that scale dynamically with user traffic.",
      },
    ],
  },

  "meerut/erp-development": {
    locationSlug: "meerut",
    locationName: "Meerut",
    serviceSlug: "erp-development",
    serviceName: "ERP Development",
    metaTitle: "Custom ERP Development Company in Meerut | KASH Technology",
    metaDescription: "Bespoke ERP development for manufacturers, sports goods exporters, healthcare clinics, and distributors in Meerut.",
    badge: "SERVING ENTERPRISES IN MEERUT",
    h1Primary: "Custom ERP Systems Development in",
    h1Accent: "Meerut",
    intro: "KASH Technology engineers custom enterprise resource planning (ERP) suites for Meerut's industrial manufacturers, sports goods exporters, foundries, and hospital networks. We replace rigid off-the-shelf software with bespoke systems that adapt to your exact bill of materials, job work stages, and dispatch workflows.",
    deliverables: [
      {
        title: "Custom Manufacturing & Job Card Workflows",
        description: "Track raw materials, machine downtime, outsourced job work, and finished inventory stages.",
      },
      {
        title: "GST Invoicing & Multi-Godown Stock",
        description: "Real-time stock reconciliation across factories and distribution warehouses with automated GST e-way bills.",
      },
      {
        title: "Role-Based Access for Shop Floor & Accounts",
        description: "Granular permissions ensuring workers on the factory floor see only their production queues while accounts manage financials.",
      },
      {
        title: "Cloud-Native Multi-Device Access",
        description: "Access real-time reports, purchase approvals, and cash flow numbers from mobile phones or desktops.",
      },
    ],
    localContext: [
      {
        title: "Sports Goods & Equipment Exporters",
        description: "Production batch tracking, international packaging manifests, and foreign currency billing.",
      },
      {
        title: "Industrial Scissors & Metallurgy Foundries",
        description: "Heat-treatment stage tracking, scrap reconciliation, and vendor consignment management.",
      },
      {
        title: "Private Hospitals & Multi-Specialty Clinics",
        description: "Patient registration, digital pharmacy inventory, and automated doctor fee distribution.",
      },
    ],
    faqs: [
      {
        question: "Why choose custom ERP development over generic commercial software?",
        answer: "Generic ERPs charge recurring license fees and require expensive customizations to match Indian industrial workflows. A custom ERP from KASH Technology is designed around your exact manufacturing steps and remains your proprietary asset.",
      },
      {
        question: "Can our factory workers use the ERP on basic mobile tablets?",
        answer: "Yes. We design high-contrast, simple mobile interfaces specifically tested for shop-floor operators with minimal digital training.",
      },
    ],
  },
};
