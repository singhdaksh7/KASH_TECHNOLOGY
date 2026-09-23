import React from "react";
import { 
  Target, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Headphones, 
  Sliders, 
  Lock 
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";

export interface Pillar {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const HOME_PILLARS: Pillar[] = [
  {
    title: "Tailored",
    description: "Built for your exact needs.",
    icon: Target,
  },
  {
    title: "Affordable",
    description: "Practical solutions. Clear pricing.",
    icon: Award,
  },
  {
    title: "Scalable",
    description: "Ready to grow with you.",
    icon: TrendingUp,
  },
];

export const SERVICES_PILLARS: Pillar[] = [
  {
    title: "Tailored",
    description: "Built around your goals.",
    icon: Sliders,
  },
  {
    title: "Affordable",
    description: "Transparent pricing.",
    icon: Award,
  },
  {
    title: "Scalable",
    description: "Ready for future growth.",
    icon: TrendingUp,
  },
  {
    title: "Reliable",
    description: "Support when needed.",
    icon: Headphones,
  },
];

export const SOLUTIONS_PILLARS: Pillar[] = [
  {
    title: "Custom-Built",
    description: "Designed around your processes.",
    icon: Target,
  },
  {
    title: "Scalable",
    description: "Built to grow with your business.",
    icon: TrendingUp,
  },
  {
    title: "Secure & Reliable",
    description: "Enterprise-grade reliability.",
    icon: Lock,
  },
  {
    title: "Cost-Effective",
    description: "Maximum value. Clear pricing.",
    icon: Award,
  },
  {
    title: "Ongoing Support",
    description: "Support at every step.",
    icon: Headphones,
  },
];

interface WhyChooseUsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  pillars?: Pillar[];
}

export function WhyChooseUs({
  badge = "WHY CHOOSE US",
  title = "Built Around Your Business",
  subtitle,
  pillars = HOME_PILLARS,
}: WhyChooseUsProps) {
  const count = pillars.length;

  return (
    <section className="py-16 md:py-20 bg-[#050708] text-white relative overflow-hidden border-b border-white/10">
      {/* Background Circuit Texture */}
      <CircuitBackground variant="dark" />

      {/* Subtle Orange Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
          <path d="M 0 100 L 200 100 L 300 200 L 900 200 L 1000 100 L 1200 100" stroke="#f36b21" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          {badge && (
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              {badge}
            </span>
          )}
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#9ca3af] max-w-xl mx-auto pt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Column Grid */}
        <div 
          className={
            count === 3
              ? "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              : count === 4
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          }
        >
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group bg-[#0b0d0e] rounded-2xl p-6 border border-white/10 hover:border-[#f36b21]/40 shadow-xl transition-all duration-200 flex flex-col items-center text-center hover:-translate-y-0.5"
              >
                {/* Glowing Concentric Circular Icon */}
                <div className="relative w-14 h-14 rounded-full bg-[#f36b21]/10 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] mb-4 group-hover:bg-[#f36b21] group-hover:text-white transition-all duration-200 shadow-[0_0_12px_rgba(243,107,33,0.12)]">
                  <span className="absolute inset-[-3px] rounded-full border border-[#f36b21]/20 group-hover:border-[#f36b21]/40 transition-colors" />
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-serif-heading text-lg font-bold text-white mb-1.5 group-hover:text-[#f36b21] transition-colors duration-200">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#9ca3af] leading-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
