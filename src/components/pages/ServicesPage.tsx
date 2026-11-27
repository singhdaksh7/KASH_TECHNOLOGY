"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Terminal, 
  Palette, 
  TrendingUp, 
  Check
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading, StudioButton } from "@/components/public-ui";

const BUILD_SERVICES = [
  {
    title: "Website & Web Application Development",
    slug: "/website-development",
    description: "High-performance marketing platforms, custom portals, and web applications built on Next.js 16, React, and Tailwind CSS. Sub-second load times and 95+ Core Web Vitals.",
    features: ["Next.js App Router & Server Components", "Responsive UX & Motion Design", "CMS & Headless Integrations", "SEO & Speed Optimization"],
  },
  {
    title: "Custom Software & Systems Engineering",
    slug: "/custom-software-development",
    description: "Bespoke digital engines tailored to automate your exact business processes, eliminate data duplication, and streamline team workflows.",
    features: ["Role-Based Access & Audit Logging", "Microservices & Distributed APIs", "PostgreSQL & Database Architecture", "Cloud Docker Deployment"],
  },
  {
    title: "Mobile App Development",
    slug: "/mobile-app-development",
    description: "Native and cross-platform iOS and Android applications built with React Native and modern mobile frameworks for smooth, responsive user experiences.",
    features: ["Cross-Platform Codebase", "Offline-First Sync Architecture", "Native Device APIs & Push Notifications", "App Store & Play Store Compliance"],
  },
  {
    title: "ERP & Operational CRM Systems",
    slug: "/custom-software-development",
    description: "Unified business management systems covering billing, inventory management, customer communications, automated pipelines, and managerial analytics.",
    features: ["Automated Financial Invoicing", "Real-Time Inventory Reconciliation", "Lead Funnel & Pipeline Automation", "Executive Performance Dashboards"],
  },
  {
    title: "SaaS Platform Engineering",
    slug: "/custom-software-development",
    description: "End-to-end multi-tenant SaaS architecture including subscription billing, role-based organizations, usage quotas, and developer API integrations.",
    features: ["Multi-Tenant Data Isolation", "Stripe & Payment Gateway Workflows", "Customer Onboarding & Email Triggers", "Scalable Cloud Infrastructure"],
  },
  {
    title: "AI, Workflows & Automation",
    slug: "/custom-software-development",
    description: "Practical AI integration, LLM agent workflows, automated document processing, and background schedulers to reduce manual team overhead.",
    features: ["Custom AI Agent Workflows", "Document & Invoice OCR Parsing", "Automated Webhooks & Integrations", "Intelligent Customer Bots"],
  },
];

const CREATE_SERVICES = [
  {
    title: "Brand Identity & Design Systems",
    slug: "/branding",
    description: "Strategic visual identities that establish premium authority. Complete brand typography, palettes, logo design, guidelines, and market positioning.",
    features: ["Comprehensive Brand Guidelines", "Logo Suites & Vector Assets", "Typography & Color Architecture", "Print & Collateral Templates"],
  },
  {
    title: "Commercial Video & Motion Graphics",
    slug: "/content-creation",
    description: "High-retention commercial video editing, motion design, product demos, and brand stories engineered for customer engagement across YouTube, Meta, and websites.",
    features: ["Color Grading & Sound Mastering", "2D/3D Motion Graphics & Intros", "Product Demo & SaaS Explainers", "Vertical Short-Form (Reels/Shorts)"],
  },
  {
    title: "Content Creation & Creative Production",
    slug: "/content-creation",
    description: "High-impact digital marketing assets, ad creatives, editorial graphics, and social content crafted to capture attention and communicate value.",
    features: ["Ad Creative Suites (Static & Motion)", "Social Content Roadmaps", "Copywriting & Storytelling", "High-Resolution Render Assets"],
  },
];

const GROW_SERVICES = [
  {
    title: "Technical SEO & Search Dominance",
    slug: "/seo-services",
    description: "Data-driven search engine optimization. Technical architecture audits, high-intent keyword strategies, clean schema markup, and authoritative ranking growth.",
    features: ["Core Web Vitals Optimization", "Structured Data & Rich Snippets", "High-Intent Keyword Targeting", "Continuous Ranking & Health Audits"],
  },
  {
    title: "Social Media & Community Management",
    slug: "/social-media-management",
    description: "Strategic organic social media management that positions your brand as an industry leader through consistent, high-value publishing.",
    features: ["Monthly Content Calendars", "Community Engagement & Outreach", "Analytics & Growth Telemetry", "Cross-Platform Brand Consistency"],
  },
  {
    title: "Performance Ads & High-Intent Funnels",
    slug: "/lead-generation",
    description: "Targeted Meta and Google ad campaigns combined with high-converting custom landing pages designed to generate qualified business leads.",
    features: ["Targeted Audience Segmentation", "High-Conversion Landing Pages", "Real-Time Lead CRM Routing", "ROAS & Cost-Per-Acquisition Tracking"],
  },
];

export function ServicesPage() {
  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        <Container>
          <div className="max-w-4xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-semibold">
              CAPABILITIES &amp; SOLUTIONS // KASH STUDIO
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#0B0B0F] leading-[1.08]">
              Comprehensive capabilities for <span className="text-[#FF5A00]">modern businesses.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#4B5563] leading-relaxed max-w-2xl font-normal">
              From enterprise software engineering and high-speed web apps to cinematic brand content and performance acquisition funnels — all delivered by one multidisciplinary team.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <StudioButton href="/contact" variant="primary">
                Request a Project Proposal
              </StudioButton>
              <StudioButton href="/portfolio" variant="outline">
                View Proven Case Studies
              </StudioButton>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. PILLAR 01: BUILD */}
      <section id="build" className="py-24 bg-white border-y border-[#E8E5E2]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                <Terminal className="w-4 h-4" />
                <span>PILLAR 01 // SOFTWARE &amp; SYSTEMS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B0B0F] tracking-tight">
                BUILD. Robust Engineering.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-md">
              We design and ship mission-critical software architectures using production-tested stacks like Next.js, Node.js, PostgreSQL, Docker, and Redis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BUILD_SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-[#FFF9F4] rounded-3xl border border-[#E8E5E2] p-8 flex flex-col justify-between hover:border-[#FF5A00]/50 transition-all group"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {s.description}
                  </p>
                  <ul className="space-y-2 pt-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-[#0B0B0F] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E8E5E2]/80">
                  <Link
                    href={s.slug}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A00] hover:text-[#0B0B0F] transition-colors"
                  >
                    <span>View Service Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. PILLAR 02: CREATE */}
      <section id="create" className="py-24 bg-[#FFF9F4]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                <Palette className="w-4 h-4" />
                <span>PILLAR 02 // VISUAL IDENTITY &amp; MEDIA</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B0B0F] tracking-tight">
                CREATE. Distinct Visual Authority.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-md">
              Elevate your market perception with cohesive brand systems, editorial visual design, and commercial video production that converts attention into trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CREATE_SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-3xl border border-[#E8E5E2] p-8 flex flex-col justify-between hover:border-[#FF5A00]/50 transition-all group"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {s.description}
                  </p>
                  <ul className="space-y-2 pt-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-[#0B0B0F] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E8E5E2]/80">
                  <Link
                    href={s.slug}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A00] hover:text-[#0B0B0F] transition-colors"
                  >
                    <span>View Service Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. PILLAR 03: GROW */}
      <section id="grow" className="py-24 bg-white border-y border-[#E8E5E2]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>PILLAR 03 // ACQUISITION &amp; SEARCH</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B0B0F] tracking-tight">
                GROW. Predictable Growth.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-md">
              Attract high-intent buyers through precision technical SEO, authoritative social content, and disciplined paid advertising campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GROW_SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-[#FFF9F4] rounded-3xl border border-[#E8E5E2] p-8 flex flex-col justify-between hover:border-[#FF5A00]/50 transition-all group"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {s.description}
                  </p>
                  <ul className="space-y-2 pt-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-[#0B0B0F] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E8E5E2]/80">
                  <Link
                    href={s.slug}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A00] hover:text-[#0B0B0F] transition-colors"
                  >
                    <span>View Service Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. 5-STEP DELIVERY FRAMEWORK */}
      <section className="py-24 bg-[#FFF9F4]">
        <Container>
          <div className="max-w-2xl mb-16">
            <SectionHeading
              eyebrow="EXECUTION PROTOCOL"
              title="How we deliver from conception to scale."
              description="A transparent, agile workflow designed to eliminate scope creep and maintain velocity."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "01", name: "Discover", desc: "Deep architectural inquiry into your operational requirements, bottlenecks, and user profiles." },
              { step: "02", name: "Specify", desc: "Detailed technical specifications, wireframes, database schemas, and milestone deliverables." },
              { step: "03", name: "Engineer", desc: "Agile sprints, rigorous type checking, clean design systems, and weekly staging deployments." },
              { step: "04", name: "Deploy", desc: "Zero-downtime Docker container deployment, automated database migrations, and telemetry setup." },
              { step: "05", name: "Grow", desc: "Continuous performance audits, SEO tracking, feature additions, and proactive support." },
            ].map((p) => (
              <div key={p.step} className="p-6 rounded-2xl bg-white border border-[#E8E5E2] space-y-3">
                <div className="font-mono text-2xl font-black text-[#FF5A00]">{p.step}</div>
                <h3 className="text-base font-bold text-[#0B0B0F]">{p.name}</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. CONVERSION SECTION */}
      <section className="py-20 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Let&apos;s architect your next advantage.
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal">
              Tell us what you want to build. We provide direct technical evaluations, realistic timelines, and transparent estimates within 24 hours.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-[#0B0B0F] text-white font-bold text-sm hover:bg-black transition-all shadow-xl inline-flex items-center gap-2"
              >
                <span>Request Detailed Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl bg-white text-[#0B0B0F] font-bold text-sm hover:bg-[#FFF3E9] transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Explore Case Studies</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
