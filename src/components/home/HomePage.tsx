"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Cpu, Terminal, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading, StudioButton, CaseStudyRow } from "@/components/public-ui";

export function HomePage() {
  const PILLARS = [
    {
      key: "BUILD",
      title: "Engineering & Software",
      tagline: "High-performance digital products engineered to scale without friction.",
      icon: Code2,
      accent: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-600",
      capabilities: [
        { label: "Website Development", href: "/website-development", desc: "Sub-second Next.js platforms with 95+ Core Web Vitals" },
        { label: "Custom Software & CRM", href: "/custom-software-development", desc: "Automate manual spreadsheets and business bottlenecks" },
        { label: "Mobile App Development", href: "/mobile-app-development", desc: "High-retention iOS & Android applications" },
        { label: "ERP / CRM Systems", href: "/erp-development", desc: "Unified operational pipelines for retail, fuel, and manufacturing" },
        { label: "SaaS Development", href: "/saas-development", desc: "Multi-tenant platforms with subscription infrastructure" },
        { label: "AI & Automation", href: "/ai-automation", desc: "LLM agents, internal search & autonomous data pipelines" },
      ],
    },
    {
      key: "CREATE",
      title: "Content & Creative Studio",
      tagline: "Narratives, video production, and visual identities that command authority.",
      icon: Sparkles,
      accent: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-600",
      capabilities: [
        { label: "Content Creation", href: "/content-creation", desc: "Long-form editorial thought leadership & high-conversion copy" },
        { label: "Video Editing & Motion", href: "/video-editing", desc: "Studio-grade reels, product walkthroughs & explainers" },
        { label: "Branding & Visual Identity", href: "/branding", desc: "Cohesive logos, typographic systems & digital design languages" },
      ],
    },
    {
      key: "GROW",
      title: "Growth & Performance",
      tagline: "Data-backed acquisition pipelines that turn visitors into verified business pipeline.",
      icon: TrendingUp,
      accent: "from-[#FF5A00]/10 to-transparent border-[#FF5A00]/20 text-[#FF5A00]",
      capabilities: [
        { label: "Digital Marketing", href: "/digital-marketing", desc: "Targeted Meta & Google acquisition funnels engineered for ROI" },
        { label: "Social Media Management", href: "/social-media-management", desc: "Consistent brand narrative & multi-channel distribution" },
        { label: "SEO & Regional Search", href: "/seo-services", desc: "Dominating high-intent commercial keywords in Delhi NCR & beyond" },
      ],
    },
  ];

  const FEATURED_STUDIES = [
    {
      number: "01",
      title: "FuelOps Enterprise",
      category: "ERP & Operations",
      tagline: "Real-time pump sales, automated settlements, and fuel station logistics.",
      challenge: "Managing multi-station fuel dealerships with paper ledgers and disconnected spreadsheets created daily inventory reconciliation errors and slow audit cycles.",
      solution: "Engineered a centralized web and mobile ERP with shift-level nozzle metering, digital credit reconciliation, and automated daily bank deposit telemetry.",
      capabilities: ["Custom ERP", "Next.js Architecture", "Shift Settlement", "PostgreSQL"],
      image: "/images/projects/fuelops-mockup.png",
      href: "/contact",
    },
    {
      number: "02",
      title: "Launchpad X Protocol",
      category: "Web3 & Financial Tech",
      tagline: "Decentralized token launch architecture and audit-grade smart contract UI.",
      challenge: "High-traffic token presales experience extreme concurrency spikes and malicious bots that compromise fairness and interface uptime.",
      solution: "Architected a server-rendered real-time token claim interface backed by resilient edge caching, Web3 wallet adapters, and cryptographic proof verification.",
      capabilities: ["Web3 Architecture", "Sub-second Edge", "Smart Contract UI", "High Concurrency"],
      image: "/images/projects/launchpad-mockup.png",
      href: "/work/crypto-launchpad",
      reverse: true,
    },
    {
      number: "03",
      title: "SchoolSync Platform",
      category: "Education & SaaS",
      tagline: "Comprehensive student admissions, automated fee invoicing, and attendance.",
      challenge: "Independent educational institutions struggled with fragmented software across fee counters, teacher diaries, and parent communication channels.",
      solution: "Delivered a unified SaaS workspace combining student lifecycles, automated WhatsApp/SMS fee alerts, and class performance analytics.",
      capabilities: ["Multi-Tenant SaaS", "Role-Based Access", "Fee Invoicing", "Mobile PWA"],
      image: "/images/projects/schoolsync-mockup.png",
      href: "/work/schoolsync",
    },
    {
      number: "04",
      title: "TaxiSegrator Network",
      category: "Logistics & Marketplace",
      tagline: "Intercity fleet allocation and driver dispatch marketplace for travel operators.",
      challenge: "B2B taxi dispatchers required seamless peer-to-peer route allocation without phone call bottlenecks and disputed margin calculations.",
      solution: "Built a responsive dispatcher application with instant trip bidding, driver verification, and transparent trip settlement records.",
      capabilities: ["Marketplace Logic", "Mobile Experience", "Driver Verification", "Instant Bidding"],
      image: "/images/projects/taxisegrator-mockup.png",
      href: "/contact",
      reverse: true,
    },
  ];

  const PROCESS_STEPS = [
    {
      step: "01",
      title: "Discover & Scope",
      desc: "We analyze your commercial model, customer touchpoints, and technical requirements before writing a single line of code.",
    },
    {
      step: "02",
      title: "Design & Prototype",
      desc: "Interactive wireframes and high-fidelity design systems establish exact UX flows, visual hierarchy, and brand positioning.",
    },
    {
      step: "03",
      title: "Engineer & Build",
      desc: "Robust Next.js, Node.js, and relational database systems built with clean architecture, strict security, and comprehensive test coverage.",
    },
    {
      step: "04",
      title: "Deploy & Scale",
      desc: "Production deployments on hardened cloud infrastructure with monitoring, automated backups, and 95+ Core Web Vitals.",
    },
    {
      step: "05",
      title: "Grow & Distribute",
      desc: "We stay as your digital partner — managing SEO authority, targeted acquisition funnels, and ongoing feature iterations.",
    },
  ];

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-20">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION: CONFIDENT, VISUAL, EDITORIAL                  */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E9] border border-[#FF5A00]/25 text-[#FF5A00] text-xs font-bold font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Technology • Creative • Growth Studio</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight leading-[1.08] text-[#0B0B0F]">
              BUILD. CREATE. GROW.<br />
              <span className="text-[#FF5A00]">We build digital products</span> that move businesses forward.
            </h1>

            <p className="text-lg sm:text-xl text-[#4B5563] max-w-2xl leading-relaxed font-normal">
              KASH Technology is an integrated studio combining custom software engineering, premium creative content, and performance acquisition under one roof.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <StudioButton href="/contact" size="lg" variant="primary">
                Start a Project
              </StudioButton>
              <StudioButton href="/portfolio" size="lg" variant="secondary">
                View Our Work
              </StudioButton>
            </div>
          </div>

          {/* Hero Showcase Composition */}
          <div className="mt-14 lg:mt-20 relative">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero/hero-laptop-composition.png"
                alt="KASH Technology Digital Systems and Engineering Showcase"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle Real Stat Bar */}
              <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center justify-between p-4 px-6 rounded-2xl bg-[#0B0B0F]/85 backdrop-blur-md border border-white/10 text-white">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-mono text-stone-300">
                    Production Stack: Next.js 16 · PostgreSQL · Docker · Cloud Edge
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono">
                  <span className="text-stone-300">Core Web Vitals: <b className="text-emerald-400 font-bold">95+</b></span>
                  <span className="text-stone-300">Uptime: <b className="text-emerald-400 font-bold">99.9%</b></span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. CAPABILITY ARCHITECTURE: BUILD / CREATE / GROW              */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#E8E5E2]">
        <Container>
          <SectionHeading
            eyebrow="Primary Capabilities"
            title="Everything your business needs to scale online, under one roof."
            description="We eliminate the cost and confusion of juggling separate software agencies, freelance designers, and ad consultants."
            className="mb-14 lg:mb-20"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.key}
                  className="rounded-2xl p-8 bg-[#FFF9F4] border border-[#E8E5E2] space-y-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-[#E8E5E2]">
                      <span className="font-mono text-xs font-bold tracking-widest text-[#FF5A00] uppercase">
                        {pillar.key}
                      </span>
                      <Icon className="w-5 h-5 text-[#FF5A00]" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#0B0B0F]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      {pillar.tagline}
                    </p>

                    <div className="pt-2 space-y-2.5">
                      {pillar.capabilities.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group block p-3 rounded-xl bg-white border border-[#E8E5E2] hover:border-[#FF5A00] transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                              {item.label}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#FF5A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </div>
                          <p className="text-[11px] text-[#4B5563] mt-1 leading-normal">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E5E2]">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A00] hover:text-[#FF8A3D] transition-colors"
                    >
                      <span>Explore {pillar.key} Solutions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 3. PREMIUM DARK SHOWCASE: FEATURED CASE STUDIES               */}
      {/* ============================================================== */}
      <section className="py-24 lg:py-32 bg-[#0B0B0F] text-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
            <SectionHeading
              theme="dark"
              eyebrow="Selected Work"
              title="Real software and systems built for real operations."
              description="Explore how we design and deploy scalable digital solutions across diverse industries."
            />
            <StudioButton href="/portfolio" variant="outline" size="md">
              View All Work &rarr;
            </StudioButton>
          </div>

          <div className="space-y-4">
            {FEATURED_STUDIES.map((study) => (
              <CaseStudyRow
                key={study.title}
                number={study.number}
                title={study.title}
                category={study.category}
                tagline={study.tagline}
                challenge={study.challenge}
                solution={study.solution}
                capabilities={study.capabilities}
                image={study.image}
                href={study.href}
                reverse={study.reverse}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 4. PROCESS: FIVE STEP DELIVERY BLUEPRINT                       */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#E8E5E2]">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Delivery Framework"
            title="A structured, predictable delivery process."
            description="From initial architectural scoping to post-launch growth, our iterative approach guarantees velocity and reliability."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-3 relative group hover:border-[#FF5A00] transition-colors"
              >
                <span className="font-mono text-2xl font-black text-[#FF5A00]/40 group-hover:text-[#FF5A00] transition-colors">
                  {step.step}
                </span>
                <h4 className="text-base font-bold text-[#0B0B0F]">
                  {step.title}
                </h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 5. EDITORIAL ABOUT PREVIEW: ONE INTEGRATED TEAM                */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 bg-[#FFF9F4]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase font-mono px-3 py-1 rounded-full bg-[#FFF3E9] text-[#FF5A00] border border-[#FF5A00]/20">
                <span>The Studio Philosophy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B0B0F] leading-[1.14]">
                Engineering rigor meets creative storytelling.
              </h2>

              <p className="text-base text-[#4B5563] leading-relaxed">
                Most agencies give you one half of the equation: pure coders who do not understand aesthetics and conversion, or creative artists who cannot architect high-scale databases and secure APIs.
              </p>

              <p className="text-base text-[#4B5563] leading-relaxed">
                KASH Technology bridges that exact gap. We are a single, disciplined team of engineers, designers, and growth strategists delivering integrated solutions that produce measurable business outcomes.
              </p>

              <div className="pt-2">
                <StudioButton href="/about" variant="secondary" size="md">
                  Read About Our Team &rarr;
                </StudioButton>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-[#E8E5E2] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[#FF5A00]" />
                <h4 className="text-sm font-bold text-[#0B0B0F]">Direct Engineer Access</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">Communicate directly with the builders working on your codebase, with zero account manager telephone game.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#E8E5E2] space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#FF5A00]" />
                <h4 className="text-sm font-bold text-[#0B0B0F]">No Vendor Lock-In</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">Full ownership of your source code, repositories, cloud credentials, and intellectual property from day one.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#E8E5E2] space-y-2">
                <Cpu className="w-5 h-5 text-[#FF5A00]" />
                <h4 className="text-sm font-bold text-[#0B0B0F]">Modern Tech Stack</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">Next.js 16, TypeScript, PostgreSQL, and resilient edge deployments built to outlive short-term trends.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#E8E5E2] space-y-2">
                <Layers className="w-5 h-5 text-[#FF5A00]" />
                <h4 className="text-sm font-bold text-[#0B0B0F]">Regional Focus</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">Deep understanding of business dynamics across Delhi NCR, Noida, Meerut, and Western UP.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 6. HIGH-CONVERSION FINAL CALL TO ACTION                        */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#FF5A00] to-[#FF8A3D] text-white text-center">
        <Container className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/80 block">
              Start Your Project
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-tight">
              Ready to build something remarkable together?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Schedule a technical discovery call or tell us about your project goals. We respond within 24 business hours with honest scope estimates.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-[#0B0B0F] text-white text-base font-bold shadow-xl hover:bg-black transition-all"
            >
              Start Your Project &rarr;
            </Link>
            <Link
              href="/contact?type=audit"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-base font-bold transition-all"
            >
              Get a Free Digital Audit
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
