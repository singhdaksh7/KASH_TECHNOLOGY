"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
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
    <section className="relative bg-[#FFF9F4] pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-[#E8E5E2]">
      {/* Diagonal Split Orange Panel on Right */}
      <div className="hidden lg:block hero-diagonal-bg" />
      <div className="hidden lg:block hero-diagonal-soft" />

      <Container className="relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[420px]">
          
          {/* Left Column: Eyebrow, Heading, Paragraph, Buttons */}
          <div className="lg:col-span-7 space-y-5 text-left max-w-2xl">
            {badge && (
              <div className="inline-block">
                <span className="text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
                  {badge}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B0B0F] leading-[1.15]">
              {titlePrimary}{" "}
              {titleSecondary && <span className="block">{titleSecondary}</span>}
              {titleAccent && (
                <span className="text-[#FF5A00] block">
                  {titleAccent}
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Orange Button */}
              {primaryCtaText && (
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5A00]/25 hover:brightness-105 active:scale-95 transition-all"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {/* Secondary White Button */}
              {secondaryCtaText && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E8E5E2] text-[#0B0B0F] text-xs sm:text-sm font-bold hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors active:scale-95 shadow-2xs"
                >
                  <span>{secondaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#FF5A00]" />
                </Link>
              )}
            </div>

            {quickLinks && quickLinks.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#4B5563]">
                <span className="text-[#0B0B0F] uppercase tracking-wider font-bold">Services:</span>
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-[#FF5A00] underline underline-offset-4 decoration-[#E8E5E2] hover:decoration-[#FF5A00] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {locationChips && locationChips.length > 0 && (
              <div className="pt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#0B0B0F] uppercase tracking-wider font-bold mr-1">
                  Locations:
                </span>
                {locationChips.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E8E5E2] hover:border-[#FF5A00] text-[11px] text-[#4B5563] hover:text-[#FF5A00] transition-all"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Laptop Mockup */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
              <Image
                src="/images/hero/hero-laptop-composition.png"
                alt="KASH Technology Engineering"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
