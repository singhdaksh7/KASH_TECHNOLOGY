"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  Layers, 
  TrendingUp, 
  Smartphone, 
  Sparkles, 
  Share2, 
  Users, 
  ShieldCheck,
  Target,
  Handshake,
  Play
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function Home() {
  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-16">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-20 overflow-hidden">
        {/* Diagonal orange background on the right */}
        <div className="hidden lg:block hero-diagonal-bg" />
        <div className="hidden lg:block hero-diagonal-soft" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E9] border border-[#FF5A00]/20 text-[#FF5A00] text-xs font-semibold">
                <span>One Digital Partner for Your Business</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] text-[#0B0B0F]">
                Build. Create. Grow.<br />
                with <span className="text-[#FF5A00]">KASH Technology</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl leading-relaxed">
                Websites, software, content, social media and digital marketing — everything you need to build your brand, create a strong presence and grow your business, under one roof.
              </p>

              {/* Capability Trio: Build / Create / Grow */}
              <div className="grid grid-cols-3 gap-3 max-w-xl pt-2">
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#E8E5E2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Code2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Build</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">Websites · Apps · CRM</p>
                </div>
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#E8E5E2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Create</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">Content · Video · Branding</p>
                </div>
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#E8E5E2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Grow</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">Social · SEO · Marketing</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/contact?type=audit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 hover:brightness-105 transition-all"
                >
                  Get a Free Digital Audit &rarr;
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E8E5E2] text-xs sm:text-sm font-bold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
                >
                  <span>See Our Work</span>
                  <Play className="w-3.5 h-3.5 fill-current text-[#4B5563]" />
                </Link>
              </div>

              {/* Trust Avatars & Text */}
              <div className="flex items-center gap-3 pt-2 text-xs text-[#4B5563]">
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-[#FF8A3D] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">DS</span>
                  <span className="w-7 h-7 rounded-full bg-[#0B0B0F] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">AS</span>
                  <span className="w-7 h-7 rounded-full bg-[#FF5A00] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">PV</span>
                </div>
                <span className="font-medium">
                  Trusted by growing businesses across Delhi NCR & Western UP
                </span>
              </div>
            </div>

            {/* Right Graphic: Laptop, Phone, Plant, Badges (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Floating Badge 1: End-to-End Solutions */}
              <div className="absolute -top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">End-to-End</div>
                  <div className="text-[10px] text-[#4B5563]">Custom Solutions</div>
                </div>
              </div>

              {/* Floating Badge 2: One Team */}
              <div className="absolute top-12 -left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E8E5E2] shadow-md flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#FF5A00]" />
                <div className="text-[11px] font-bold text-[#0B0B0F]">One Team <span className="font-normal text-[#4B5563] text-[9.5px]">Multiple Services</span></div>
              </div>

              {/* Main Laptop & Composition Image */}
              <div className="relative w-full max-w-[480px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
                <Image
                  src="/images/hero/hero-laptop-composition.png"
                  alt="KASH Technology Workspace and Digital Solutions"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge 3: Ongoing Support */}
              <div className="absolute -bottom-4 right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">Direct Care</div>
                  <div className="text-[10px] text-[#4B5563]">Ongoing Support</div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. TRUST / BUSINESS TYPES STRIP                                */}
      {/* ============================================================== */}
      <section className="border-y border-[#E8E5E2] bg-white py-4">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left 4 Business Types */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B0B0F]">
                <Code2 className="w-4 h-4 text-[#FF5A00]" />
                <span>Startups</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B0B0F]">
                <Layers className="w-4 h-4 text-[#FF5A00]" />
                <span>Local Businesses</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B0B0F]">
                <Users className="w-4 h-4 text-[#FF5A00]" />
                <span>Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B0B0F]">
                <TrendingUp className="w-4 h-4 text-[#FF5A00]" />
                <span>Growing Companies</span>
              </div>
            </div>

            {/* Right Agency Positioning Statement */}
            <div className="text-xs font-medium text-[#4B5563] text-center lg:text-right border-t lg:border-t-0 lg:border-l border-[#E8E5E2] pt-3 lg:pt-0 lg:pl-6">
              A Full-Service Digital & Technology Agency for Businesses That Want to Grow.
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 3. SERVICES SECTION                                            */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FFF9F4]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
                Our Services
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight leading-tight">
                End-to-End <span className="text-[#FF5A00]">Digital Solutions</span> for Modern Businesses
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                From technology and branding to marketing and growth, we provide everything you need to take your business online, scale it and get real results.
              </p>
              <div className="pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 transition-all shadow-sm"
                >
                  <span>Explore All Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: 6 Services Grid (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Website Development */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0B0B0F]">Website Development</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Modern, fast and conversion-focused websites that convert visitors into paying clients.
                </p>
              </div>

              {/* Card 2: Software & CRM */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0B0B0F]">Software & CRM</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Custom software, CRM and ERP solutions tailored for your internal business workflow.
                </p>
              </div>

              {/* Card 3: Mobile App Development */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0B0B0F]">Mobile App Development</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Android and iOS cross-platform apps built to solve real-world daily business needs.
                </p>
              </div>

              {/* Card 4: Content & Creative */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Play className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0B0B0F]">Content & Creative</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  High-converting reels, videos, graphics and brand creative that connect and resonate.
                </p>
              </div>

              {/* Card 5: Digital Marketing */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0B0B0F]">Digital Marketing</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Targeted SEO, Google and Meta ad campaigns engineered for measurable high ROI.
                </p>
              </div>

              {/* Card 6: Business Growth & Automation */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0B0B0F]">Business Growth</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Automated lead generation, workflows and ongoing end-to-end digital support.
                </p>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 4. FEATURED PROJECTS SECTION                                   */}
      {/* ============================================================== */}
      <section className="py-16 bg-white border-t border-[#E8E5E2]">
        <Container>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md mb-2">
                Our Work
              </div>
              <h2 className="text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
                Featured Projects We&apos;ve Built
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
                A glimpse of real solutions we&apos;ve delivered across technology, business and digital growth.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/portfolio"
                className="px-4 py-2 rounded-lg bg-[#FFF9F4] border border-[#E8E5E2] text-xs font-semibold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
              >
                View All Projects &rarr;
              </Link>
            </div>
          </div>

          {/* Horizontal Grid matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Project 1: Exora */}
            <div className="group bg-[#FFF9F4] rounded-2xl border border-[#E8E5E2] overflow-hidden hover:border-[#FF5A00]/40 hover:shadow-lg transition-all flex flex-col">
              <div className="relative aspect-16/10 bg-[#0B0B0F] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/projects/exora-preview.png"
                  alt="Exora Platform"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                      Web Platform
                    </span>
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 text-[#4B5563]">
                      PROTOTYPE
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Exora</h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2">
                    Business management platform with CRM, operations and analytics.
                  </p>
                </div>
                <Link href="/work/exora" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                  <span>View Project</span> &rarr;
                </Link>
              </div>
            </div>

            {/* Project 2: Launchpad X */}
            <div className="group bg-[#FFF9F4] rounded-2xl border border-[#E8E5E2] overflow-hidden hover:border-[#FF5A00]/40 hover:shadow-lg transition-all flex flex-col">
              <div className="relative aspect-16/10 bg-[#0B0B0F] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/projects/launchpad-preview.png"
                  alt="Launchpad X"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                      Blockchain
                    </span>
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 text-[#4B5563]">
                      PROTOTYPE
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Launchpad X</h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2">
                    A token launch platform architecture for creator presales and pools.
                  </p>
                </div>
                <Link href="/work/crypto-launchpad" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                  <span>View Project</span> &rarr;
                </Link>
              </div>
            </div>

            {/* Project 3: Kasba Express */}
            <div className="group bg-[#FFF9F4] rounded-2xl border border-[#E8E5E2] overflow-hidden hover:border-[#FF5A00]/40 hover:shadow-lg transition-all flex flex-col">
              <div className="relative aspect-16/10 bg-[#0B0B0F] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/projects/kasba-preview.png"
                  alt="Kasba Express"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                      Mobile App
                    </span>
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 text-[#4B5563]">
                      CONCEPT
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Kasba Express</h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2">
                    On-demand delivery platform concept with customer and seller mobile apps.
                  </p>
                </div>
                <Link href="/contact" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                  <span>View Project</span> &rarr;
                </Link>
              </div>
            </div>

            {/* Project 4: FuelOps */}
            <div className="group bg-[#FFF9F4] rounded-2xl border border-[#E8E5E2] overflow-hidden hover:border-[#FF5A00]/40 hover:shadow-lg transition-all flex flex-col">
              <div className="relative aspect-16/10 bg-[#0B0B0F] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/projects/fuelops-preview.png"
                  alt="FuelOps ERP"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                      ERP
                    </span>
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 text-[#4B5563]">
                      CONCEPT
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B0B0F]">FuelOps</h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2">
                    Fuel station ERP concept for sales, attendance, settlement and reports.
                  </p>
                </div>
                <Link href="/contact" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                  <span>View Project</span> &rarr;
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 5. ABOUT / ONE DIGITAL PARTNER SECTION                         */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FFF9F4] border-t border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Office Image (6 cols) */}
            <div className="lg:col-span-6 relative aspect-16/10 rounded-2xl overflow-hidden border border-[#E8E5E2] shadow-xl">
              <Image
                src="/images/about/home-office.png"
                alt="KASH Technology Studio and Team Space"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Copy and Value Props (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
                About KASH Technology
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight">
                Your <span className="text-[#FF5A00]">One Digital Partner</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                We&apos;re a technology and creative agency focused on helping businesses build a strong digital presence, create impactful content and grow with measurable results. Running a business is already difficult — KASH combines engineering, design and marketing into one cohesive team.
              </p>

              {/* 3 Pillars: Trusted / Business Focused / Long-Term Partner */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                    <span>End-to-End</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">Custom solutions, transparent delivery.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Target className="w-4 h-4 text-[#FF5A00]" />
                    <span>Business Focused</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">Built for your real revenue needs.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Handshake className="w-4 h-4 text-[#FF5A00]" />
                    <span>Direct Support</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">Long term partnership and care.</p>
                </div>
              </div>

              {/* Stats Bar replaced with qualitative value anchors */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[#E8E5E2]">
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-[#FF5A00]">End-to-End</div>
                  <div className="text-[10px] text-[#4B5563] font-medium">Custom Solutions</div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-[#FF5A00]">Dedicated</div>
                  <div className="text-[10px] text-[#4B5563] font-medium">Integrated Team</div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-[#FF5A00]">Direct</div>
                  <div className="text-[10px] text-[#4B5563] font-medium">Engineer Access</div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-[#FF5A00]">3 Pillars</div>
                  <div className="text-[10px] text-[#4B5563] font-medium">Build, Create, Grow</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#FF8A3D] transition-colors"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 6. WHY BUSINESSES CHOOSE KASH                                  */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-t border-[#E8E5E2]">
        <Container>
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
              Why Businesses Choose KASH
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
              One Digital Partner for Your Business
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              From custom software to branding and performance marketing — built around your real operational needs.
            </p>
          </div>

          {/* Benefit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#FFF9F4] p-6 rounded-2xl border border-[#E8E5E2] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0B0F]">One Digital Partner</h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  Technology, creative and growth services under one coordinated team. You no longer need to manage scattered vendors or deal with misaligned handoffs.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E8E5E2] text-xs font-semibold text-[#FF5A00]">
                Coordinated Strategy &amp; Execution
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FFF9F4] p-6 rounded-2xl border border-[#E8E5E2] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0B0F]">Built Around Your Business</h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  Solutions are designed around actual business workflows instead of forcing businesses into generic off-the-shelf software or template campaigns.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E8E5E2] text-xs font-semibold text-[#FF5A00]">
                Custom Architecture &amp; ROI
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FFF9F4] p-6 rounded-2xl border border-[#E8E5E2] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0B0F]">Long-Term Support</h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  KASH supports businesses beyond launch as their operational needs evolve — ensuring systems stay secure, updated, scalable and efficient.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E8E5E2] text-xs font-semibold text-[#FF5A00]">
                Ongoing Partnership &amp; Care
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 7. LARGE ORANGE CTA STRIP                                      */}
      {/* ============================================================== */}
      <CtaBanner />

    </div>
  );
}
