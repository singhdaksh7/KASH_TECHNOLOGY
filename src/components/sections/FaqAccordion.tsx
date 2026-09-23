"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface FaqItem {
  question: string;
  answer: string;
}

export const SERVICES_FAQS: FaqItem[] = [
  {
    question: "How do you ensure project quality?",
    answer: "We enforce strict type-safety, automated testing, continuous integration, and dedicated QA verification on every milestone before deployment.",
  },
  {
    question: "Can you work with our existing team?",
    answer: "Yes. We can integrate seamlessly with your existing designers, engineers, and product managers to accelerate roadmap delivery.",
  },
  {
    question: "What is your typical project timeline?",
    answer: "MVP products generally take 3 to 6 weeks, while enterprise software platforms and custom ERPs range between 2 to 4 months.",
  },
  {
    question: "What information do you need to start?",
    answer: "A high-level summary of your project goals, target audience, and key features. We will help refine the technical roadmap together.",
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes, we offer ongoing maintenance, monitoring, security updates, and feature enhancement support after product launch.",
  },
  {
    question: "How do you handle project pricing?",
    answer: "We offer transparent, milestone-based fixed pricing and dedicated sprint models with zero hidden surprises.",
  },
];

interface FaqAccordionProps {
  variant?: "ivory" | "dark";
  faqs?: FaqItem[];
  title?: string;
  badge?: string;
  columns?: 1 | 2;
}

export function FaqAccordion({
  variant = "ivory",
  faqs = SERVICES_FAQS,
  title = "Frequently Asked Questions",
  badge = "FREQUENTLY ASKED QUESTIONS",
  columns = 2,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isIvory = variant === "ivory";

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={`py-20 md:py-28 relative overflow-hidden border-b ${isIvory ? 'bg-[#fbf8f2] border-black/5 text-[#111827]' : 'bg-[#050708] border-white/10 text-white'}`}>
      <div className={`absolute inset-0 ${isIvory ? 'circuit-pattern-ivory opacity-35' : 'circuit-pattern-dark opacity-20'} pointer-events-none`} />

      <Container className="relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-2">
          {badge && (
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              {badge}
            </span>
          )}
          <h2 className={`font-serif-heading text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight ${isIvory ? 'text-[#111827]' : 'text-white'}`}>
            {title}
          </h2>
        </div>

        {/* 2-Column Accordion List */}
        <div className={columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-start" : "space-y-4"}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isIvory 
                    ? 'bg-white border-black/5 shadow-xs hover:border-[#f36b21]/30' 
                    : 'bg-[#0e0e12] border-white/5 shadow-md hover:border-[#f36b21]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 flex items-center justify-between text-left gap-4 select-none focus:outline-none focus:ring-1 focus:ring-[#f36b21] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-semibold ${isIvory ? 'text-[#111827]' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'text-[#f36b21]' : 'text-[#f36b21]'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-black/5">
                    <p className={`text-xs sm:text-sm leading-relaxed ${isIvory ? 'text-[#6b7280]' : 'text-[#9ca3af]'}`}>
                      {faq.answer}
                    </p>
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
