"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Terminal, 
  Palette, 
  TrendingUp
} from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container } from "@/components/ui/Container";
import { SectionHeading, StudioButton } from "@/components/public-ui";
import { SITE_CONFIG } from "@/lib/constants";

const LEADERSHIP_AND_CAPABILITIES = [
  {
    name: "Daksh Singh",
    role: "Founder & Lead Systems Architect",
    badge: "FOUNDER",
    image: "/images/team/daksh-singh.png",
    hasSocial: true,
    linkedin: SITE_CONFIG.social.linkedin,
    description: "Full-stack systems engineering, distributed architecture, mission-critical databases, and modern Next.js/Docker deployments.",
  },
  {
    name: "Engineering & Architecture",
    role: "Full-Stack, API & Systems",
    badge: "BUILD",
    image: "/images/team/product-lead.png",
    hasSocial: false,
    description: "Next.js, React, Node.js, Python, PostgreSQL, Redis, multi-tenant databases, and enterprise data models.",
  },
  {
    name: "Creative & Visual Media",
    role: "Brand Identity, Motion & Video",
    badge: "CREATE",
    image: "/images/team/creative-lead.png",
    hasSocial: false,
    description: "Editorial brand systems, typography curation, commercial video editing, motion design, and high-conversion assets.",
  },
  {
    name: "Product & Solutions",
    role: "UX Architecture & Systems Scoping",
    badge: "ARCHITECT",
    image: "/images/team/business-lead.png",
    hasSocial: false,
    description: "Translating ambiguous business challenges into deterministic software specifications, workflows, and actionable roadmaps.",
  },
  {
    name: "Performance & Market Growth",
    role: "Technical SEO & Performance Growth",
    badge: "GROW",
    image: "/images/team/marketing-lead.png",
    hasSocial: false,
    description: "Search engine dominance, search visibility, high-intent lead funnels, and data-backed conversion rate optimization.",
  },
];

export function AboutPage() {
  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-20">
      
      {/* 1. EDITORIAL HERO */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        <Container>
          <div className="max-w-4xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-semibold">
              ABOUT KASH TECHNOLOGY // STUDIO &amp; SYSTEMS
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#0B0B0F] leading-[1.08]">
              Where engineering discipline meets <span className="text-[#FF5A00]">creative storytelling.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#4B5563] leading-relaxed max-w-2xl font-normal">
              KASH Technology operates as a hybrid software development studio and creative agency. We build bespoke digital products, enterprise web systems, and high-impact brand identities under one unified roof.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <StudioButton href="/services" variant="primary">
                Explore Capabilities
              </StudioButton>
              <StudioButton href="/contact" variant="outline">
                Start a Conversation
              </StudioButton>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. RECEPTION / STUDIO VISUAL HERO */}
      <section className="border-y border-[#E8E5E2] bg-white py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 relative aspect-16/10 rounded-2xl overflow-hidden border border-[#E8E5E2] shadow-xl">
              <Image
                src="/images/about/about-hero-reception.png"
                alt="KASH Technology Studio Headquarters"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="lg:col-span-5 space-y-6 lg:pl-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                CORE PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
                No fragmented vendors. Just one dedicated team.
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                Founders and enterprises usually face an expensive dilemma: hire a development house that cannot design, or hire a design boutique that writes unmaintainable code.
              </p>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                KASH Technology bridges this divide. We combine modern software architecture, database design, and cloud engineering with high-touch brand aesthetics, video editing, and customer acquisition.
              </p>
              <div className="pt-2 flex items-center gap-6 border-t border-[#E8E5E2]">
                <div>
                  <div className="text-2xl font-black text-[#0B0B0F]">100%</div>
                  <div className="text-xs text-[#4B5563] font-medium">In-House Production</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#FF5A00]">Delhi NCR</div>
                  <div className="text-xs text-[#4B5563] font-medium">Regional Engineering Hub</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. THE 3 CORE DISCIPLINES */}
      <section className="py-24 bg-[#FFF9F4]">
        <Container>
          <div className="max-w-2xl mb-16">
            <SectionHeading
              eyebrow="PILLARS OF OPERATION"
              title="Built for founders who value speed and craft."
              description="Every client engagement is anchored in our tripartite capability model."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#E8E5E2] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E9] text-[#FF5A00] flex items-center justify-center font-bold">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B0B0F]">01. BUILD</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Full-lifecycle software engineering. From high-speed Next.js web platforms to multi-tenant ERPs, inventory systems, operational CRMs, and cross-platform mobile apps.
              </p>
              <div className="text-xs font-mono text-[#0B0B0F]/70 pt-2 border-t border-[#E8E5E2]">
                Stack: Next.js &bull; TypeScript &bull; PostgreSQL &bull; Docker &bull; Node.js
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E8E5E2] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E9] text-[#FF5A00] flex items-center justify-center font-bold">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B0B0F]">02. CREATE</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Distinguished visual identity and multimedia. Editorial design, commercial video post-production, motion graphics, and content that commands premium market perception.
              </p>
              <div className="text-xs font-mono text-[#0B0B0F]/70 pt-2 border-t border-[#E8E5E2]">
                Focus: Brand Systems &bull; Video Production &bull; Typography &bull; UI/UX
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E8E5E2] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E9] text-[#FF5A00] flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B0B0F]">03. GROW</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Sustainable customer acquisition. Structured technical SEO, search engine ranking dominance, Meta &amp; Google ad campaigns, and automated lead capture pipelines.
              </p>
              <div className="text-xs font-mono text-[#0B0B0F]/70 pt-2 border-t border-[#E8E5E2]">
                Focus: Technical SEO &bull; Performance Ads &bull; Conversion Architecture
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. THE TEAM & LEADERSHIP */}
      <section className="py-24 bg-white border-y border-[#E8E5E2]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                LEADERSHIP &amp; EXPERTISE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight mt-2">
                Specialized minds. Transparent delivery.
              </h2>
            </div>
            <p className="text-sm text-[#4B5563] max-w-md">
              Led directly by technical founders with active involvement in architecture, code reviews, design critiques, and launch execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {LEADERSHIP_AND_CAPABILITIES.map((member) => (
              <div
                key={member.name}
                className="bg-[#FFF9F4] rounded-2xl border border-[#E8E5E2] overflow-hidden p-6 hover:border-[#FF5A00]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-5 border border-[#E8E5E2]/60">
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
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-[#0B0B0F] hover:bg-[#FF5A00] hover:text-white transition-colors shadow-sm"
                      >
                        <SocialIcon name="linkedin" className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-2 py-0.5 rounded">
                      {member.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#0B0B0F] pt-1">{member.name}</h3>
                    <p className="text-xs text-[#FF5A00] font-semibold">{member.role}</p>
                    <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-2">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. STUDIO WORKSPACE ENVIRONMENT */}
      <section className="py-24 bg-[#FFF9F4]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-16/10 rounded-3xl overflow-hidden border border-[#E8E5E2] shadow-xl">
              <Image
                src="/images/about/about-studio-office.png"
                alt="KASH Technology Collaborative Production Floor"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold">
                PHYSICAL PRESENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight">
                Rooted in Delhi NCR. Delivering globally.
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                Our studio workspace brings designers, engineers, and strategists into direct physical collaboration. When a software challenge requires an intuitive user flow, or a brand launch requires technical backend synchronization, decisions happen in minutes, not across ticket backlogs.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-[#0B0B0F] font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                  Direct founder access on every primary engagement
                </div>
                <div className="flex items-center gap-3 text-sm text-[#0B0B0F] font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                  NDA-backed intellectual property protections
                </div>
                <div className="flex items-center gap-3 text-sm text-[#0B0B0F] font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                  Live milestone staging with continuous deployment
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. CONVERSION CTA */}
      <section className="py-20 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to build something lasting?
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal">
              Whether you need to modernize legacy systems, launch a new digital venture, or transform your brand presence, our studio is ready.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-[#0B0B0F] text-white font-bold text-sm hover:bg-black transition-all shadow-xl inline-flex items-center gap-2"
              >
                <span>Schedule a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl bg-white text-[#0B0B0F] font-bold text-sm hover:bg-[#FFF3E9] transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>View Selected Work</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
