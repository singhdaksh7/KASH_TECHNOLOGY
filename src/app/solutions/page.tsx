import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { IndustryGrid } from "@/components/sections/IndustryGrid";
import { WhyChooseUs, SOLUTIONS_PILLARS } from "@/components/sections/WhyChooseUs";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Rocket, Cog, Building2, ShoppingCart, BrainCircuit, Wrench, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions — Technology That Scales | KASH Technology",
  description: "Custom software solutions: Startup MVPs, Business Automation, ERP / CRM, E-commerce Platforms, AI Solutions, and Internal Tools tailored to your industry.",
};

const SOLUTION_CATEGORIES = [
  {
    title: "Startup MVPs",
    description: "Launch and validate faster.",
    icon: Rocket,
  },
  {
    title: "Business Automation",
    description: "Reduce manual work.",
    icon: Cog,
  },
  {
    title: "ERP / CRM",
    description: "Manage your business in one place.",
    icon: Building2,
  },
  {
    title: "E-commerce",
    description: "Sell online at scale.",
    icon: ShoppingCart,
  },
  {
    title: "AI Solutions",
    description: "Automate smarter workflows.",
    icon: BrainCircuit,
  },
  {
    title: "Internal Tools",
    description: "Software built for your team.",
    icon: Wrench,
  },
];

const APPROACH_STEPS = [
  {
    number: "01",
    title: "Understand",
    description: "Know the challenge.",
  },
  {
    number: "02",
    title: "Plan",
    description: "Choose the approach.",
  },
  {
    number: "03",
    title: "Build",
    description: "Develop the solution.",
  },
  {
    number: "04",
    title: "Test",
    description: "Validate quality.",
  },
  {
    number: "05",
    title: "Launch",
    description: "Deploy and support.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* 1. Hero matching media_1790146913721.jpg */}
      <HeroDiagonal
        titlePrimary="Solutions That Solve."
        titleSecondary="Technology That Scales."
        titleAccent="Built Around Your Business."
        description="Custom solutions for real business challenges."
        primaryCtaText="Explore Solutions"
        primaryCtaHref="#solution-categories"
        secondaryCtaText="Talk to an Expert"
        secondaryCtaHref="/contact"
      />

      {/* 2. Solution Categories (6 cards on Ivory) */}
      <section id="solution-categories" className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              OUR SOLUTIONS
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
              Solution Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {SOLUTION_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="group bg-white rounded-2xl p-6 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(243,107,33,0.1)] hover:border-[#f36b21]/40 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
                >
                  <div>
                    {/* Simulated Laptop Frame */}
                    <div className="mb-4 rounded-xl bg-[#0b0d0e] border border-black/10 p-2.5 aspect-[16/9] flex flex-col justify-between shadow-inner">
                      <div className="flex items-center gap-1.5 border-b border-white/10 pb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f36b21]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="ml-auto text-[7px] font-mono text-white/30">KASH SYSTEM</span>
                      </div>
                      <div className="flex items-center justify-center flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#f36b21]/15 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] group-hover:scale-105 transition-transform">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[7px] font-mono text-white/40 border-t border-white/5 pt-1">
                        <span>ONLINE</span>
                        <span className="text-[#f36b21]">SECURE</span>
                      </div>
                    </div>

                    <h3 className="font-serif-heading text-lg font-bold text-[#111827] mb-1 group-hover:text-[#f36b21] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6b7280] leading-normal mb-4">
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#f36b21] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Request Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Industry Expertise on Dark */}
      <IndustryGrid />

      {/* 4. Our Approach (5 steps on Ivory) */}
      <section className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              OUR APPROACH
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
              From Problem to Solution
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {APPROACH_STEPS.map((s) => (
              <div
                key={s.number}
                className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f36b21]/10 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] font-bold text-xs mb-3 mx-auto font-mono">
                    {s.number}
                  </div>
                  <h3 className="font-serif-heading text-base font-bold text-[#111827] mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#6b7280] leading-normal">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Why Choose KASH Technology on Dark */}
      <WhyChooseUs
        badge="WHY CHOOSE KASH TECHNOLOGY"
        title="Solutions That Deliver Real Impact"
        pillars={SOLUTIONS_PILLARS}
      />

      {/* 6. Bottom CTA Banner */}
      <CtaBanner
        variant="ivory"
        title="Ready to Build the Right Solution?"
        subtitle="Let's create something powerful together."
        buttonText="Book a Consultation"
        buttonHref="/contact"
        emblemPosition="left"
      />
    </>
  );
}
