import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ServiceCardsGrid } from "@/components/sections/ServiceCardsGrid";
import { WhyChooseUs, HOME_PILLARS } from "@/components/sections/WhyChooseUs";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { ProcessSteps, HOME_STEPS } from "@/components/sections/ProcessSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function Home() {
  return (
    <>
      {/* 1. Hero matching media_1790146926985.jpg */}
      <HeroDiagonal
        titlePrimary="Custom Apps, Websites"
        titleSecondary="& Business Solutions"
        titleAccent="That Scale"
        description="Web, mobile, ERP, CRM and AI solutions built for growing businesses."
        primaryCtaText="Start Your Project"
        primaryCtaHref="/contact"
        secondaryCtaText="View Services"
        secondaryCtaHref="/services"
      />

      {/* 2. Services Overview (6 cards on Ivory) */}
      <ServiceCardsGrid
        badge="OUR SERVICES"
        title="Everything Your Business Needs"
        limit={6}
        columns={3}
      />

      {/* 3. Why Choose Us on Dark */}
      <WhyChooseUs
        badge="WHY CHOOSE US"
        title="Built Around Your Business"
        pillars={HOME_PILLARS}
      />

      {/* 4. Our Work on Ivory */}
      <div className="bg-[#fbf8f2] pt-16 border-b border-black/5 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center px-6 mb-2 space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
            OUR WORK
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
            Selected Work
          </h2>
        </div>
        <PortfolioGrid limit={3} showFilters={false} />
      </div>

      {/* 5. Our Process on Dark */}
      <ProcessSteps
        badge="OUR PROCESS"
        title="From Idea to Launch"
        steps={HOME_STEPS}
        variant="dark"
      />

      {/* 6. Conversion Banner on Ivory */}
      <CtaBanner
        variant="ivory"
        title="Ready to Build?"
        subtitle="Let's turn your idea into a scalable digital product."
        buttonText="Start Your Project"
        buttonHref="/contact"
        emblemPosition="left"
      />
    </>
  );
}
