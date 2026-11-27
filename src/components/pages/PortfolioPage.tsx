"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StudioButton } from "@/components/public-ui";
import { APPROVED_PROJECTS, type Project } from "@/data/approved-projects";

const FILTERS = [
  "All Projects",
  "Software / SaaS",
  "Websites",
  "Mobile Apps",
  "ERP / CRM",
];

export function PortfolioPage({ projects: PROJECTS = APPROVED_PROJECTS }: { projects?: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filteredProjects = activeFilter === "All Projects"
    ? PROJECTS
    : PROJECTS.filter((p) => p.tag === activeFilter || p.category.includes(activeFilter));

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-20">
      
      {/* ============================================================== */}
      {/* 1. PORTFOLIO HERO                                              */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E8E5E2] bg-white">
        <Container>
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E9] border border-[#FF5A00]/25 text-[#FF5A00] text-xs font-bold font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
              <span>Selected Work & Systems</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold tracking-tight leading-[1.1] text-[#0B0B0F]">
              Engineering digital products that solve operational bottlenecks.
            </h1>

            <p className="text-lg text-[#4B5563] max-w-2xl leading-relaxed">
              Explore our verified case studies and production platforms engineered for growing startups, regional enterprises, and healthcare providers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <StudioButton href="/contact" size="md" variant="primary">
                Start a Similar Project
              </StudioButton>
              <StudioButton href="/contact?type=audit" size="md" variant="secondary">
                Request Architecture Review
              </StudioButton>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. FILTER STRIP                                                */}
      {/* ============================================================== */}
      <section className="py-6 bg-[#FFF9F4] border-b border-[#E8E5E2] sticky top-[73px] z-30 backdrop-blur-md bg-[#FFF9F4]/90">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0B0B0F] text-white shadow-xs"
                      : "bg-white text-[#4B5563] border border-[#E8E5E2] hover:border-[#FF5A00] hover:text-[#FF5A00]"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 3. CASE STUDY DIRECTORY                                        */}
      {/* ============================================================== */}
      <section className="py-16 lg:py-24 bg-[#FFF9F4]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {filteredProjects.map((p, idx) => (
              <article
                key={p.title}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-[#E8E5E2] overflow-hidden shadow-xs hover:border-[#FF5A00]/50 hover:shadow-xl transition-all duration-300"
              >
                <Link href={p.href} className="block relative aspect-16/10 bg-stone-100 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-stone-200 text-xs font-mono font-bold text-[#0B0B0F]">
                    {p.category}
                  </div>
                </Link>

                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-stone-400">
                        0{idx + 1} • {p.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                      {p.title}
                    </h3>

                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E5E2] flex items-center justify-between">
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A00] group-hover:underline"
                    >
                      <span>Explore Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 4. CONVERSION BOTTOM BANNER                                    */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#0B0B0F] text-white">
        <Container className="max-w-4xl text-center space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A00] uppercase block">
            Custom Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need custom software or an end-to-end digital platform?
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto leading-relaxed">
            Let&apos;s evaluate your current architecture, map out database requirements, and establish realistic deployment milestones.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <StudioButton href="/contact" size="md" variant="primary">
              Talk About Your Project &rarr;
            </StudioButton>
            <StudioButton href="/services" size="md" variant="outline">
              Review All Capabilities
            </StudioButton>
          </div>
        </Container>
      </section>

    </div>
  );
}
