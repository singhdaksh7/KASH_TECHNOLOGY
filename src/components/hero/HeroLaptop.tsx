"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroDashboard } from "./HeroDashboard";

export function HeroLaptop() {
  const shouldReduceMotion = useReducedMotion();

  // Gentle laptop entrance animation
  const laptopEntrance = shouldReduceMotion
    ? { initial: { opacity: 1, scale: 1 }, animate: {} }
    : {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 1, ease: "easeOut" as const, delay: 0.3 },
      };

  return (
    <motion.div
      className="relative w-full max-w-[500px] md:max-w-[550px] lg:max-w-[620px] mx-auto z-10 select-none transform-gpu"
      style={{
        transform: "perspective(1200px) rotateY(-10deg) rotateX(6deg) rotateZ(1deg)",
        transformStyle: "preserve-3d",
      }}
      {...laptopEntrance}
    >
      {/* Glow highlight behind the laptop */}
      <div className="absolute inset-[-20px] bg-blue-500/10 blur-[80px] rounded-full -z-20 pointer-events-none" />

      {/* Ground shadow beneath the laptop */}
      <div className="absolute -bottom-6 left-[-6%] right-[-6%] h-8 bg-black/90 blur-[16px] rounded-full -z-10 pointer-events-none transform-gpu" />

      {/* Screen Lid Assembly */}
      <div className="relative border-[10px] sm:border-[12px] border-[#0c0c0e] rounded-t-2xl shadow-2xl bg-black overflow-hidden aspect-[1.6]">
        {/* Webcam Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#0c0c0e] rounded-b-md z-30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Glossy Overlay Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none z-20" />

        {/* Hero Dashboard inside */}
        <HeroDashboard />
      </div>

      {/* Laptop Hinge Link */}
      <div className="h-1.5 sm:h-2 bg-[#08080a] w-[99.5%] mx-auto border-t border-white/5" />

      {/* Laptop Base Keyboard Deck */}
      <div 
        className="h-2.5 sm:h-3 bg-gradient-to-b from-[#111115] to-[#070708] w-[105%] -ml-[2.5%] rounded-b-xl border-t border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative"
        style={{ transform: "translateZ(1px)" }}
      >
        {/* Keyboard groove indicator */}
        <div className="w-[84%] mx-auto h-[1px] bg-black/60 mt-0.5 rounded-full" />
        
        {/* Trackpad Indicator */}
        <div className="w-[20%] mx-auto h-1 bg-slate-900 border-x border-b border-white/5 rounded-b-sm mt-0.5 shadow-inner" />
      </div>
    </motion.div>
  );
}
