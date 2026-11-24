import React from "react";
import { Container } from "@/components/ui/Container";

const TECH_ITEMS = [
  { name: "React", letter: "⚛" },
  { name: "Next.js", letter: "▲" },
  { name: "TypeScript", letter: "TS" },
  { name: "Node.js", letter: "⬡" },
  { name: "Python", letter: "🐍" },
  { name: "PostgreSQL", letter: "🐘" },
  { name: "AWS", letter: "☁" },
  { name: "Docker", letter: "🐳" },
  { name: "Flutter", letter: "◈" },
  { name: "Tailwind CSS", letter: "🌊" },
  { name: "Figma", letter: "❖" },
  { name: "Google Analytics & Ads", letter: "📊" },
];

export function TechStackStrip() {
  return (
    <section className="py-12 bg-white border-b border-[#E8E5E2] relative overflow-hidden">
      <Container className="relative z-10">
        <div className="text-center mb-6">
          <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
            TECHNOLOGY WE WORK WITH
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
          {TECH_ITEMS.map((item) => (
            <div
              key={item.name}
              className="px-4 py-2 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center gap-2 cursor-default select-none group"
            >
              <span className="text-xs text-[#FF5A00] font-bold">{item.letter}</span>
              <span className="text-xs font-semibold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
