import React from "react";
import { Search, Lightbulb, Layers, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const HOME_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand your goals, challenges and requirements.",
    icon: Search,
  },
  {
    number: "02",
    title: "Plan",
    description: "Define the right strategy, solutions and timeline.",
    icon: Lightbulb,
  },
  {
    number: "03",
    title: "Build & Create",
    description: "Design, develop and create high-quality assets.",
    icon: Layers,
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "Go live, track results and keep optimizing for growth.",
    icon: Rocket,
  },
];

export const SERVICES_STEPS: ProcessStep[] = HOME_STEPS;
export const ABOUT_STEPS: ProcessStep[] = HOME_STEPS;

interface ProcessStepsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  variant?: "dark" | "ivory";
}

export function ProcessSteps({
  badge = "OUR PROCESS",
  title = "A Simple, Proven Process That Works.",
  subtitle = "A clear, collaborative and result-driven approach from idea to growth.",
  steps = HOME_STEPS,
}: ProcessStepsProps) {
  return (
    <section className="py-16 md:py-20 bg-white text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-2">
          {badge && (
            <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0F]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto pt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.title}
                className="p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-3 hover:border-[#FF5A00]/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                  {IconComponent ? <IconComponent className="w-5 h-5" /> : <span>{step.number}</span>}
                </div>
                <h3 className="text-base font-bold text-[#0B0B0F]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
