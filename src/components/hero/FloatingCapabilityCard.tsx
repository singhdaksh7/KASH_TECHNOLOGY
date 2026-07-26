"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FloatingCapabilityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
  floatYOffset?: number;
  floatDuration?: number;
}

export function FloatingCapabilityCard({
  title,
  description,
  icon,
  className = "",
  delay = 0,
  floatYOffset = -6,
  floatDuration = 5,
}: FloatingCapabilityCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Gentle float animation setup
  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        animate: {
          y: [0, floatYOffset, 0],
        },
        transition: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: delay,
        },
      };

  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-3 bg-[#0d0d0f]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl select-none max-w-[200px] sm:max-w-[240px] pointer-events-none ${className}`}
      {...floatAnimation}
    >
      {/* Icon Frame */}
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
        {icon}
      </div>

      {/* Info */}
      <div className="space-y-0.5 min-w-0">
        <h4 className="font-bold text-xs sm:text-sm text-white truncate">{title}</h4>
        <p className="text-[10px] sm:text-xs text-slate-400 leading-tight break-words">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
