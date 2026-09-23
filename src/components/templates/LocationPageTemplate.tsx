import React from "react";
import Link from "next/link";
import { LocationData } from "@/lib/locations-data";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink 
} from "lucide-react";

interface LocationPageTemplateProps {
  location: LocationData;
}

export function LocationPageTemplate({ location }: LocationPageTemplateProps) {
  return (
    <>
      {/* 1. Hero with Location Focus, Breadcrumbs, & Quick Nearby Links */}
      <HeroDiagonal
        badge={location.badge}
        titlePrimary={location.h1Primary}
        titleAccent={location.h1Accent}
        description={location.intro}
        primaryCtaText="Book a Consultation"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Portfolio"
        secondaryCtaHref="/portfolio"
        breadcrumbs={[
          { label: "Areas We Serve" },
          { label: location.name },
        ]}
        quickLinks={location.nearbyAreas.map((a) => ({ label: a.name, href: a.href }))}
      />

      {/* 2. Local Industries on Ivory Surface */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              LOCAL ECONOMIC FOCUS
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Industries We Serve in {location.name}
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto pt-2">
              Bespoke digital architecture engineered to solve the operational realities of {location.name}&apos;s key business sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {location.localIndustries.map((ind) => (
              <div
                key={ind.title}
                className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#e86024]/10 border border-[#e86024]/20 flex items-center justify-center text-[#e86024] mb-5">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-3">
                    {ind.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">
                    {ind.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-black/5 flex items-center justify-between text-xs font-mono text-[#e86024] font-semibold">
                  <span>SPECIALIZED WORKFLOWS</span>
                  <span>ENGINEERED</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Real Business Problems vs Engineered Solutions on Dark */}
      <section className="py-20 md:py-28 bg-[#080808] text-white relative overflow-hidden border-b border-white/10">
        <CircuitBackground variant="dark" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              CHALLENGES & SOLUTIONS
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Solving Bottlenecks for {location.name} Businesses
            </h2>
            <p className="text-sm text-[#9ca3af] max-w-xl mx-auto pt-2">
              We replace spreadsheet limitations, manual paperwork, and outdated websites with type-safe software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {location.businessProblems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0e0e12] rounded-2xl p-8 border border-white/5 flex flex-col justify-between shadow-lg hover:border-[#e86024]/30 transition-colors"
              >
                <div className="space-y-6">
                  {/* Problem */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>The Challenge</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                      {item.problem}
                    </p>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Solution */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#e86024] text-xs font-mono font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>KASH Solution</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 text-[10px] font-mono text-[#c5a880]">
                  OUTCOME: AUTOMATED & AUDITABLE
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Software Use Cases on Ivory */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              SOFTWARE ARCHITECTURE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Tailored Systems for {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {location.softwareUseCases.map((uc) => (
              <div
                key={uc.title}
                className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#0e0e12] text-[#c5a880] inline-block mb-4">
                    {uc.tag}
                  </span>
                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed mb-6">
                    {uc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9ca3af]">Bespoke Architecture</span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#e86024] hover:text-[#d35219]"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Verified Case Studies Strip */}
      <section className="py-16 bg-[#0a0a0d] border-b border-white/10 text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-[#e86024] uppercase tracking-wider block mb-1">
                PROVEN CODE IN PRODUCTION
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-white">
                Verified Engineering Case Studies
              </h3>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#e86024]/40 text-white transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <Link
              href="/work/schoolsync"
              className="group bg-[#0e0e12] rounded-xl p-6 border border-white/5 hover:border-[#e86024]/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-[#c5a880] uppercase tracking-wider block mb-2">
                Education & ERP
              </span>
              <h4 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#e86024] transition-colors mb-2">
                SchoolSync Multi-Tenant ERP
              </h4>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Multi-tenant educational management system with isolated database schemas, automated fee ledgers, and real-time roll call.
              </p>
            </Link>

            <Link
              href="/work/exora"
              className="group bg-[#0e0e12] rounded-xl p-6 border border-white/5 hover:border-[#e86024]/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-[#c5a880] uppercase tracking-wider block mb-2">
                Fintech & Trading
              </span>
              <h4 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#e86024] transition-colors mb-2">
                Exora Crypto Exchange
              </h4>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                High-throughput crypto trading interface with live order-book depth, encrypted wallet management, and sub-second execution.
              </p>
            </Link>

            <Link
              href="/work/crypto-launchpad"
              className="group bg-[#0e0e12] rounded-xl p-6 border border-white/5 hover:border-[#e86024]/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-[#c5a880] uppercase tracking-wider block mb-2">
                Web3 & Smart Contracts
              </span>
              <h4 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#e86024] transition-colors mb-2">
                BSC Crypto Launchpad
              </h4>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Decentralized token launchpad with automated factory contract deployment, liquidity lock workflows, and presale tiers.
              </p>
            </Link>
          </div>
        </Container>
      </section>

      {/* 6. Nearby Service Areas */}
      <section className="py-16 bg-[#080808] border-b border-white/10 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono font-bold text-[#c5a880] uppercase tracking-wider">
              REGIONAL COVERAGE
            </span>
            <h3 className="font-serif-heading text-2xl font-bold text-white">
              Nearby Areas We Serve
            </h3>
            <p className="text-xs text-[#9ca3af] max-w-xl mx-auto">
              In addition to {location.name}, KASH Technology serves enterprises throughout Delhi NCR and Western Uttar Pradesh.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {location.nearbyAreas.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="px-4 py-2 rounded-lg bg-[#0e0e12] border border-white/10 hover:border-[#e86024]/40 text-xs font-mono text-white/80 hover:text-[#e86024] transition-colors flex items-center gap-1.5"
                >
                  <span>{area.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Localized FAQs */}
      <FaqAccordion
        variant="ivory"
        faqs={location.faqs}
        title={`Frequently Asked Questions — ${location.name}`}
        badge={`FAQS FOR ${location.name.toUpperCase()}`}
      />

      {/* 8. Conversion Banner */}
      <CtaBanner
        variant="dark"
        title={`Serving Businesses in ${location.name}`}
        subtitle="Schedule a direct technical consultation with our lead engineers today."
        buttonText="Discuss Your Project"
        buttonHref="/contact"
      />
    </>
  );
}
