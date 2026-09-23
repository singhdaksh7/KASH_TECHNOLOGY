"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Smartphone, Activity, GraduationCap, Truck, Home, Stethoscope, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ALL_PORTFOLIO_PROJECTS, ProjectItem } from "@/data/portfolioData";

const CATEGORIES = [
  "All Projects",
  "Web Platforms",
  "Mobile Apps",
  "Enterprise Solutions",
  "E-commerce",
  "CRM / ERP",
  "Dashboard / Analytics",
];

function MockupIllustration({ type }: { type: ProjectItem["previewType"] }) {
  if (type === "mobile" || type === "medicare") {
    return (
      <div className="relative w-full h-full bg-[#0a0c10] flex items-center justify-center gap-2 p-3 overflow-hidden">
        {/* Left phone screen */}
        <div className="w-[28%] h-[92%] rounded-xl bg-[#161922] border border-white/10 p-1.5 flex flex-col justify-between shadow-lg">
          <div className="w-6 h-1 rounded-full bg-white/20 mx-auto mb-1" />
          <div className="space-y-1">
            <div className="w-full h-8 rounded-lg bg-[#f36b21]/20 border border-[#f36b21]/30 flex items-center justify-center">
              {type === "medicare" ? <Stethoscope className="w-3.5 h-3.5 text-[#f36b21]" /> : <Smartphone className="w-3.5 h-3.5 text-[#f36b21]" />}
            </div>
            <div className="w-3/4 h-1 rounded bg-white/20" />
            <div className="w-1/2 h-1 rounded bg-white/10" />
          </div>
          <div className="w-full h-4 rounded bg-white/5 flex items-center justify-between px-1 text-[6px] text-white/40">
            <span>Home</span>
            <span>Profile</span>
          </div>
        </div>

        {/* Center phone screen (featured) */}
        <div className="w-[34%] h-[98%] rounded-xl bg-[#1e222e] border-2 border-[#f36b21]/50 p-2 flex flex-col justify-between shadow-2xl z-10 scale-105">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <div className="w-8 h-1 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#f36b21]" />
          </div>
          <div className="space-y-1.5 my-auto">
            <div className="w-full h-12 rounded-lg bg-gradient-to-br from-[#f36b21]/30 to-[#1e222e] border border-[#f36b21]/40 flex items-center justify-center">
              <span className="text-[8px] font-mono text-white font-bold">KASH UI</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1/2 h-6 rounded bg-white/10" />
              <div className="w-1/2 h-6 rounded bg-white/10" />
            </div>
          </div>
          <div className="w-full h-3 rounded bg-[#f36b21] flex items-center justify-center text-[7px] font-bold text-white">
            EXPLORE
          </div>
        </div>

        {/* Right phone screen */}
        <div className="w-[28%] h-[92%] rounded-xl bg-[#161922] border border-white/10 p-1.5 flex flex-col justify-between shadow-lg">
          <div className="w-6 h-1 rounded-full bg-white/20 mx-auto mb-1" />
          <div className="space-y-1">
            <div className="w-full h-6 rounded bg-white/10" />
            <div className="w-full h-6 rounded bg-white/10" />
          </div>
          <div className="w-full h-2 rounded bg-white/20" />
        </div>
      </div>
    );
  }

  // Dashboard / Web App Layout
  return (
    <div className="relative w-full h-full bg-[#0a0c10] p-3 flex flex-col justify-between overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/70" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
          <span className="w-2 h-2 rounded-full bg-green-500/70" />
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-mono text-white/50 border border-white/5">
          {type === "erp" ? "FinTrack ERP Pro" : type === "health" ? "HealthPlus Care" : type === "edulearn" ? "EduLearn Portal" : type === "logistics" ? "LogiMove Fleet" : type === "realestate" ? "PropertyHub MLS" : "AgriSmart AI"}
        </div>
        <div className="w-2 h-2 rounded-full bg-[#f36b21]" />
      </div>

      {/* Main simulated dashboard widgets */}
      <div className="grid grid-cols-3 gap-2 my-auto">
        {/* Left Metric Widget */}
        <div className="rounded-lg bg-[#14161f] border border-white/10 p-2 flex flex-col justify-between h-20">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-mono text-white/40">ANALYTICS</span>
            {type === "erp" && <BarChart3 className="w-3 h-3 text-[#f36b21]" />}
            {type === "health" && <Activity className="w-3 h-3 text-[#f36b21]" />}
            {type === "edulearn" && <GraduationCap className="w-3 h-3 text-[#f36b21]" />}
            {type === "logistics" && <Truck className="w-3 h-3 text-[#f36b21]" />}
            {type === "realestate" && <Home className="w-3 h-3 text-[#f36b21]" />}
            {type === "agriculture" && <Sprout className="w-3 h-3 text-[#f36b21]" />}
          </div>
          <div className="text-[12px] font-bold text-white font-mono">+94.2%</div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="w-3/4 h-full bg-[#f36b21]" />
          </div>
        </div>

        {/* Center / Chart Widget */}
        <div className="col-span-2 rounded-lg bg-[#14161f] border border-white/10 p-2 flex flex-col justify-between h-20">
          <div className="flex justify-between text-[7px] font-mono text-white/40">
            <span>REAL-TIME STREAM</span>
            <span className="text-emerald-400">ACTIVE</span>
          </div>
          <div className="flex items-end justify-between h-10 gap-1 px-1">
            <div className="w-2 h-4 rounded-t bg-white/20" />
            <div className="w-2 h-6 rounded-t bg-white/20" />
            <div className="w-2 h-8 rounded-t bg-[#f36b21]/70" />
            <div className="w-2 h-5 rounded-t bg-white/20" />
            <div className="w-2 h-10 rounded-t bg-[#f36b21]" />
            <div className="w-2 h-7 rounded-t bg-white/20" />
            <div className="w-2 h-9 rounded-t bg-[#f36b21]" />
          </div>
          <div className="text-[7px] font-mono text-white/30 text-right">Updated 2s ago</div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[7.5px] font-mono text-white/30">
        <span>SECURITY: ENCRYPTED</span>
        <span className="text-[#f36b21]">v3.2 PROD</span>
      </div>
    </div>
  );
}

interface PortfolioGridProps {
  limit?: number;
  showFilters?: boolean;
}

export function PortfolioGrid({ limit, showFilters = true }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("All Projects");

  const filtered = ALL_PORTFOLIO_PROJECTS.filter((proj) => {
    if (activeCategory === "All Projects") return true;
    if (activeCategory === "Web Platforms") return proj.category === "Web Platforms";
    if (activeCategory === "Mobile Apps") return proj.category === "Mobile Apps";
    if (activeCategory === "Enterprise Solutions") return proj.category === "Enterprise Solutions" || proj.category === "CRM / ERP";
    if (activeCategory === "E-commerce") return proj.category === "E-commerce" || proj.tag.includes("E-commerce");
    if (activeCategory === "CRM / ERP") return proj.category === "CRM / ERP" || proj.tag.includes("ERP") || proj.tag.includes("CRM");
    if (activeCategory === "Dashboard / Analytics") return proj.category === "Dashboard / Analytics" || proj.tag.includes("Analytics") || proj.tag.includes("Dashboard");
    return proj.category === activeCategory;
  });

  const displayItems = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
      <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

      <Container className="relative z-10">
        {/* Filter Tabs */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#f36b21] text-white shadow-[0_4px_12px_rgba(243,107,33,0.35)]"
                      : "bg-white text-[#6b7280] border border-black/5 hover:border-[#f36b21]/40 hover:text-[#111827]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects 4-column / 3-column Grid */}
        <div 
          className={
            limit === 3 
              ? "grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto" 
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          }
        >
          {displayItems.map((project) => (
            <div
              key={project.id}
              className="group bg-[#0b0d0e] text-white rounded-2xl overflow-hidden border border-white/10 hover:border-[#f36b21]/50 shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
            >
              {/* Mockup Header Container */}
              <div className="aspect-[16/10] bg-[#14161f] border-b border-white/10 relative overflow-hidden">
                <MockupIllustration type={project.previewType} />
                {project.status === "concept" && (
                  <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono font-medium text-white/70">
                    Concept Project
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white mb-1 group-hover:text-[#f36b21] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#9ca3af] leading-normal mb-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#c5a880] border border-[#c5a880]/20">
                    {project.tag}
                  </span>
                  <Link
                    href={project.href}
                    aria-label={`View ${project.title}`}
                    className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#f36b21] flex items-center justify-center text-white/60 group-hover:text-white transition-all"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Projects button if on Home page */}
        {limit === 3 && (
          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-[#f36b21] text-[#111827] hover:text-white text-xs sm:text-sm font-bold border border-black/10 hover:border-[#f36b21] transition-all shadow-sm hover:shadow-md"
            >
              <span>View More Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
