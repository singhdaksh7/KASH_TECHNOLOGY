import React from "react";
import { Container } from "@/components/ui/Container";

export function TrustSection() {
  const items = ["SaaS", "Fintech", "Automation", "ERP", "AI Systems", "Web3", "Cloud Infrastructure"];

  return (
    <section className="border-y border-white/5 py-12 bg-[#050505] overflow-hidden relative">
      <div className="absolute inset-0 grid-pattern opacity-[0.01] pointer-events-none" />
      <Container className="flex items-center justify-center">
        <div className="w-full flex flex-wrap items-center justify-center lg:justify-between gap-y-4 gap-x-8 md:gap-x-10 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#8e9aa8] uppercase font-semibold">
          {items.map((item, index) => (
            <React.Fragment key={item}>
              <span className="hover:text-white transition-colors duration-200 cursor-default">
                {item}
              </span>
              {index < items.length - 1 && (
                <span className="hidden lg:inline text-white/10 select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
