"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  Layers, 
  TrendingUp, 
  Play, 
  Award, 
  Users, 
  Star, 
  Zap,
  Headphones
} from "lucide-react";
import { Container } from "@/components/ui/Container";

interface Project {
  title: string;
  category: string;
  tag: string;
  statusType: "REAL PROJECT" | "PROTOTYPE" | "CONCEPT";
  description: string;
  image: string;
  href: string;
}

const PROJECTS: Project[] = [
  {
    title: "SchoolSync",
    category: "ERP / SaaS",
    tag: "Software / SaaS",
    statusType: "PROTOTYPE",
    description: "School management platform prototype to manage admissions, attendance and academic schedules.",
    image: "/images/projects/schoolsync-mockup.png",
    href: "/work/schoolsync",
  },
  {
    title: "Launchpad X",
    category: "Blockchain / Web3",
    tag: "Software / SaaS",
    statusType: "PROTOTYPE",
    description: "Token presale deployment and smart contract infrastructure prototype.",
    image: "/images/projects/launchpad-mockup.png",
    href: "/work/crypto-launchpad",
  },
  {
    title: "Kasba Express",
    category: "E-Commerce",
    tag: "Mobile Apps",
    statusType: "CONCEPT",
    description: "On-demand local merchant ordering and delivery concept workflow.",
    image: "/images/projects/kasba-mockup.png",
    href: "/contact",
  },
  {
    title: "Dr. Ratna Saxena IVF",
    category: "Website",
    tag: "Websites",
    statusType: "REAL PROJECT",
    description: "IVF & fertility centre healthcare website with service details and patient enquiries.",
    image: "/images/projects/ratna-ivf-mockup.png",
    href: "/contact",
  },
  {
    title: "FuelOps",
    category: "ERP / Operations",
    tag: "Software / SaaS",
    statusType: "CONCEPT",
    description: "Fuel station enterprise operations platform concept for pump sales, settlement and reporting.",
    image: "/images/projects/fuelops-mockup.png",
    href: "/contact",
  },
  {
    title: "TaxiSegrator",
    category: "Mobile App",
    tag: "Mobile Apps",
    statusType: "CONCEPT",
    description: "B2B taxi marketplace concept connecting travel agents and verified operators.",
    image: "/images/projects/taxisegrator-mockup.png",
    href: "/contact",
  },
];

const FILTERS = [
  "All Projects",
  "Websites",
  "Software / SaaS",
  "Mobile Apps",
  "ERP / CRM",
  "Marketing & Creative",
  "Branding",
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filteredProjects = activeFilter === "All Projects"
    ? PROJECTS
    : PROJECTS.filter((p) => p.tag === activeFilter || p.category.includes(activeFilter));

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-16">
      
      {/* ============================================================== */}
      {/* 1. PORTFOLIO HERO                                              */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-18 overflow-hidden">
        {/* Diagonal orange background on the right */}
        <div className="hidden lg:block hero-diagonal-bg" />
        <div className="hidden lg:block hero-diagonal-soft" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3.5 py-1.5 rounded-md">
                Our Work
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.12] text-[#0B0B0F]">
                Projects That<br />
                <span className="text-[#0B0B0F]">Build, </span>
                <span className="text-[#FF5A00]">Create & Grow</span>
              </h1>

              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl leading-relaxed">
                A showcase of websites, software, apps, branding and growth solutions we&apos;ve built for businesses, startups and enterprises.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 hover:brightness-105 transition-all"
                >
                  Start a Similar Project &rarr;
                </Link>
                <Link
                  href="/contact?type=audit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E8E5E2] text-xs sm:text-sm font-bold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
                >
                  <span>Get a Free Audit</span>
                  <Play className="w-3.5 h-3.5 fill-current text-[#4B5563]" />
                </Link>
              </div>
            </div>

            {/* Right Laptop & Floating Badges (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Badge 1: End-to-End Solutions */}
              <div className="absolute top-2 -left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">End-to-End</div>
                  <div className="text-[10px] text-[#4B5563]">Custom Solutions</div>
                </div>
              </div>

              {/* Badge 2: Business Focused */}
              <div className="absolute -top-4 right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">Business</div>
                  <div className="text-[10px] text-[#4B5563]">Focused Architecture</div>
                </div>
              </div>

              {/* Laptop Image */}
              <div className="relative w-full max-w-[460px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
                <Image
                  src="/images/services/services-hero-laptop.png"
                  alt="KASH Technology Portfolio Highlights"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Badge 3: Client Focused */}
              <div className="absolute -bottom-4 right-8 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">Direct Support</div>
                  <div className="text-[10px] text-[#4B5563]">Long-Term Partner</div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. VALUE PILLARS STRIP                                         */}
      {/* ============================================================== */}
      <section className="border-y border-[#E8E5E2] bg-white py-4">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">End-to-End</div>
                <div className="text-[11px] text-[#4B5563]">Custom Solutions</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Tailored</div>
                <div className="text-[11px] text-[#4B5563]">Business Systems</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Star className="w-4 h-4 text-[#FF5A00] fill-[#FF5A00]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">High Quality</div>
                <div className="text-[11px] text-[#4B5563]">Production Standards</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Ongoing Care</div>
                <div className="text-[11px] text-[#4B5563]">Direct Support</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 3. FILTER PILLS                                                */}
      {/* ============================================================== */}
      <section className="pt-8 pb-4 bg-[#FFF9F4]">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF5A00] text-white shadow-xs"
                      : "bg-white text-[#4B5563] border border-[#E8E5E2] hover:border-[#FF5A00]/50 hover:text-[#FF5A00]"
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
      {/* 4. FEATURED PROJECT BANNER (EXORA)                             */}
      {/* ============================================================== */}
      <section className="py-8 bg-[#FFF9F4]">
        <Container>
          <div className="bg-white rounded-3xl border border-[#E8E5E2] p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left Mockup */}
            <div className="w-full lg:w-1/2 relative aspect-16/10 rounded-2xl overflow-hidden bg-[#FFF3E9]">
              <Image
                src="/images/projects/portfolio-exora-hero.png"
                alt="Exora Business Operations Platform"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Right Information */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
                Featured Project
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
                Exora – Business Operations Platform
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                A comprehensive platform to manage leads, projects, teams, finance and client operations for growing businesses.
              </p>

              {/* 3 Value Points */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Layers className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>CRM + Project</span>
                  </div>
                  <p className="text-[10px] text-[#4B5563]">Management</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Users className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Team & Client</span>
                  </div>
                  <p className="text-[10px] text-[#4B5563]">Collaboration</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Business</span>
                  </div>
                  <p className="text-[10px] text-[#4B5563]">Analytics</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/work/exora"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#FF8A3D] transition-colors"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 5. EXPLORE MORE PROJECTS GRID (6 CARDS)                        */}
      {/* ============================================================== */}
      <section className="py-16 bg-[#FFF9F4] border-t border-[#E8E5E2]">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md mb-2">
                Our Portfolio
              </div>
              <h2 className="text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
                Explore More Projects
              </h2>
            </div>
            <p className="text-xs text-[#4B5563] max-w-sm sm:text-right">
              A curated collection of our recent work across technology, design and digital growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.title}
                className="group bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden hover:border-[#FF5A00]/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 bg-[#FFF9F4] flex items-center justify-center p-3 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-[#4B5563] border border-gray-200">
                        {p.statusType}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#0B0B0F]">{p.title}</h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#E8E5E2]">
                    <Link
                      href={p.href}
                      className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1"
                    >
                      <span>View Project</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 6. BOTTOM CTA (HAVE A PROJECT IN MIND?)                        */}
      {/* ============================================================== */}
      <section className="py-12 bg-white border-t border-[#E8E5E2]">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                Have a <span className="text-[#FF5A00]">Project in Mind?</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Let&apos;s discuss your idea and turn it into a real, scalable solution.
              </p>
            </div>

            {/* 3 Icons */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#0B0B0F] font-semibold">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5A00]" />
                <span>Quick Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF5A00]" />
                <span>Custom Solution</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#FF5A00]" />
                <span>Ongoing Support</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 transition-all shadow-sm"
              >
                Start Your Project &rarr;
              </Link>
              <Link
                href="/contact?type=audit"
                className="text-xs font-semibold text-[#4B5563] hover:text-[#FF5A00] underline"
              >
                or Get a Free Digital Audit
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
