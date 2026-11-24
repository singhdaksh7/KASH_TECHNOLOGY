"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  Layers, 
  TrendingUp, 
  Play, 
  Check, 
  Search, 
  Lightbulb, 
  Rocket, 
  Award, 
  Zap, 
  Users, 
  Headphones 
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function ServicesPage() {
  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-16">
      
      {/* ============================================================== */}
      {/* 1. SERVICES HERO                                               */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        {/* Diagonal orange background on the right */}
        <div className="hidden lg:block hero-diagonal-bg" />
        <div className="hidden lg:block hero-diagonal-soft" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3.5 py-1.5 rounded-md">
                Our Services
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.12] text-[#0B0B0F]">
                All Your Digital Needs,<br />
                Under <span className="text-[#FF5A00]">One Roof.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl leading-relaxed">
                From building powerful websites and custom software to creating impactful content and growing your brand online — KASH Technology offers end-to-end digital solutions for businesses of all sizes.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 hover:brightness-105 transition-all"
                >
                  Get a Project Quote &rarr;
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E8E5E2] text-xs sm:text-sm font-bold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
                >
                  <span>View Our Work</span>
                  <Play className="w-3.5 h-3.5 fill-current text-[#4B5563]" />
                </Link>
              </div>
            </div>

            {/* Right Laptop & Floating Badges (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Badge 1: End-to-End */}
              <div className="absolute top-2 -left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E8E5E2] shadow-md flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                <div className="text-[11px] font-bold text-[#0B0B0F]">End-to-End <span className="font-normal text-[#4B5563] text-[9.5px]">Digital Solutions</span></div>
              </div>

              {/* Badge 2: Custom Architecture */}
              <div className="absolute -top-4 right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF5A00]" />
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">Custom-Built</div>
                  <div className="text-[10px] text-[#4B5563]">Systems &amp; Apps</div>
                </div>
              </div>

              {/* Laptop Image */}
              <div className="relative w-full max-w-[460px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
                <Image
                  src="/images/services/services-hero-laptop.png"
                  alt="KASH Technology Services Suite"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Badge 3: Direct Collaboration */}
              <div className="absolute -bottom-4 right-8 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E5E2] shadow-lg flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF5A00]" />
                <div>
                  <div className="text-xs font-bold text-[#0B0B0F]">Direct</div>
                  <div className="text-[10px] text-[#4B5563]">Collaboration</div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. BUILD / CREATE / GROW STRIP                                 */}
      {/* ============================================================== */}
      <section className="border-y border-[#E8E5E2] bg-white py-4">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Build</div>
                <div className="text-[11px] text-[#4B5563]">Websites, Apps, CRM & Custom Software</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Create</div>
                <div className="text-[11px] text-[#4B5563]">Branding, Content, Video & Design</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Grow</div>
                <div className="text-[11px] text-[#4B5563]">Social Media, SEO, Ads & Lead Generation</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 3. CORE SERVICES 4-PILLAR CARDS                                */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FFF9F4]">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-2">
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
              Our Core Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight">
              Comprehensive Services for Your <span className="text-[#FF5A00]">Brand&apos;s Growth</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Strategy, design, development and marketing — everything you need to build, create and grow online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Branding */}
            <div className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden flex flex-col justify-between hover:border-[#FF5A00]/40 hover:shadow-lg transition-all">
              <div className="relative aspect-16/10 bg-[#FFF3E9]">
                <Image
                  src="/images/services/service-branding.png"
                  alt="Branding Service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#0B0B0F]">Branding</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Build a strong and memorable brand that stands out, online and offline.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#0B0B0F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Brand Strategy & Positioning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Logo & Visual Identity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Brand Guidelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Marketing Collateral</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#E8E5E2]">
                  <Link href="/branding" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                    <span>Learn More</span> &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Web Design */}
            <div className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden flex flex-col justify-between hover:border-[#FF5A00]/40 hover:shadow-lg transition-all">
              <div className="relative aspect-16/10 bg-[#FFF3E9]">
                <Image
                  src="/images/services/service-web.png"
                  alt="Web Design Service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#0B0B0F]">Web Design</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Modern, responsive and conversion-focused websites that create real business impact.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#0B0B0F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Business & Corporate Websites</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Landing Pages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>E-commerce Websites</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>UI/UX & Responsive Design</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#E8E5E2]">
                  <Link href="/website-development" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                    <span>Learn More</span> &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Development */}
            <div className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden flex flex-col justify-between hover:border-[#FF5A00]/40 hover:shadow-lg transition-all">
              <div className="relative aspect-16/10 bg-[#FFF3E9]">
                <Image
                  src="/images/services/service-dev.png"
                  alt="Development Service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#0B0B0F]">Development</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Custom, scalable and secure software solutions built for your business needs.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#0B0B0F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Web & Mobile App Development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>CRM & ERP Solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>SaaS & Custom Platforms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>API & Third-Party Integrations</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#E8E5E2]">
                  <Link href="/custom-software-development" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                    <span>Learn More</span> &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 4: Creative */}
            <div className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden flex flex-col justify-between hover:border-[#FF5A00]/40 hover:shadow-lg transition-all">
              <div className="relative aspect-16/10 bg-[#FFF3E9]">
                <Image
                  src="/images/services/service-creative.png"
                  alt="Creative Service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#0B0B0F]">Creative</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    High-quality content and video that tells your story and builds brand trust.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#0B0B0F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Video Production & Editing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Social Media Content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Product & Promo Videos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Ad Creatives & Campaign Assets</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#E8E5E2]">
                  <Link href="/content-creation" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                    <span>Learn More</span> &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 4. PROCESS SECTION                                             */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-t border-[#E8E5E2]">
        <Container>
          <div className="max-w-xl mb-12 space-y-2">
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
              Our Process
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
              A Simple, Proven Process <span className="text-[#FF5A00]">That Works.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              A clear, collaborative and result-driven approach from idea to growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B0F]">Discover</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Understand your goals, challenges and specific project requirements.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B0F]">Plan</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Define the right strategy, technical architecture, solutions and timeline.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B0F]">Build & Create</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Design, develop and create high-quality assets with agile iterations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B0F]">Launch & Grow</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Go live, track results and keep optimizing continuously for ongoing business growth.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 5. ORANGE INLINE CTA BANNER (HAVE A PROJECT IN MIND?)          */}
      {/* ============================================================== */}
      <section className="py-10 bg-[#FFF9F4]">
        <Container>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                Let&apos;s Build Together
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Have a Project in Mind?
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-lg">
                Tell us about your idea, and our team will get back with the right solution, timeline and estimate.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white text-[#0B0B0F] font-bold text-xs sm:text-sm hover:bg-[#FFF3E9] transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Send an Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 6. WHY CHOOSE KASH TECHNOLOGY                                  */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-t border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
                Why Choose KASH Technology
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight leading-tight">
                More Than a Service Provider — We&apos;re Your <span className="text-[#FF5A00]">Digital Growth Partner.</span>
              </h2>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0B0B0F]">End-to-End Expertise</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Technology, creative and growth — all handled seamlessly by one unified team.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Business-Focused Approach</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Solutions engineered specifically to drive real, measurable bottom-line business results.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Transparent & Collaborative</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Clear regular communication, live milestones, and complete operational visibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Long-Term Support</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    We don&apos;t just launch and walk away — we help you manage, scale and succeed continuously.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </Container>
      </section>

    </div>
  );
}
