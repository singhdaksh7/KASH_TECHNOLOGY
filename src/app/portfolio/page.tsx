import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { CaseStudyComparison } from "@/components/sections/CaseStudyComparison";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Portfolio — Selected Work & Case Studies | KASH Technology",
  description: "Explore our recent web platforms, custom apps, software systems, and creative digital projects engineered for business growth.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroDiagonal
        badge="OUR SELECTED WORK"
        titlePrimary="Our Work."
        titleAccent="Your Next Growth Milestone."
        description="Explore products, platforms, and digital solutions built for real business impact."
        primaryCtaText="Discuss Your Project"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Services"
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
