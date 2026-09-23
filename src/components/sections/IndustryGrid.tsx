import React from "react";
import { HeartPulse, Building, GraduationCap, ShoppingBag, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";

const INDUSTRIES = [
  {
    title: "Healthcare",
    description: "Digital healthcare solutions.",
    icon: HeartPulse,
  },
  {
    title: "Real Estate",
    description: "CRM and property workflows.",
    icon: Building,
  },
  {
    title: "Education",
    description: "ERP and learning platforms.",
    icon: GraduationCap,
  },
  {
    title: "Retail",
    description: "Commerce and inventory tools.",
    icon: ShoppingBag,
  },
  {
    title: "Finance",
    description: "Secure financial systems.",
    icon: Landmark,
  },
];

export function IndustryGrid() {
  return (
    <section className="py-16 md:py-20 bg-[#050708] text-white relative overflow-hidden border-b border-white/10">
      <CircuitBackground variant="dark" />

      {/* Subtle Orange Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
          <path d="M 0 50 L 150 50 L 250 150 L 950 150 L 1050 50 L 1200 50" stroke="#f36b21" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
            INDUSTRY EXPERTISE
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-white">
            Built for Your Industry
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {INDUSTRIES.map((ind) => {
            const IconComponent = ind.icon;
            return (
              <div
                key={ind.title}
                className="group bg-[#0b0d0e] rounded-2xl p-5 border border-white/10 hover:border-[#f36b21]/50 shadow-xl transition-all duration-200 flex flex-col items-start text-left hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f36b21]/10 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] mb-4 group-hover:bg-[#f36b21] group-hover:text-white transition-all duration-200 shadow-[0_0_12px_rgba(243,107,33,0.12)]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#f36b21] transition-colors">
                  {ind.title}
                </h3>
                <p className="text-xs text-[#9ca3af] leading-normal">
                  {ind.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
