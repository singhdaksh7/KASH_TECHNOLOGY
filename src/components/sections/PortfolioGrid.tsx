"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface ProjectCardItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  statusType: "REAL PROJECT" | "PROTOTYPE" | "CONCEPT";
  description: string;
  image: string;
  href: string;
}

const REAL_PROJECTS: ProjectCardItem[] = [
  {
    id: "exora",
    title: "Exora",
    category: "Web Platform",
    tag: "Websites",
    statusType: "PROTOTYPE",
    description: "Business management platform with CRM, operations and analytics.",
    image: "/images/projects/exora-preview.png",
    href: "/work/exora",
  },
  {
    id: "schoolsync",
    title: "SchoolSync",
    category: "ERP / SaaS",
    tag: "Software / SaaS",
    statusType: "PROTOTYPE",
    description: "Multi-tenant school ERP prototype to manage admissions, attendance and fees.",
    image: "/images/projects/schoolsync-mockup.png",
    href: "/work/schoolsync",
  },
  {
    id: "launchpad",
    title: "Launchpad X",
    category: "Blockchain",
    tag: "Software / SaaS",
    statusType: "PROTOTYPE",
    description: "Token presale deployment and smart contract infrastructure prototype.",
    image: "/images/projects/launchpad-preview.png",
    href: "/work/crypto-launchpad",
  },
  {
    id: "kasba",
    title: "Kasba Express",
    category: "Mobile App",
    tag: "Mobile Apps",
    statusType: "CONCEPT",
    description: "On-demand delivery platform concept with customer and merchant mobile workflows.",
    image: "/images/projects/kasba-preview.png",
    href: "/contact",
  },
  {
    id: "fuelops",
    title: "FuelOps",
    category: "ERP",
    tag: "Software / SaaS",
    statusType: "CONCEPT",
    description: "Fuel station enterprise platform concept for nozzle sales and shift settlement.",
    image: "/images/projects/fuelops-preview.png",
    href: "/contact",
  },
  {
    id: "taxisegrator",
    title: "TaxiSegrator",
    category: "Mobile App",
    tag: "Mobile Apps",
    statusType: "CONCEPT",
    description: "B2B taxi marketplace concept connecting travel operators and drivers.",
    image: "/images/projects/taxisegrator-mockup.png",
    href: "/contact",
  },
];

const FILTERS = ["All Projects", "Websites", "Software / SaaS", "Mobile Apps"];

interface PortfolioGridProps {
  limit?: number;
  showFilters?: boolean;
}

export function PortfolioGrid({ limit, showFilters = true }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const items = activeFilter === "All Projects"
    ? REAL_PROJECTS
    : REAL_PROJECTS.filter((p) => p.tag === activeFilter || p.category.includes(activeFilter));

  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <section className="py-16 md:py-20 bg-[#FFF9F4] text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
      <Container className="relative z-10">
        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
            {FILTERS.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF5A00] text-white shadow-xs"
                      : "bg-white text-[#4B5563] border border-[#E8E5E2] hover:border-[#FF5A00]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        <div 
          className={
            limit === 3 
              ? "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" 
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {displayItems.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E8E5E2] hover:border-[#FF5A00]/40 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
            >
              {/* Mockup Header Container */}
              <div className="aspect-[16/10] bg-[#FFF9F4] border-b border-[#E8E5E2] relative overflow-hidden flex items-center justify-center p-3">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content Body */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-[#4B5563] border border-gray-200">
                      {project.statusType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8E5E2]">
                  <Link
                    href={project.href}
                    className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1"
                  >
                    <span>View Project</span> &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {limit === 3 && (
          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white border border-[#E8E5E2] hover:border-[#FF5A00] text-[#0B0B0F] hover:text-[#FF5A00] text-xs font-bold transition-all shadow-2xs"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
