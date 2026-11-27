"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { 
  Code2, 
  Layers, 
  Workflow, 
  Bot, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { AnimatedArchitecture } from "./technology-stack/AnimatedArchitecture";

export interface StageData {
  id: string;
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  subDescription?: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
}

const STAGES: StageData[] = [
  {
    id: "engineering",
    badge: "01 // FOUNDATION",
    eyebrow: "Custom Software Engineering",
    title: "Engineering without limitations.",
    description:
      "We design and build bespoke web applications, enterprise software, cross-platform mobile products, and high-concurrency systems engineered for your exact operational requirements.",
    subDescription:
      "Built with modern type-safe standards, clean architecture, and complete code ownership. No rigid agency templates or proprietary lock-in.",
    icon: Code2,
    highlights: [
      "Full-stack Next.js 16 SSR & Edge caching",
      "Robust relational PostgreSQL architectures",
      "Native mobile parity for iOS & Android",
      "Strict sub-50ms API response standards",
    ],
  },
  {
    id: "connected",
    badge: "02 // ECOSYSTEM",
    eyebrow: "Integrated Workflows",
    title: "Connected systems. Seamless operations.",
    description:
      "Eliminate manual data transfer and fragmented spreadsheets. KASH connects your high-speed website, customer CRM, operations ERP, mobile applications, and third-party APIs into one synchronized business engine.",
    subDescription:
      "Bi-directional webhooks and automated event queues ensure every team member and customer touchpoint operates from identical, real-time data.",
    icon: Layers,
    highlights: [
      "Unified customer data across web, app & billing",
      "Instant inventory, order, and dispatch synchronization",
      "Resilient retry queues for third-party integrations",
      "Zero double-entry across departments",
    ],
  },
  {
    id: "workflow",
    badge: "03 // CUSTOM LOGIC",
    eyebrow: "Tailored Architecture",
    title: "Built around your business.",
    description:
      "Your company has unique operational nuances that off-the-shelf software cannot accommodate. We engineer flexible workflow engines, customizable rules, and modular business logic tailored to your exact workflows.",
    subDescription:
      "From multi-tier deal approvals to dynamic route dispatching, our architectures adapt directly to the way your business succeeds.",
    icon: Workflow,
    highlights: [
      "Custom business rules and multi-step triggers",
      "Role-based authorization and granular permissions",
      "Audit-trailed immutable system state logs",
      "Modular components that grow with your company",
    ],
  },
  {
    id: "ai",
    badge: "04 // INTELLIGENCE",
    eyebrow: "Adaptive AI & Workflows",
    title: "Intelligent workflows. Adaptive AI.",
    description:
      "Intelligence works best when it understands your business. KASH builds AI-enabled systems that connect your data, streamline everyday operations and help your teams make informed decisions.",
    subDescription:
      "From intelligent assistants and automated workflows to advanced reporting and contextual insights, we engineer AI solutions around the way your business actually works.",
    icon: Bot,
    highlights: [
      "Contextual business data retrieval & RAG pipelines",
      "Automated document extraction and parsing",
      "Natural language reporting across ERP & CRM data",
      "Autonomous follow-up triggers and operational triage",
    ],
  },
  {
    id: "infra",
    badge: "05 // RESILIENCE",
    eyebrow: "Hardened Security",
    title: "Secure infrastructure. Built to scale.",
    description:
      "Every product is deployed on hardened cloud infrastructure with enterprise-grade isolation, automated nightly snapshots, continuous health monitoring, and rigorous access controls.",
    subDescription:
      "We build resilient systems designed for uninterrupted operational continuity, peak concurrency spikes, and complete data integrity.",
    icon: ShieldCheck,
    highlights: [
      "TLS 1.3 edge termination & automated DDoS filtering",
      "Containerized microservices with zero-trust RBAC",
      "Automated off-site database backups with instant rollback",
      "Sub-second uptime telemetry and proactive alerting",
    ],
  },
];

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function TechnologyStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [mobileActiveStage, setMobileActiveStage] = useState(0);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Framer Motion scroll progress across the tall 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 5 stages across [0, 1]
    // 0.00 - 0.20 -> stage 0
    // 0.20 - 0.40 -> stage 1
    // 0.40 - 0.60 -> stage 2
    // 0.60 - 0.80 -> stage 3
    // 0.80 - 1.00 -> stage 4
    const index = Math.min(Math.floor(latest * 5), 4);
    if (index !== activeStage) {
      setActiveStage(index);
    }
  });

  const currentStage = STAGES[activeStage];

  return (
    <section 
      aria-label="The KASH Technology Stack"
      className="relative bg-[#07070B] text-white border-t border-white/10"
    >
      {/* Background Radial Ambient Glow & Isometric Mesh Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#FF5A00]/10 via-[#FF8A3D]/5 to-transparent blur-[120px]" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* REDUCED MOTION ALTERNATIVE: Clean stacked presentation         */}
      {/* ============================================================== */}
      {prefersReducedMotion ? (
        <div className="py-20">
          <Container>
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
                  THE KASH TECHNOLOGY STACK
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Engineering without limitations.
              </h2>
              <p className="text-stone-300 text-base leading-relaxed">
                Full-stack Next.js 16 architectures, connected business ecosystems, configurable automation workflows, adaptive AI copilot integrations, and hardened cloud infrastructure.
              </p>
            </div>

            <div className="space-y-16">
              {STAGES.map((stage, idx) => (
                <div 
                  key={stage.id}
                  className="p-8 rounded-3xl bg-[#0E0E16] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-6 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-[#FF5A00]">
                      <span>{stage.badge}</span>
                      <span>&bull;</span>
                      <span className="text-stone-300 font-normal">{stage.eyebrow}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {stage.description}
                    </p>
                    {stage.subDescription && (
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {stage.subDescription}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {stage.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                          <ChevronRight className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-6 rounded-2xl bg-[#07070B] border border-white/10 p-2 min-h-[360px] flex items-center justify-center overflow-hidden">
                    <AnimatedArchitecture
                      stageIndex={idx}
                      active={true}
                      prefersReducedMotion={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* DESKTOP LAYOUT: 450vh outer wrapper + 100vh sticky viewport   */}
          {/* ============================================================== */}
          <div 
            ref={containerRef}
            className="hidden lg:block relative"
            style={{ height: "450vh" }}
          >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          <Container className="relative z-10 w-full py-8">
            {/* Top Bar / Category Eyebrow */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
                  THE KASH TECHNOLOGY STACK
                </span>
                <span className="text-stone-400 font-mono text-xs">&bull;</span>
                <span className="text-stone-300 font-mono text-xs">
                  Enterprise-Grade System Architecture
                </span>
              </div>

              {/* Zoho-Inspired 5-Dash Progress Bar */}
              <div 
                className="flex items-center gap-2"
                role="group" 
                aria-label="Technology Stack progress indicators"
              >
                {STAGES.map((st, idx) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (!containerRef.current) return;
                      const rect = containerRef.current.getBoundingClientRect();
                      const scrollTop = window.scrollY || document.documentElement.scrollTop;
                      const targetY = scrollTop + rect.top + (rect.height / 5) * idx - 30;
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }}
                    aria-label={`Jump to stage ${idx + 1}: ${st.title}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === activeStage
                        ? "w-10 bg-[#FF5A00] shadow-[0_0_12px_#FF5A00]"
                        : "w-4 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Main Stage Grid: Left (Synchronized Copy) + Right (Visuals) */}
            <div className="grid grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Synchronized Stage Copy */}
              <div className="col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono font-bold text-[#FF5A00]">
                  <span>{currentStage.badge}</span>
                  <span>&bull;</span>
                  <span className="text-stone-300 font-normal">{currentStage.eyebrow}</span>
                </div>

                <div className="min-h-[140px]">
                  <h2 
                    key={currentStage.id + "-title"}
                    className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15] transition-all duration-700 ease-out animate-fadeIn"
                  >
                    {currentStage.title}
                  </h2>
                </div>

                <div className="min-h-[160px] space-y-4">
                  <p 
                    key={currentStage.id + "-desc"}
                    className="text-base text-stone-300 leading-relaxed font-normal transition-all duration-700 ease-out"
                  >
                    {currentStage.description}
                  </p>

                  {currentStage.subDescription && (
                    <p className="text-sm text-stone-400 leading-relaxed font-normal">
                      {currentStage.subDescription}
                    </p>
                  )}
                </div>

                {/* Highlights List */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentStage.highlights.map((item) => (
                    <div 
                      key={item} 
                      className="flex items-center gap-2 text-xs text-stone-200 font-mono"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg"
                  >
                    <span>Discuss Your Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-stone-400 font-mono">
                    Step {activeStage + 1} of 5 &bull; Scroll to explore
                  </span>
                </div>
              </div>

              {/* Right Column: Layered Interactive 3D Architecture Visual Presentation */}
              <div className="col-span-6 relative w-full h-[520px] rounded-3xl bg-gradient-to-b from-[#101018] to-[#09090F] border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
                {STAGES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-700 ease-out ${
                      activeStage === idx
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <AnimatedArchitecture
                      stageIndex={idx}
                      active={activeStage === idx}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  </div>
                ))}
              </div>

            </div>
          </Container>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE & TABLET LAYOUT (< 1024px)                              */}
      {/* Naturally stacked cards + Interactive drawer modal              */}
      {/* ============================================================== */}
      <div className="block lg:hidden py-16">
        <Container>
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
                THE KASH TECHNOLOGY STACK
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise architecture engineered for real business outcomes.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Explore how KASH combines custom software engineering, integrated ecosystems, workflow automation, adaptive AI, and hardened cloud infrastructure.
            </p>
          </div>

          {/* Mobile Tab Selectors */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {STAGES.map((st, i) => (
              <button
                key={st.id}
                onClick={() => setMobileActiveStage(i)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                  mobileActiveStage === i
                    ? "bg-[#FF5A00] text-white border-[#FF5A00] shadow-md font-bold"
                    : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {st.title.split(".")[0]}
              </button>
            ))}
          </div>

          {/* Active Mobile Stage Content & Card */}
          <div className="rounded-3xl bg-[#0E0E14] border border-white/10 p-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF5A00]">
                <span>{STAGES[mobileActiveStage].badge}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {STAGES[mobileActiveStage].title}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {STAGES[mobileActiveStage].description}
              </p>
            </div>

            {/* Mobile Visual Container */}
            <div className="relative min-h-[300px] rounded-2xl bg-[#07070B] border border-white/10 overflow-hidden flex items-center justify-center p-2">
              <AnimatedArchitecture
                stageIndex={mobileActiveStage}
                active={true}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Highlights List on Mobile */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              {STAGES[mobileActiveStage].highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Discuss This Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
        </>
      )}
    </section>
  );
}
