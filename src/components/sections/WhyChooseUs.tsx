import React from "react";
import { 
  Award, 
  Zap, 
  Users, 
  Headphones 
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface Pillar {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const HOME_PILLARS: Pillar[] = [
  {
    title: "End-to-End Expertise",
    description: "Technology, creative and growth — all handled seamlessly by one unified team.",
    icon: Award,
  },
  {
    title: "Business-Focused Approach",
    description: "Solutions designed specifically for real, measurable commercial results.",
    icon: Zap,
  },
  {
    title: "Transparent & Collaborative",
    description: "Clear communication, regular milestone updates and complete operational visibility.",
    icon: Users,
  },
  {
    title: "Long-Term Support",
    description: "We don't just launch — we help you grow, scale and succeed continuously.",
    icon: Headphones,
  },
];

export const SERVICES_PILLARS: Pillar[] = HOME_PILLARS;
export const SOLUTIONS_PILLARS: Pillar[] = HOME_PILLARS;

interface WhyChooseUsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  pillars?: Pillar[];
}

export function WhyChooseUs({
  badge = "WHY CHOOSE KASH TECHNOLOGY",
  title = "More Than a Service Provider — We're Your Digital Growth Partner",
  subtitle = "Everything required to build, launch and scale your business online under one roof.",
  pillars = HOME_PILLARS,
}: WhyChooseUsProps) {
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

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group bg-[#FFF9F4] rounded-2xl p-6 border border-[#E8E5E2] hover:border-[#FF5A00]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs group-hover:bg-[#FF5A00] group-hover:text-white transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
