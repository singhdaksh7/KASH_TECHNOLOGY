"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { HeroProductComposition } from "@/components/hero/HeroProductComposition";
import { ConsultationCTA } from "@/components/conversion/ConsultationCTA";
import { trackEvent } from "@/lib/analytics";
import { useConsultation } from "@/components/conversion/ConsultationContext";

export function Hero() {
  const { setLeadSource } = useConsultation();
  const shouldReduceMotion = useReducedMotion();
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 8; // Max 4px movement in X
    const y = ((clientY - top) / height - 0.5) * 8; // Max 4px movement in Y
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-[90vh] lg:min-h-[95vh] pt-32 pb-20 flex items-center relative px-6 md:px-12 lg:px-16 overflow-hidden w-full max-w-[1520px] mx-auto bg-[#050505]"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 z-10 w-full relative">
        {/* Left Column: 40-43% width on desktop */}
        <div className="w-full lg:w-[42%] flex flex-col items-start text-left shrink-0">
          {/* Mono studio tag */}
          <span className="text-[10px] tracking-[0.25em] font-mono text-[#3b82f6] uppercase font-bold mb-6">
            KASH Technologies
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
            WE BUILD SOFTWARE
            <br className="hidden md:inline" />
            THAT BUSINESSES
            <br className="hidden md:inline" />
            RUN ON.
          </h1>

          <p className="text-[#8e9aa8] text-base md:text-lg max-w-md leading-relaxed mb-8">
            Product engineering for ambitious companies — from architecture to production.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <LinkButton
              href="/#contact"
              onClick={() => {
                setLeadSource("Homepage Hero");
                trackEvent("cta_click", { location: "hero", label: "start_project" });
              }}
              className="bg-primary text-white border border-primary/20 px-6 py-3 rounded-md text-xs font-semibold transition-all hover:bg-primary/95 flex items-center justify-center gap-2 h-10 min-h-[40px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
            >
              Start a Project
            </LinkButton>
            <LinkButton
              href="/#work"
              onClick={() => {
                setLeadSource("Homepage Hero");
                trackEvent("cta_click", { location: "hero", label: "explore_work" });
              }}
              variant="outline"
              className="border border-white/8 hover:border-white/20 text-white px-6 py-3 rounded-md text-xs font-semibold transition-all hover:bg-white/5 flex items-center justify-center gap-2 h-10 min-h-[40px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
            >
              Explore Our Work &rarr;
            </LinkButton>
          </div>

          {/* Consultation CTA */}
          <div className="mt-4">
            <ConsultationCTA variant="hero" className="w-full sm:w-auto !justify-start !px-0" />
          </div>

          {/* Restrained Engineering Status Row */}
          <div className="mt-8 flex items-center gap-3 text-[9px] tracking-[0.22em] font-mono text-[#8e9aa8] uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span>Systems Online</span>
            <span className="text-white/10">•</span>
            <span>03 Products</span>
            <span className="text-white/10">•</span>
            <span>Chennai / India</span>
          </div>
        </div>

        {/* Right Column: 57-60% width on desktop, extending towards screen edge */}
        <motion.div 
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97, y: shouldReduceMotion ? 0 : 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.75, ease: "easeOut" }}
          style={{
            transform: shouldReduceMotion ? "none" : `translate3d(${coords.x}px, ${coords.y}px, 0)`,
            transition: "transform 0.15s ease-out"
          }}
          className="w-full lg:w-[58%] relative flex items-center justify-center overflow-visible min-h-[320px] sm:min-h-[500px] lg:min-h-[550px]"
        >
          {/* Subtle radial technical blue glow behind laptop illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-full scale-[0.68] xs:scale-[0.8] sm:scale-[0.9] md:scale-100 transform origin-center object-contain flex justify-center items-center">
            <HeroProductComposition />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
