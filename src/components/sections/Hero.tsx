"use client";

import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { HeroProductComposition } from "@/components/hero/HeroProductComposition";
import { ConsultationCTA } from "@/components/conversion/ConsultationCTA";
import { trackEvent } from "@/lib/analytics";
import { useConsultation } from "@/components/conversion/ConsultationContext";

export function Hero() {
  const { setLeadSource } = useConsultation();

  return (
    <section className="min-h-[100dvh] pt-32 pb-20 flex flex-col justify-center relative px-4 sm:px-8 overflow-hidden max-w-[1440px] mx-auto bg-black">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Main Two-Column Layout */}
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-6 z-10 w-full relative">
        {/* Left Side: Headline & Copy */}
        <div className="flex-1 max-w-2xl text-center xl:text-left pt-6 xl:pt-10">
          <Reveal>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[76px] font-black tracking-tight text-foreground mb-8 leading-[1.1] sm:leading-[1.05]">
              From an idea to a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500">
                production-ready
              </span>{" "}
              digital product.
            </h1>
          </Reveal>
          
          <Reveal delay={0.15}>
            {/* Supporting Copy with Thin Blue Accent Line */}
            <div className="pl-4 sm:pl-6 border-l-2 border-blue-500/80 my-8 text-left max-w-xl mx-auto xl:mx-0">
              <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
                We build secure SaaS platforms, business automation systems, fintech products, ERP solutions and blockchain applications that scale with your vision.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row xl:flex-row items-center gap-4 justify-center xl:justify-start mt-10">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <LinkButton
                  href="/#work"
                  onClick={() => {
                    setLeadSource("Homepage Hero");
                    trackEvent("cta_click", { location: "hero", label: "explore_work" });
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] text-base sm:text-lg border border-blue-500 flex items-center justify-center gap-2 group w-full sm:w-auto min-h-[44px]"
                >
                  Explore Our Work
                  <span className="inline-block transition-transform group-hover:translate-x-1 duration-200">
                    &rarr;
                  </span>
                </LinkButton>
                <LinkButton
                  href="/#contact"
                  onClick={() => {
                    setLeadSource("Homepage Hero");
                    trackEvent("cta_click", { location: "hero", label: "start_project" });
                  }}
                  variant="outline"
                  className="px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold backdrop-blur-md transition-all text-base sm:text-lg border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 flex items-center justify-center gap-2 group w-full sm:w-auto min-h-[44px]"
                >
                  Start a Project
                  <span className="inline-block transition-transform group-hover:translate-x-1 duration-200">
                    &rarr;
                  </span>
                </LinkButton>
              </div>
              <ConsultationCTA variant="hero" className="w-full sm:w-auto" />
            </div>
          </Reveal>
        </div>

        {/* Right Side: Product Composition */}
        <div className="flex-1 w-full flex items-center justify-center relative min-h-[420px] sm:min-h-[500px] lg:min-h-[600px] overflow-visible">
          <HeroProductComposition />
        </div>
      </div>
    </section>
  );
}
