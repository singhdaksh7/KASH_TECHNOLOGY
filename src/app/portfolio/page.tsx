import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { CaseStudyComparison } from "@/components/sections/CaseStudyComparison";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Portfolio — Selected Systems & Case Studies | KASH Technology",
  description: "Explore our recent enterprise ERPs, e-commerce applications, CRM platforms, and custom software systems built with precision.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroDiagonal
        titlePrimary="Our Work."
        titleAccent="Your Next Success Story."
        description="Explore products and solutions built for real business needs."
        primaryCtaText="Discuss Your Project"
        primaryCtaHref="/contact"
        secondaryCtaText="View Our Services"
        secondaryCtaHref="/services"
      />

      {/* 2. Filterable Portfolio Grid on Ivory */}
      <PortfolioGrid showFilters={true} />

      {/* 3. Featured Case Study on Dark */}
      <CaseStudyComparison />

      {/* 4. What Our Clients Say on Ivory */}
      <Testimonials />

      {/* 5. Bottom CTA Banner matching screenshot */}
      <CtaBanner
        variant="ivory"
        title="Ready to Build Your Success Story?"
        subtitle="Let's create something powerful together."
        buttonText="Discuss Your Project"
        buttonHref="/contact"
        emblemPosition="left"
      />
    </>
  );
}
