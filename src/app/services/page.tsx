import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ServiceCardsGrid } from "@/components/sections/ServiceCardsGrid";
import { ProcessSteps, SERVICES_STEPS } from "@/components/sections/ProcessSteps";
import { TechStackStrip } from "@/components/sections/TechStackStrip";
import { WhyChooseUs, SERVICES_PILLARS } from "@/components/sections/WhyChooseUs";
import { FaqAccordion, SERVICES_FAQS } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Services — Custom Technology Services for Growing Businesses | KASH Technology",
  description: "End-to-end technology services: Web Development, Mobile Apps, Custom Software, AI Automation, ERP / CRM Systems, E-commerce Solutions, API Integrations, and Cloud Deployment.",
};

export default function ServicesPage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroDiagonal
        badge="OUR SERVICES"
        titlePrimary="Custom Technology"
        titleAccent="for Growing Businesses"
        description="Web, apps, automation and software built around your business."
        primaryCtaText="Start Your Project"
        primaryCtaHref="/contact"
        secondaryCtaText="View Our Work"
        secondaryCtaHref="/portfolio"
      />

      {/* 2. Technology Services (8 cards on Ivory) */}
      <ServiceCardsGrid
        badge="WHAT WE DO"
        title="Technology Services"
        limit={8}
        columns={4}
      />

      {/* 3. How We Work on Dark */}
      <ProcessSteps
        badge="OUR PROCESS"
        title="How We Work"
        steps={SERVICES_STEPS}
        variant="dark"
      />

      {/* 4. Technology We Work With */}
      <TechStackStrip />

      {/* 5. Why Clients Choose Us on Dark */}
      <WhyChooseUs
        badge="WHY CLIENTS CHOOSE US"
        title="Why KASH"
        pillars={SERVICES_PILLARS}
      />

      {/* 6. Frequently Asked Questions on Ivory */}
      <FaqAccordion
        badge="FREQUENTLY ASKED QUESTIONS"
        title="Frequently Asked Questions"
        faqs={SERVICES_FAQS}
        columns={2}
        variant="ivory"
      />

      {/* 7. Bottom CTA Banner */}
      <CtaBanner
        variant="dark"
        title="Ready to Transform Your Business?"
        subtitle="Let's build a custom solution that drives growth, efficiency, and innovation."
        buttonText="Book a Consultation"
        buttonHref="/contact"
        emblemPosition="right"
      />
    </>
  );
}
