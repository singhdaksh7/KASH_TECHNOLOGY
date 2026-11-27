"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CapabilityShowcaseInteractive() {
  const [activeCategory, setActiveCategory] = useState<"build" | "create" | "grow">("build");

  const CATEGORIES = {
    build: {
      key: "build",
      title: "BUILD",
      subtitle: "Engineering & Architecture",
      headline: "Scalable web platforms, custom ERPs, and resilient software systems.",
      description: "We architect mission-critical digital products using modern stacks (Next.js 16, PostgreSQL, Node.js, Docker). Zero bloat, sub-second load times, and clean type-safe architecture.",
      accent: "#FF5A00",
      services: [
        { label: "Website Development", href: "/website-development", desc: "High-speed marketing sites & web portals with 95+ Core Web Vitals" },
        { label: "Custom Software & Systems", href: "/custom-software-development", desc: "Automate complex business logic and eliminate manual spreadsheets" },
        { label: "ERP & Operational CRM", href: "/custom-software-development", desc: "End-to-end billing, shift settlement, and inventory reconciliation" },
        { label: "Mobile App Development", href: "/mobile-app-development", desc: "Cross-platform iOS & Android apps with offline-first synchronization" },
        { label: "SaaS Platform Engineering", href: "/custom-software-development", desc: "Multi-tenant platforms with subscription infrastructure and role safety" },
        { label: "AI & Workflow Automation", href: "/custom-software-development", desc: "Autonomous document parsers, LLM agents, and webhook pipelines" },
      ],
      previewStats: [
        { label: "Architecture", val: "Next.js 16 App Router" },
        { label: "Database", val: "PostgreSQL & Prisma" },
        { label: "Container", val: "Docker on Cloud Edge" },
      ]
    },
    create: {
      key: "create",
      title: "CREATE",
      subtitle: "Brand Systems & Media",
      headline: "Visual identities, typography, and video that command authority.",
      description: "Transform your company from a commoditized vendor into an authoritative market leader with editorial brand systems, high-retention commercial video editing, and modern UX design.",
      accent: "#FF8A3D",
      services: [
        { label: "Brand Identity & Systems", href: "/branding", desc: "Comprehensive guidelines, logo suites, typography & color architecture" },
        { label: "Commercial Video & Motion", href: "/content-creation", desc: "Studio-grade reels, product walkthroughs, and YouTube commercial edits" },
        { label: "Content & Copywriting", href: "/content-creation", desc: "High-conversion product copy, landing page messaging & editorial stories" },
        { label: "UI/UX & Design Systems", href: "/website-development", desc: "Framer-grade design fidelity, component libraries & interactive flows" },
      ],
      previewStats: [
        { label: "Resolution", val: "4K UHD Mastered" },
        { label: "Motion", val: "60 FPS Fluid Render" },
        { label: "Assets", val: "Vector SVG & Guidelines" },
      ]
    },
    grow: {
      key: "grow",
      title: "GROW",
      subtitle: "Acquisition & Performance",
      headline: "Targeted customer acquisition pipelines that deliver measurable ROI.",
      description: "Drive qualified commercial inquiries through structured technical SEO, authoritative organic content, and disciplined paid acquisition funnels on Google and Meta.",
      accent: "#FF5A00",
      services: [
        { label: "Technical SEO & Search Dominance", href: "/seo-services", desc: "High-intent commercial keyword rankings across Delhi NCR and India" },
        { label: "Performance Paid Funnels", href: "/lead-generation", desc: "Targeted Google & Meta ad campaigns with high-converting custom pages" },
        { label: "Social Media & Community", href: "/social-media-management", desc: "Consistent brand publishing and engagement that builds trust" },
        { label: "Conversion Rate Optimization", href: "/contact", desc: "A/B testing, heatmap analytics, and funnel leak remediation" },
      ],
      previewStats: [
        { label: "Search Index", val: "Clean Schema Markup" },
        { label: "Ad Telemetry", val: "Direct CRM Routing" },
        { label: "Lead Response", val: "< 24hr Pipeline SLAs" },
      ]
    }
  };

  const active = CATEGORIES[activeCategory];

  return (
    <section className="py-24 bg-white border-y border-[#E8E5E2] overflow-hidden">
      <Container>
        {/* Header with Category Toggle Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A00] uppercase">
              CAPABILITY ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B0B0F] tracking-tight">
              Integrated across the entire digital lifecycle.
            </h2>
            <p className="text-base text-[#4B5563] leading-relaxed">
              We eliminate the friction of managing separate dev shops, freelance designers, and ad agencies. Everything operates cohesively under one roof.
            </p>
          </div>

          {/* Interactive Category Switcher (Real buttons, accessible controls) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] w-fit">
            <button
              type="button"
              onClick={() => setActiveCategory("build")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                activeCategory === "build"
                  ? "bg-[#0B0B0F] text-white shadow-md"
                  : "text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              01. BUILD
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("create")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                activeCategory === "create"
                  ? "bg-[#0B0B0F] text-white shadow-md"
                  : "text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              02. CREATE
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("grow")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                activeCategory === "grow"
                  ? "bg-[#0B0B0F] text-white shadow-md"
                  : "text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              03. GROW
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Narrative & Service Links (7 cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between p-8 rounded-3xl bg-[#FFF9F4] border border-[#E8E5E2]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00]" />
                <span className="text-xs font-mono font-bold text-[#FF5A00] tracking-wider uppercase">
                  {active.subtitle}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0B0F] tracking-tight">
                {active.headline}
              </h3>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                {active.description}
              </p>
            </div>

            {/* Service Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E5E2]">
              {active.services.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="p-4 rounded-2xl bg-white border border-[#E8E5E2] hover:border-[#FF5A00]/50 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors flex items-center justify-between">
                      <span>{s.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF5A00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-[#4B5563] leading-relaxed">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Visual Architecture & Telemetry (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#0B0B0F] text-white flex flex-col justify-between space-y-8 border border-white/10 shadow-xl">
            <div className="space-y-4">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                ENGINEERING TELEMETRY &bull; {active.title}
              </span>
              <div className="text-2xl font-bold font-mono text-[#FF8A3D]">
                Verified Production Standards
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Every deliverable passes strict technical audits before deployment: type safety, automated tests, responsive viewport checks, and zero third-party tracking bloat.
              </p>
            </div>

            {/* Spec Stats */}
            <div className="space-y-3">
              {active.previewStats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs font-mono">
                  <span className="text-stone-400">{stat.label}</span>
                  <span className="font-bold text-white">{stat.val}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white font-bold text-xs font-mono uppercase tracking-wider hover:brightness-105 transition-all shadow-md"
              >
                <span>Initiate {active.title} Engagement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
