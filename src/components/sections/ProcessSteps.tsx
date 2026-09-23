import React from "react";
import { Search, PenTool, Code2, Rocket, FileText, Headphones } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";

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
    description: "Understand your needs.",
  },
  {
    number: "02",
    title: "Design",
    description: "Plan the solution.",
  },
  {
    number: "03",
    title: "Build",
    description: "Develop and test.",
  },
  {
    number: "04",
    title: "Launch",
    description: "Deploy and support.",
  },
];

export const SERVICES_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the requirement.",
    icon: Search,
  },
  {
    number: "02",
    title: "Design",
    description: "Plan the right solution.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Build",
    description: "Develop and integrate.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch",
    description: "Deploy and support.",
    icon: Rocket,
  },
];

export const ABOUT_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the challenge.",
    icon: Search,
  },
  {
    number: "02",
    title: "Plan",
    description: "Define the strategy.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Build",
    description: "Develop and test.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Deploy",
    description: "Launch securely.",
    icon: Rocket,
  },
  {
    number: "05",
    title: "Support",
    description: "Maintain and scale.",
    icon: Headphones,
  },
];

interface ProcessStepsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  variant?: "dark" | "ivory";
}

export function ProcessSteps({
  badge = "OUR PROCESS",
  title = "From Idea to Launch",
  subtitle,
  steps = HOME_STEPS,
  variant = "dark",
}: ProcessStepsProps) {
  const isDark = variant === "dark";

  return (
    <section 
      className={`py-16 md:py-20 relative overflow-hidden border-b ${
        isDark 
          ? "bg-[#050708] text-white border-white/10" 
          : "bg-[#fbf8f2] text-[#111827] border-black/5"
      }`}
    >
      {/* Background Texture */}
      {isDark ? (
        <CircuitBackground variant="dark" />
      ) : (
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />
      )}

      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          {badge && (
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              {badge}
            </span>
          )}
          <h2 className={`font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight ${isDark ? "text-white" : "text-[#111827]"}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm max-w-xl mx-auto pt-1 ${isDark ? "text-[#9ca3af]" : "text-[#6b7280]"}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Steps Container */}
        <div 
          className={`grid gap-6 ${
            steps.length === 5 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" 
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.number} 
                className={`relative flex flex-col items-center text-center group ${
                  !isDark 
                    ? "bg-white rounded-2xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all" 
                    : ""
                }`}
              >
                {/* Number Badge or Icon */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-serif-heading font-bold text-lg transition-all duration-300 ${
                    isDark 
                      ? "bg-[#0e0e12] border-2 border-[#f36b21] text-white shadow-[0_0_15px_rgba(243,107,33,0.25)] group-hover:scale-105" 
                      : "bg-[#f36b21]/10 border border-[#f36b21]/30 text-[#f36b21]"
                  }`}>
                    {IconComponent ? (
                      <IconComponent className="w-6 h-6 text-[#f36b21]" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                </div>

                {/* Number & Title */}
                <div className="space-y-1 mb-2">
                  <h3 className={`font-serif-heading text-lg sm:text-xl font-bold ${isDark ? "text-white group-hover:text-[#f36b21]" : "text-[#111827]"} transition-colors duration-200`}>
                    {IconComponent && (
                      <span className="text-xs font-mono font-bold text-[#f36b21] uppercase tracking-wider block mb-1">
                        {step.number}
                      </span>
                    )}
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className={`text-xs sm:text-sm leading-relaxed max-w-xs ${isDark ? "text-[#9ca3af]" : "text-[#6b7280]"}`}>
                  {step.description}
                </p>

                {/* Arrow to next item (desktop only) */}
                {idx < steps.length - 1 && isDark && (
                  <div className="hidden lg:block absolute top-7 -right-3 text-[#f36b21]/60 font-mono text-sm pointer-events-none">
                    &rarr;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
