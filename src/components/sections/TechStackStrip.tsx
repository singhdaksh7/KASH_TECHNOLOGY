import React from "react";
import { Container } from "@/components/ui/Container";

const TECH_ITEMS = [
  { name: "React", iconColor: "#61DAFB", letter: "⚛" },
  { name: "Next.js", iconColor: "#000000", letter: "▲" },
  { name: "Angular", iconColor: "#DD0031", letter: "🅰" },
  { name: "Node.js", iconColor: "#339933", letter: "⬡" },
  { name: "Python", iconColor: "#3776AB", letter: "🐍" },
  { name: "Laravel", iconColor: "#FF2D20", letter: "❖" },
  { name: "PHP", iconColor: "#777BB4", letter: "🐘" },
  { name: "AWS", iconColor: "#FF9900", letter: "☁" },
  { name: "Docker", iconColor: "#2496ED", letter: "🐳" },
  { name: "MongoDB", iconColor: "#47A248", letter: "🍃" },
  { name: "MySQL", iconColor: "#4479A1", letter: "🐬" },
  { name: "Flutter", iconColor: "#02569B", letter: "◈" },
];

export function TechStackStrip() {
  return (
    <section className="py-12 bg-white border-b border-black/5 relative overflow-hidden">
      <Container className="relative z-10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase">
            TECHNOLOGY WE WORK WITH
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
          {TECH_ITEMS.map((item) => (
            <div
              key={item.name}
              className="px-4 py-2 rounded-xl bg-[#fbf8f2] border border-black/5 hover:border-[#f36b21]/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2.5 cursor-default select-none group"
            >
              <span className="text-sm">{item.letter}</span>
              <span className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#f36b21] transition-colors font-sans">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
