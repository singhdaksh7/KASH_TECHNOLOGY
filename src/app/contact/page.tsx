"use client";

import React, { useState } from "react";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ContactFormCard } from "@/components/sections/ContactFormCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Calendar, CheckCircle2, Plus, Minus, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const CONTACT_FAQS = [
  {
    q: "How quickly can you start my project?",
    a: "We usually begin architecture kickoff and sprint planning within 3–5 business days after initial scoping.",
  },
  {
    q: "What information do you need to get started?",
    a: "A high-level project summary and your business goals. We will guide you through the detailed requirements.",
  },
  {
    q: "How do you ensure project security?",
    a: "We follow industry-standard encryption, strict access control, secure cloud infrastructure, and NDA compliance.",
  },
  {
    q: "What is your typical project timeline?",
    a: "MVP deliveries range from 3 to 6 weeks, while enterprise software platforms typically span 2 to 4 months.",
  },
  {
    q: "Do you provide ongoing support?",
    a: "Yes, we provide 24/7 infrastructure monitoring, maintenance SLAs, and post-launch feature iterations.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      {/* 1. Hero */}
      <HeroDiagonal
        titlePrimary="Let's Build Something"
        titleAccent="Great Together"
        description="Tell us what you're building. We'll help make it happen."
        primaryCtaText="Start Your Project"
        primaryCtaHref="#contact-form"
        secondaryCtaText="Book a Call"
        secondaryCtaHref={SITE_CONFIG.bookingUrl}
      />

      {/* 2. Main Form & Info Section on Ivory */}
      <section id="contact-form" className="py-16 md:py-20 bg-[#fbf8f2] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <ContactFormCard />
        </Container>
      </section>

      {/* 3. Three Bottom Feature Cards on Ivory */}
      <section className="py-16 md:py-20 bg-[#fbf8f2] border-b border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Need to Talk? */}
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f36b21]/10 flex items-center justify-center text-[#f36b21]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#111827]">
                    Need to Talk?
                  </h3>
                </div>

                <p className="text-xs text-[#6b7280] leading-relaxed mb-4">
                  Book a quick project discussion with our engineering leads.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] text-[#4b5563]">
                  <div className="p-2 rounded-xl bg-[#fbf8f2] border border-black/5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f36b21] shrink-0" />
                    <span>Understand goals</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fbf8f2] border border-black/5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f36b21] shrink-0" />
                    <span>Explore options</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fbf8f2] border border-black/5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f36b21] shrink-0" />
                    <span>Tech advice</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fbf8f2] border border-black/5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f36b21] shrink-0" />
                    <span>No commitment</span>
                  </div>
                </div>
              </div>

              <a
                href={SITE_CONFIG.bookingUrl}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#f36b21] hover:bg-[#e05b14] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(243,107,33,0.35)]"
              >
                <span>Book a Call</span>
                <Calendar className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: Frequently Asked Questions */}
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-[#f36b21]/10 flex items-center justify-center text-[#f36b21] text-xs font-bold">?</span>
                  <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#111827]">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-1.5 mb-3">
                  {CONTACT_FAQS.slice(0, 4).map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={faq.q} className="border-b border-black/5 pb-1.5">
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full text-left flex items-center justify-between text-xs font-medium text-[#111827] hover:text-[#f36b21] py-1 cursor-pointer"
                        >
                          <span className="truncate pr-2">{faq.q}</span>
                          <span className="text-[#f36b21] text-sm font-bold shrink-0">
                            {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                        {isOpen && (
                          <p className="text-[11px] text-[#6b7280] pt-0.5 leading-relaxed">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/services#faqs"
                className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[#f36b21] hover:underline pt-1"
              >
                <span>View All FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Our Office */}
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f36b21]/10 flex items-center justify-center text-[#f36b21]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#111827]">
                    Our Office
                  </h3>
                </div>

                <p className="text-xs text-[#6b7280] leading-relaxed mb-3">
                  Visit us or collaborate with our engineering team remotely.
                </p>

                {/* Stylized Map View Graphic */}
                <div className="rounded-2xl bg-[#eef2f6] border border-black/10 p-3 h-32 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40">
                    <svg className="w-full h-full" viewBox="0 0 200 120">
                      <path d="M 0 30 L 200 60" stroke="#cbd5e1" strokeWidth="6" />
                      <path d="M 40 0 L 80 120" stroke="#cbd5e1" strokeWidth="4" />
                      <path d="M 120 0 L 160 120" stroke="#cbd5e1" strokeWidth="5" />
                      <path d="M 0 90 L 200 100" stroke="#e2e8f0" strokeWidth="8" />
                    </svg>
                  </div>
                  
                  {/* Pin Card overlay */}
                  <div className="relative z-10 bg-white rounded-xl p-2.5 shadow-md border border-black/10 text-center max-w-[190px]">
                    <span className="font-serif-heading text-xs font-bold text-[#111827] block">
                      KASH Technology
                    </span>
                    <span className="text-[10px] text-[#6b7280] block mt-0.5 leading-tight">
                      Serving clients across India &amp; internationally
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-[#6b7280] text-center font-mono">
                Remote &amp; On-Site Delivery Available
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 4. Bottom CTA Banner */}
      <CtaBanner
        variant="dark"
        title="Ready to Start Your Project?"
        subtitle="Tell us what you're building. We'll help make it happen."
        buttonText="Start Your Project"
        buttonHref="#contact-form"
        showMailIcon={true}
      />
    </>
  );
}
