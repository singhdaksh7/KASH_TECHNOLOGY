"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Award, 
  Users, 
  Target, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Briefcase
} from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

const TEAM_CAPABILITIES = [
  {
    name: "Daksh Singh",
    role: "Founder & Tech Lead",
    badge: "Verified Lead",
    image: "/images/team/daksh-singh.png",
    hasSocial: true,
    linkedin: SITE_CONFIG.social.linkedin,
    description: "Architecting scalable web platforms, custom ERP systems, and cloud infrastructure.",
  },
  {
    name: "Technology & Engineering",
    role: "Full-Stack & Systems",
    badge: "Capability Group",
    image: "/images/team/product-lead.png",
    hasSocial: false,
    description: "Next.js, React, Node.js, Python, PostgreSQL, and high-performance APIs.",
  },
  {
    name: "Creative & Content",
    role: "Video & Visual Identity",
    badge: "Capability Group",
    image: "/images/team/creative-lead.png",
    hasSocial: false,
    description: "Brand design, typography, video editing, motion graphics, and content production.",
  },
  {
    name: "Product & Solutions",
    role: "Architecture & UX",
    badge: "Capability Group",
    image: "/images/team/business-lead.png",
    hasSocial: false,
    description: "Business workflow scoping, technical specification, and iterative MVP deployment.",
  },
  {
    name: "Marketing & Growth",
    role: "SEO & Performance Ads",
    badge: "Capability Group",
    image: "/images/team/marketing-lead.png",
    hasSocial: false,
    description: "Search engine optimization, targeted Meta & Google ad funnels, and analytics.",
  },
];

export function AboutPage() {
  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-16">
      
      {/* ============================================================== */}
      {/* 1. ABOUT HERO                                                  */}
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
                About KASH Technology
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.12] text-[#0B0B0F]">
                The Team Behind<br />
                <span className="text-[#FF5A00]">KASH Technology</span>
              </h1>

              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl leading-relaxed">
                A digital and technology agency helping businesses build, create and grow with the right mix of technology, creativity and marketing — all under one roof.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/services"
                  className="px-6 py-3 rounded-lg bg-[#FF5A00] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 hover:bg-[#FF8A3D] transition-all"
                >
                  Our Services &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E8E5E2] text-xs sm:text-sm font-bold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
                >
                  <span>Get in Touch</span>
                  <Play className="w-3.5 h-3.5 fill-current text-[#4B5563]" />
                </Link>
              </div>
            </div>

            {/* Right Reception Office Image (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[480px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
                <Image
                  src="/images/about/about-hero-reception.png"
                  alt="KASH Technology Reception & Studio"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. VALUE PROPOSITIONS STRIP                                    */}
      {/* ============================================================== */}
      <section className="border-y border-[#E8E5E2] bg-white py-4">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">End-to-End</div>
                <div className="text-[11px] text-[#4B5563]">Custom Solutions</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Direct Support</div>
                <div className="text-[11px] text-[#4B5563]">Long-Term Partner</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Unified Strategy</div>
                <div className="text-[11px] text-[#4B5563]">Technology &amp; Creative</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B0B0F]">Delhi NCR &amp; Western UP</div>
                <div className="text-[11px] text-[#4B5563]">Primary Service Focus</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 3. OUR STORY                                                   */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FFF9F4]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Office Image (6 cols) */}
            <div className="lg:col-span-6 relative aspect-16/10 rounded-2xl overflow-hidden border border-[#E8E5E2] shadow-xl">
              <Image
                src="/images/about/about-story-office.png"
                alt="The KASH Story Studio"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Story Copy (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
                Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight">
                The KASH Story
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed border-l-2 border-[#FF5A00] pl-4">
                <p>
                  KASH Technology started with a simple idea — businesses shouldn&apos;t have to manage multiple vendors for their digital needs. We saw local businesses, startups and growing companies struggle with scattered solutions, high costs and lack of long-term support.
                </p>
                <p>
                  So, we built KASH — a single, reliable partner that brings together technology, creativity and growth to help businesses build a strong digital presence, run more efficiently and grow consistently.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 4. MISSION / VISION / VALUES (3 CARDS)                         */}
      {/* ============================================================== */}
      <section className="py-14 bg-white border-y border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Mission */}
            <div className="p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B0B0F]">Our Mission</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                To empower businesses with practical, affordable and scalable digital solutions.
              </p>
            </div>

            {/* Vision */}
            <div className="p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B0B0F]">Our Vision</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                To be the most trusted digital partner for businesses across Delhi NCR and Western Uttar Pradesh.
              </p>
            </div>

            {/* Values */}
            <div className="p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B0B0F]">Our Values</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Trust, quality, transparency, long-term support and real business impact.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 5. THE PEOPLE & CAPABILITIES BEHIND KASH                       */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#FFF9F4]">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md mb-2">
                Our Team &amp; Capabilities
              </div>
              <h2 className="text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
                The People &amp; Capabilities Behind <span className="text-[#FF5A00]">KASH</span>
              </h2>
            </div>
            <p className="text-xs text-[#4B5563] max-w-sm border-l-2 border-[#FF5A00] pl-3">
              Led by founder Daksh Singh alongside specialized capability teams in software, creative, marketing and digital growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TEAM_CAPABILITIES.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden p-4 hover:border-[#FF5A00]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FFF3E9] mb-3">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    {member.hasSocial && member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-colors"
                      >
                        <SocialIcon name="linkedin" className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-mono font-bold text-[#FF5A00] bg-[#FFF3E9] px-1.5 py-0.5 rounded">
                      {member.badge}
                    </span>
                    <h3 className="text-xs font-bold text-[#0B0B0F] pt-1">{member.name}</h3>
                    <p className="text-[10px] text-[#4B5563] font-medium">{member.role}</p>
                    <p className="text-[10px] text-[#4B5563]/80 leading-normal pt-1">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 6. OUR STUDIO                                                  */}
      {/* ============================================================== */}
      <section className="py-16 bg-white border-t border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Studio Image */}
            <div className="lg:col-span-6 relative aspect-16/10 rounded-2xl overflow-hidden border border-[#E8E5E2] shadow-xl">
              <Image
                src="/images/about/about-studio-office.png"
                alt="KASH Technology Collaborative Studio"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Copy */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
                Our Studio
              </div>
              <h2 className="text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
                A Space to Build, Create and Collaborate
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Our studio is where ideas turn into real solutions. It&apos;s a collaborative space for product thinking, design, development, content and strategy — all aligned towards one goal: your business growth.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 7. BOTTOM CTA STRIP                                            */}
      {/* ============================================================== */}
      <section className="py-12 bg-gradient-to-r from-[#FF8A3D] to-[#FF5A00] text-white">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Let&apos;s Build Something Great Together
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-white/90 max-w-md text-center lg:text-left border-t lg:border-t-0 lg:border-l border-white/30 pt-3 lg:pt-0 lg:pl-6">
              Have a project, idea or business goal in mind? Let&apos;s discuss how we can help you build, create and grow with the right strategy and technology.
            </div>
            <div>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-[#0B0B0F] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Get in Touch Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
