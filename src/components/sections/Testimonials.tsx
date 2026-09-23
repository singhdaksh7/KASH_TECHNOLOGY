import React from "react";
import { Container } from "@/components/ui/Container";
import { Star, ChevronLeft, ChevronRight, User } from "lucide-react";

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Rahul Mehta",
    role: "CFO",
    company: "FinServe Ltd. (FinTrack ERP)",
    quote: "Delivered our ERP on schedule with exceptional engineering quality.",
    stars: 5,
  },
  {
    name: "Neha Sharma",
    role: "Founder",
    company: "ShopEase (Mobile App)",
    quote: "Fast, reliable execution with great communication throughout.",
    stars: 5,
  },
  {
    name: "Dr. Amit Verma",
    role: "Director",
    company: "HealthPlus (CRM System)",
    quote: "Streamlined our operations and patient workflows seamlessly.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
      <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
            CASE STUDY FEEDBACK
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
            Project Stakeholder Reviews
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Left Arrow */}
          <button 
            type="button"
            aria-label="Previous Testimonial"
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-black/10 items-center justify-center text-[#6b7280] hover:text-[#f36b21] hover:border-[#f36b21] transition-all shadow-sm z-20 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(243,107,33,0.1)] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar & User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0e0e12] border border-[#f36b21]/30 flex items-center justify-center text-white shrink-0 overflow-hidden shadow-inner">
                      <User className="w-4 h-4 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="font-serif-heading text-sm sm:text-base font-bold text-[#111827]">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[#6b7280]">
                        {item.role}, {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#4b5563] leading-normal italic mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 pt-2.5 border-t border-black/5 text-[#f36b21]">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#f36b21]" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            type="button"
            aria-label="Next Testimonial"
            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-black/10 items-center justify-center text-[#6b7280] hover:text-[#f36b21] hover:border-[#f36b21] transition-all shadow-sm z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
