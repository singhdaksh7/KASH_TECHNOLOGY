import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface CtaBannerProps {
  headline?: string;
  subtext?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  // Legacy / page-compatibility props:
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: string;
  emblemPosition?: string;
  showMailIcon?: boolean;
}

export function CtaBanner({
  headline,
  subtext,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText = "Get a Free Audit",
  secondaryButtonHref = "/contact?type=audit",
  // Legacy mappings:
  title,
  subtitle,
  buttonText,
  buttonHref,
}: CtaBannerProps) {
  const finalHeadline = headline || title || "Ready to Build, Create\nand Grow Your Business?";
  const finalSubtext = subtext || subtitle || "Let's discuss your goals and create a digital plan that actually works for your business.";
  const finalPrimaryText = primaryButtonText || buttonText || "Start Your Project";
  const finalPrimaryHref = primaryButtonHref || buttonHref || "/contact";

  return (
    <section className="relative overflow-hidden py-14 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white">
      {/* Subtle diagonal background sheen */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <Container className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center lg:text-left max-w-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight whitespace-pre-line leading-tight">
            {finalHeadline}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            {finalSubtext}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            href={secondaryButtonHref}
            className="px-5 py-2.5 rounded-lg bg-white text-[#0B0B0F] font-bold text-xs sm:text-sm hover:bg-[#FFF3E9] transition-all shadow-md"
          >
            {secondaryButtonText} &rarr;
          </Link>
          <Link
            href={finalPrimaryHref}
            className="px-5 py-2.5 rounded-lg bg-[#0B0B0F] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-md"
          >
            {finalPrimaryText}
          </Link>
        </div>
      </Container>
    </section>
  );
}
