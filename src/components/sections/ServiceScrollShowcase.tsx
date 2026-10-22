"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";
import { SHOWCASE_SERVICES } from "./service-showcase/showcase-data";
import { ServiceOrbit } from "./service-showcase/ServiceOrbit";
import { 
  ServicePreviews, 
  WebPreview, 
  CustomSoftwarePreview, 
  SocialMediaPreview, 
  VideoContentPreview, 
  MarketingLeadGenPreview, 
  AiAutomationPreview 
} from "./service-showcase/ServicePreviews";

export function ServiceScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReducedMotion);

  // Scroll listener with requestAnimationFrame for desktop sticky scroll
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - viewportHeight;

      if (totalScrollableDistance <= 0) return;

      // Distance scrolled from the top of the container
      const scrolled = -rect.top;
      // Clamp progress between 0 and 1
      const progress = Math.min(Math.max(scrolled / totalScrollableDistance, 0), 1);

      // Divide total scroll into 6 equal service stages
      // 0–16% -> 0, 16–33% -> 1, 33–50% -> 2, 50–66% -> 3, 66–83% -> 4, 83–100% -> 5
      const stage = Math.min(Math.floor(progress * 6), 5);

      setActiveIndex(stage);

      // Continuous subtle orbital rotation: 60 degrees per stage plus smooth intermediate movement
      if (!shouldReduceMotion) {
        const continuousAngle = progress * 300;
        setRotationAngle(continuousAngle);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  // Subtle desktop mouse parallax (max 8px movement)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = ((clientX / innerWidth) - 0.5) * 16;
    const y = ((clientY / innerHeight) - 0.5) * 16;
    setMouseOffset({ x, y });
  }, [shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  // Jump smoothly to a specific service stage
  const handleSelectService = useCallback((targetIndex: number) => {
    if (!containerRef.current) return;
    const containerTop = window.scrollY + containerRef.current.getBoundingClientRect().top;
    const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    
    // Position within the stage (centering slightly within stage range)
    const targetProgress = (targetIndex + 0.5) / 6;
    const targetScrollY = containerTop + (targetProgress * totalScrollableDistance);

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }, []);

  const activeService = SHOWCASE_SERVICES[activeIndex];

  // Map mobile preview components
  const mobilePreviews = [
    <WebPreview key="web" />,
    <CustomSoftwarePreview key="custom" />,
    <SocialMediaPreview key="social" />,
    <VideoContentPreview key="video" />,
    <MarketingLeadGenPreview key="marketing" />,
    <AiAutomationPreview key="ai" />,
  ];

  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP PINNED / STICKY SCROLL SHOWCASE (>= 1024px)             */}
      {/* Occupies ~580vh of scroll space while container stays pinned   */}
      {/* ============================================================== */}
      <section
        ref={containerRef}
        aria-label="Interactive Capabilities Showcase"
        className="hidden lg:block relative bg-[#050708] border-b border-white/10"
        style={{ height: "580vh" }}
      >
        {/* Sticky 100vh Viewport Container */}
        <div
          ref={stickyRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050708] select-none"
        >
          {/* Subtle Circuit Background */}
          <CircuitBackground variant="dark" />

          {/* Diagonal Ivory Texture Accent (Echoing Hero Design System) */}
          <div
            className="absolute top-0 right-0 w-[42%] h-full bg-[#fbf8f2]/[0.015] pointer-events-none"
            style={{
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          />

          {/* Radial Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#f36b21]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* -------------------------------------------------------- */}
          {/* 1. VISUALLY MINIMAL SECTION HEADER & STAGE INDICATOR     */}
          {/* -------------------------------------------------------- */}
          <div className="relative z-20 pt-8 pb-4 border-b border-white/5 bg-[#050708]/80 backdrop-blur-md">
            <Container>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Eyebrow + Main Heading + Supporting Copy */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase">
                      WHAT WE BUILD
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f36b21]" />
                    <span className="text-[10px] font-mono text-[#c5a880] tracking-wider uppercase">
                      CAPABILITIES SHOWCASE
                    </span>
                  </div>
                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    Technology Built Around Your Business
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9ca3af] mt-0.5">
                    From customer-facing products to the systems running your operations.
                  </p>
                </div>

                {/* Right: Stage Number & Interactive Progress Markers */}
                <div className="flex items-center gap-4">
                  {/* Digital Stage Counter */}
                  <div className="flex items-baseline gap-1 font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10">
                    <span className="text-sm font-bold text-[#f36b21]">
                      {activeService.number}
                    </span>
                    <span className="text-xs text-white/30">/</span>
                    <span className="text-xs text-white/50">06</span>
                  </div>

                  {/* 6 Stage Indicators (Clickable to jump) */}
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Showcase stages">
                    {SHOWCASE_SERVICES.map((s, idx) => {
                      const isCurrent = activeIndex === idx;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleSelectService(idx)}
                          role="tab"
                          aria-selected={isCurrent}
                          aria-label={`Jump to ${s.title}`}
                          className={`group h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#f36b21] cursor-pointer ${
                            isCurrent
                              ? "w-8 bg-[#f36b21] shadow-[0_0_8px_#f36b21]"
                              : "w-2 bg-white/20 hover:bg-[#c5a880] hover:w-4"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* -------------------------------------------------------- */}
          {/* 2. THREE-PART COMPOSITION: LEFT | CENTER | RIGHT         */}
          {/* -------------------------------------------------------- */}
          <div className="relative z-10 flex-1 flex items-center py-6">
            <Container className="w-full">
              <div className="grid grid-cols-12 gap-8 items-center min-h-[460px]">
                
                {/* ==================================================== */}
                {/* LEFT: ACTIVE SERVICE CONTENT (Col 1-4)               */}
                {/* ==================================================== */}
                <div className="col-span-4 flex flex-col justify-center text-left space-y-5 pr-2">
                  {/* Category Eyebrow & Number Indicator */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-widest text-[#f36b21]">
                        SERVICE {activeService.number}
                      </span>
                      <span className="text-white/20">&bull;</span>
                      <span className="text-[11px] font-mono text-[#c5a880] tracking-wider uppercase">
                        {activeService.category}
                      </span>
                    </div>

                    {/* Massive Monospace Number Watermark */}
                    <div 
                      key={`num-${activeIndex}`} 
                      className="text-6xl font-mono font-black text-white/[0.07] -ml-1 transition-all duration-500 transform"
                    >
                      {activeService.number}
                    </div>
                  </div>

                  {/* Title with smooth key-based cross-fade transition */}
                  <div key={`content-${activeIndex}`} className="space-y-3 transition-all duration-400">
                    <h3 className="font-serif-heading text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
                      {activeService.title}
                    </h3>

                    <p className="text-sm xl:text-base text-[#9ca3af] leading-relaxed">
                      {activeService.description}
                    </p>
                  </div>

                  {/* 3-4 Capability Tags */}
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2 font-semibold">
                      CAPABILITIES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeService.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/10 text-white/80 hover:border-[#f36b21]/40 hover:text-white transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* High-impact CTA Link to Service Page */}
                  <div className="pt-3">
                    <Link
                      href={activeService.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_6px_20px_rgba(243,107,33,0.35)] hover:shadow-[0_8px_25px_rgba(243,107,33,0.5)] active:scale-95 group"
                    >
                      <span>Explore {activeService.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* ==================================================== */}
                {/* CENTER: ROTATING KASH TECH ORBIT (Col 5-8)          */}
                {/* ==================================================== */}
                <div 
                  className="col-span-4 flex items-center justify-center relative transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
                  }}
                >
                  <ServiceOrbit
                    activeIndex={activeIndex}
                    rotationAngle={rotationAngle}
                    onSelectService={handleSelectService}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </div>

                {/* ==================================================== */}
                {/* RIGHT: PRODUCT PREVIEW (Col 9-12)                   */}
                {/* ==================================================== */}
                <div 
                  className="col-span-4 flex items-center justify-center relative transition-transform duration-300 ease-out pl-2"
                  style={{
                    transform: `translate3d(${-mouseOffset.x * 0.7}px, ${-mouseOffset.y * 0.7}px, 0)`,
                  }}
                >
                  <ServicePreviews activeIndex={activeIndex} />
                </div>

              </div>
            </Container>
          </div>

          {/* -------------------------------------------------------- */}
          {/* 3. BOTTOM TELEMETRY FOOTER & SCROLL INSTRUCTION          */}
          {/* -------------------------------------------------------- */}
          <div className="relative z-20 py-3 border-t border-white/5 bg-[#050708]/90">
            <Container>
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[#c5a880]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f36b21] animate-pulse" />
                    Interactive Showcase
                  </span>
                  <span className="hidden sm:inline text-white/20">|</span>
                  <span className="hidden sm:inline text-white/40">
                    Scroll down to explore all capabilities
                  </span>
                </div>

                {/* Active Service Metric Spec */}
                <div className="flex items-center gap-2">
                  <span className="text-white/40">{activeService.statsLabel}:</span>
                  <span className="text-white font-bold text-xs font-mono text-[#f36b21]">
                    {activeService.statsValue}
                  </span>
                </div>
              </div>
            </Container>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* MOBILE NATURAL VERTICAL SEQUENCE (< 1024px)                     */}
      {/* Elegant cards with natural scrolling and rich preview UI        */}
      {/* ============================================================== */}
      <section 
        aria-label="Capabilities Overview"
        className="block lg:hidden bg-[#050708] text-white py-16 px-4 sm:px-6 border-b border-white/10 relative overflow-hidden"
      >
        <CircuitBackground variant="dark" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              WHAT WE BUILD
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Technology Built Around Your Business
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] max-w-md mx-auto">
              From customer-facing products to the systems running your operations.
            </p>
          </div>

          {/* 6 Vertical Service Cards */}
          <div className="space-y-10">
            {SHOWCASE_SERVICES.map((service, index) => (
              <div
                key={service.id}
                className="bg-[#0b0d12] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group"
              >
                {/* Number Watermark */}
                <div className="absolute top-4 right-5 text-4xl font-mono font-black text-white/5 pointer-events-none">
                  {service.number}
                </div>

                {/* Header */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#f36b21] mb-2">
                  <span>{service.number}</span>
                  <span className="text-white/20">&bull;</span>
                  <span className="text-[#c5a880] uppercase tracking-wider text-[10px]">
                    {service.category}
                  </span>
                </div>

                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white mb-2">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Capability Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/10 text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Embedded Responsive Product Preview */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 border border-white/5 bg-black/40">
                  {mobilePreviews[index]}
                </div>

                {/* Bottom Link Button */}
                <Link
                  href={service.href}
                  className="inline-flex items-center justify-between w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-[#f36b21] text-white text-xs font-bold tracking-wide border border-white/10 hover:border-[#f36b21] transition-all group"
                >
                  <span>Explore {service.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#f36b21] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
