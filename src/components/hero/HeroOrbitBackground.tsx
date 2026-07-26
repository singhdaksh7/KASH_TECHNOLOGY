"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroOrbitBackground() {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is preferred, render static dots and orbits without continuous animation
  const animationProps = shouldReduceMotion
    ? {}
    : {
        animate: { rotate: 360 },
        transition: {
          duration: 60,
          repeat: Infinity,
          ease: "linear" as const,
        },
      };

  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Deep blue/indigo radial gradient glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-950/30 to-cyan-950/20 blur-[120px] opacity-70 mix-blend-screen" />
      
      {/* Orbit lines SVG */}
      <motion.svg
        className="w-[700px] h-[700px] text-white/5 opacity-60"
        viewBox="0 0 700 700"
        fill="none"
        {...animationProps}
      >
        {/* Inner Orbit */}
        <circle
          cx="350"
          cy="350"
          r="160"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Middle Orbit */}
        <circle
          cx="350"
          cy="350"
          r="230"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Outer Orbit */}
        <circle
          cx="350"
          cy="350"
          r="300"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 6"
        />

        {/* Floating orbital nodes */}
        <motion.circle
          cx="190"
          cy="350"
          r="5"
          fill="#3b82f6"
          className="shadow-[0_0_12px_#3b82f6]"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.4, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
        />
        <motion.circle
          cx="350"
          cy="120"
          r="4.5"
          fill="#06b6d4"
          className="shadow-[0_0_10px_#06b6d4]"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
        />
        <motion.circle
          cx="510"
          cy="350"
          r="5"
          fill="#3b82f6"
          className="shadow-[0_0_12px_#3b82f6]"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.5, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }}
        />
        <motion.circle
          cx="350"
          cy="580"
          r="4"
          fill="#06b6d4"
          className="shadow-[0_0_8px_#06b6d4]"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.3, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, delay: 1.5 }}
        />
      </motion.svg>
    </div>
  );
}
