"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface TechEmblemProps {
  className?: string;
  size?: number;
}

export function TechEmblem({ className = "", size = 460 }: TechEmblemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, maxWidth: "100%" }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-[#f36b21]/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Outer Technical Circuit Lines */}
      <svg
        className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none"
        viewBox="0 0 540 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-right circuit trace */}
        <path
          d="M 270 40 L 420 40 L 480 100 L 480 220"
          stroke="#f36b21"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />
        <circle cx="480" cy="220" r="4" fill="#f36b21" />
        <circle cx="270" cy="40" r="4" fill="#f36b21" />

        {/* Bottom-left circuit trace */}
        <path
          d="M 60 320 L 60 440 L 160 500 L 270 500"
          stroke="#f36b21"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />
        <circle cx="60" cy="320" r="4" fill="#f36b21" />
        <circle cx="270" cy="500" r="4" fill="#f36b21" />

        {/* Diagonal accents */}
        <line x1="90" y1="130" x2="150" y2="70" stroke="#f36b21" strokeWidth="1.2" strokeOpacity="0.4" />
        <circle cx="90" cy="130" r="3" fill="#f36b21" />
        <circle cx="150" cy="70" r="3" fill="#f36b21" />

        <line x1="450" y1="410" x2="390" y2="470" stroke="#f36b21" strokeWidth="1.2" strokeOpacity="0.4" />
        <circle cx="450" cy="410" r="3" fill="#f36b21" />
        <circle cx="390" cy="470" r="3" fill="#f36b21" />
      </svg>

      {/* Outer Rotating Concentric Technical Ring with Nodes */}
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[6%] rounded-full border border-[#f36b21]/50 border-dashed pointer-events-none"
      >
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f36b21] shadow-[0_0_10px_#f36b21]" />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f36b21] shadow-[0_0_10px_#f36b21]" />
        <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#f36b21] bg-[#050708]" />
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#f36b21] bg-[#050708]" />
      </motion.div>

      {/* Middle Counter-Rotating Ring */}
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[13%] rounded-full border border-[#f36b21]/30 pointer-events-none"
      >
        <span className="absolute top-4 right-8 w-2 h-2 rounded-full bg-[#f36b21]" />
        <span className="absolute bottom-4 left-8 w-2 h-2 rounded-full bg-[#f36b21]" />
      </motion.div>

      {/* Inner Fixed High-Contrast Glow Ring */}
      <div className="absolute inset-[16%] rounded-full border-2 border-[#f36b21]/60 pointer-events-none shadow-[0_0_15px_rgba(243,107,33,0.3)]" />

      {/* Central Circular Official Logo Container */}
      <div className="relative z-10 w-[68%] h-[68%] rounded-full overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(243,107,33,0.3)] border-2 border-[#f36b21]/40 bg-white flex items-center justify-center">
        <Image
          src="/images/logo/kash-logo-emblem.jpg"
          alt="KASH Technology Official Emblem"
          fill
          sizes="(max-width: 768px) 280px, 460px"
          className="object-cover scale-105"
          priority
        />
      </div>
    </div>
  );
}
