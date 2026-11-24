import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ServiceScrollShowcase } from "@/components/sections/ServiceScrollShowcase";
import { AgencyPillars } from "@/components/sections/AgencyPillars";
import { WhyChooseUs, HOME_PILLARS } from "@/components/sections/WhyChooseUs";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { ProcessSteps, HOME_STEPS } from "@/components/sections/ProcessSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

function Home() {
  return (
    <>
      {/* 1. Hero matching full-service digital agency positioning */}
      <HeroDiagonal
        badge="TECHNOLOGY • CREATIVE • GROWTH"
        titlePrimary="We Build. We Create."
        titleAccent="We Grow."
        description="From websites, apps, and custom software to social media, video content, and digital marketing — KASH Technology helps businesses build their presence and grow online."
        primaryCtaText="Start Your Project"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Our Work"
        secondaryCtaHref="/portfolio"
      />

      {/* 2. Sticky Scroll-Driven Services Showcase */}
      <ServiceScrollShowcase />

      {/* 3. Three Agency Pillars: BUILD, CREATE, GROW */}
      <AgencyPillars />

      {/* 4. Why Choose Us on Dark */}
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

// CMS progressive migration: a published CMS page for this path wins; otherwise the page above renders unchanged.
const cmsRoute = createCmsRoute({ path: "/", pageType: "home", Fallback: Home });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
