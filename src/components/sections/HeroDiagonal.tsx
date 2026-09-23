"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TechEmblem } from "@/components/branding/TechEmblem";
import { CircuitBackground } from "@/components/branding/CircuitBackground";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/Breadcrumbs";

interface HeroDiagonalProps {
  badge?: string;
  titlePrimary: string;
  titleAccent?: string;
  titleSecondary?: string;
  description: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  quickLinks?: { label: string; href: string }[];
  locationChips?: { label: string; href: string }[];
}

export function HeroDiagonal({
  badge,
  titlePrimary,
  titleAccent,
  titleSecondary,
  description,
  primaryCtaText = "Start Your Project",
  primaryCtaHref = "/contact",
  secondaryCtaText = "View Services",
  secondaryCtaHref = "/services",
  breadcrumbs,
  quickLinks,
  locationChips,
}: HeroDiagonalProps) {
  return (
    <section className="relative bg-[#050708] pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-white/10">
      {/* Background Circuit Texture */}
      <CircuitBackground variant="dark" />

      {/* Diagonal Split Ivory Panel on Right */}
      <div 
        className="absolute top-0 right-0 w-full lg:w-[48%] h-full bg-[#fbf8f2] pointer-events-none hidden lg:block"
        style={{
          clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        <div className="absolute inset-0 circuit-pattern-ivory opacity-50" />
      </div>

      {/* Decorative Accent Circuit Line Over Hero */}
      <svg
        className="absolute top-1/4 left-1/3 w-1/3 h-1/2 pointer-events-none hidden lg:block opacity-40"
        viewBox="0 0 300 150"
        fill="none"
      >
        <path d="M 0 50 L 120 50 L 160 10 L 260 10" stroke="#f36b21" strokeWidth="1.5" />
        <circle cx="260" cy="10" r="3" fill="#f36b21" />
      </svg>

      <Container className="relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[460px]">
          
          {/* Left Column: Eyebrow, Heading, Paragraph, Buttons */}
          <div className="lg:col-span-7 space-y-5 text-left max-w-2xl">
            {badge && (
              <div className="inline-block">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase">
                  {badge}
                </span>
              </div>
            )}

            <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.14]">
              {titlePrimary}{" "}
              {titleSecondary && <span className="block">{titleSecondary}</span>}
              {titleAccent && (
                <span className="text-[#f36b21] block font-serif-heading">
                  {titleAccent}
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Orange Button */}
              {primaryCtaText && (
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_6px_20px_rgba(243,107,33,0.35)] hover:shadow-[0_8px_25px_rgba(243,107,33,0.5)] active:scale-95"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {/* Secondary Dark Outline Button */}
              {secondaryCtaText && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0e0e12] hover:bg-white/10 text-white text-xs sm:text-sm font-semibold border border-white/20 hover:border-white/40 transition-all active:scale-95"
                >
                  <span>{secondaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </Link>
              )}
            </div>

            {quickLinks && quickLinks.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-white/50">
                <span className="text-[#c5a880] uppercase tracking-wider font-semibold">Services:</span>
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-[#f36b21] underline underline-offset-4 decoration-white/20 hover:decoration-[#f36b21] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {locationChips && locationChips.length > 0 && (
              <div className="pt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-[#c5a880] uppercase tracking-wider font-semibold mr-1">
                  Locations:
                </span>
                {locationChips.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 hover:border-[#f36b21]/50 hover:bg-white/[0.08] text-[11px] font-mono text-white/70 hover:text-white transition-all"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Circular Technical Emblem */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <TechEmblem size={460} />
          </div>

        </div>
      </Container>
    </section>
  );
}
