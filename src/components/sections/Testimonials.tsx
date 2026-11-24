import React from "react";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, Target, Handshake } from "lucide-react";

export interface BenefitItem {
  title: string;
  description: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BENEFITS: BenefitItem[] = [
  {
    title: "One Digital Partner",
    description: "Technology, creative and growth services under one coordinated team. No scattered vendors, zero misaligned deliverables.",
    tag: "Coordinated Team",
    icon: ShieldCheck,
  },
  {
    title: "Built Around Your Business",
    description: "Solutions are designed around actual business workflows instead of forcing businesses into generic off-the-shelf software.",
    tag: "Custom Solutions",
    icon: Target,
  },
  {
    title: "Long-Term Support",
    description: "KASH supports businesses beyond launch as their operational needs evolve with direct engineering and marketing support.",
    tag: "Ongoing Partnership",
    icon: Handshake,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-2">
          <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
            WHY BUSINESSES CHOOSE KASH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0F]">
            One Digital Partner for Your Business
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            From custom software to branding and performance marketing — built around your real operational needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#FFF9F4] rounded-2xl p-6 border border-[#E8E5E2] hover:border-[#FF5A00]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-[#0B0B0F]">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E5E2] text-xs font-semibold text-[#FF5A00]">
                  {item.tag}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
