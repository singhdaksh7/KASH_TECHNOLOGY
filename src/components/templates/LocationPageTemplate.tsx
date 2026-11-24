import React from "react";
import Link from "next/link";
import { LocationData } from "@/lib/locations-data";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink 
} from "lucide-react";

interface LocationPageTemplateProps {
  location: LocationData;
}

export function LocationPageTemplate({ location }: LocationPageTemplateProps) {
  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F]">
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

      {/* 2. Local Industries */}
      <section className="py-16 md:py-24 bg-white text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
              LOCAL ECONOMIC FOCUS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0F]">
              Industries We Serve in {location.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto">
              Bespoke digital architecture engineered to solve the operational realities of {location.name}&apos;s key business sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {location.localIndustries.map((ind) => (
              <div
                key={ind.title}
                className="bg-[#FFF9F4] rounded-2xl p-7 border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] mb-4 shadow-2xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B0B0F] mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {ind.description}
                  </p>
                </div>
                <div className="pt-4 mt-5 border-t border-[#E8E5E2] flex items-center justify-between text-[11px] text-[#FF5A00] font-bold">
                  <span>SPECIALIZED WORKFLOWS</span>
                  <span>ENGINEERED</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Real Business Problems vs Engineered Solutions */}
      <section className="py-16 md:py-24 bg-[#FFF9F4] text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
              CHALLENGES & SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0F]">
              Solving Bottlenecks for {location.name} Businesses
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto">
              We replace spreadsheet limitations, manual paperwork, and outdated websites with modern software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {location.businessProblems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E8E5E2] flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>THE BOTTLENECK</span>
                    </div>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {item.problem}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FFF3E9]/80 border border-[#FF5A00]/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FF5A00] mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>THE SOLUTION</span>
                    </div>
                    <p className="text-xs text-[#0B0B0F] leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>

                {"impact" in item && (
                  <div className="pt-4 mt-4 border-t border-[#E8E5E2]">
                    <span className="text-[11px] font-bold text-[#FF5A00]">
                      Impact: {(item as unknown as { impact: string }).impact}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Integrated Capabilities for Location */}
      <section className="py-14 bg-white border-b border-[#E8E5E2]">
        <Container>
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-bold text-[#FF5A00] uppercase tracking-wider">
              FULL-SERVICE DIGITAL PARTNER
            </span>
            <h3 className="text-2xl font-bold text-[#0B0B0F]">
              Integrated Capabilities for {location.name}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto text-center">
            <Link href="/website-development" className="p-4 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors">
              <span className="text-xs font-bold text-[#0B0B0F] block mb-1">Websites</span>
              <span className="text-[10px] text-[#4B5563]">Next.js &amp; E-commerce</span>
            </Link>
            <Link href="/custom-software-development" className="p-4 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors">
              <span className="text-xs font-bold text-[#0B0B0F] block mb-1">Software</span>
              <span className="text-[10px] text-[#4B5563]">ERP, CRM &amp; Mobile</span>
            </Link>
            <Link href="/social-media-management" className="p-4 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors">
              <span className="text-xs font-bold text-[#0B0B0F] block mb-1">Social Media</span>
              <span className="text-[10px] text-[#4B5563]">Instagram &amp; LinkedIn</span>
            </Link>
            <Link href="/content-creation" className="p-4 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors">
              <span className="text-xs font-bold text-[#0B0B0F] block mb-1">Video &amp; Creative</span>
              <span className="text-[10px] text-[#4B5563]">Reels &amp; Brand GFX</span>
            </Link>
            <Link href="/digital-marketing" className="p-4 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-[#0B0B0F] block mb-1">Marketing</span>
              <span className="text-[10px] text-[#4B5563]">Leads &amp; Meta Ads</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. Nearby Service Areas */}
      <section className="py-12 bg-[#FFF9F4] border-b border-[#E8E5E2]">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-lg font-bold text-[#0B0B0F]">
              Nearby Areas We Serve
            </h3>
            <p className="text-xs text-[#4B5563]">
              In addition to {location.name}, KASH Technology serves enterprises throughout Delhi NCR and Western Uttar Pradesh.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {location.nearbyAreas.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E5E2] hover:border-[#FF5A00] text-xs text-[#4B5563] hover:text-[#FF5A00] transition-colors flex items-center gap-1"
                >
                  <span>{area.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Localized FAQs */}
      <FaqAccordion
        variant="ivory"
        faqs={location.faqs}
        title={`Frequently Asked Questions — ${location.name}`}
        badge={`FAQS FOR ${location.name.toUpperCase()}`}
      />

      {/* 7. Conversion Banner */}
      <CtaBanner
        headline={`Serving Businesses in ${location.name}`}
        subtext="Schedule a direct technical consultation with our team today."
        primaryButtonText="Discuss Your Project"
        primaryButtonHref="/contact"
      />
    </div>
  );
}
