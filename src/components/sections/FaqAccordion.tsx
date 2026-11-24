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
    answer: "We enforce strict testing, clean code architectures, agile review cycles, and dedicated QA verification before every production launch.",
  },
  {
    question: "Can you work with our existing team?",
    answer: "Yes. We integrate seamlessly with your internal developers, designers, or marketing teams to accelerate execution.",
  },
  {
    question: "What is your typical project timeline?",
    answer: "Websites and MVPs generally take 2 to 4 weeks, while complex software and custom ERPs range between 6 to 12 weeks.",
  },
  {
    question: "What information do you need to start?",
    answer: "A high-level overview of your business goals, target audience and key requirements. We will help scope the project together.",
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes, we offer ongoing maintenance, server monitoring, security updates and growth iterations after launch.",
  },
  {
    question: "How do you handle project pricing?",
    answer: "We offer transparent milestone-based pricing and clear deliverables with zero hidden costs.",
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
  faqs = SERVICES_FAQS,
  title = "Frequently Asked Questions",
  badge = "FREQUENTLY ASKED QUESTIONS",
  columns = 2,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden border-b bg-[#FFF9F4] border-[#E8E5E2] text-[#0B0B0F]">
      <Container className="relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14 space-y-2">
          {badge && (
            <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0F]">
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
                className="rounded-2xl border border-[#E8E5E2] bg-white transition-all duration-200 overflow-hidden hover:border-[#FF5A00]/40 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 flex items-center justify-between text-left gap-4 select-none focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-[#0B0B0F]">
                    {faq.question}
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[#FF5A00]">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#E8E5E2]">
                    <p className="text-xs text-[#4B5563] leading-relaxed">
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
