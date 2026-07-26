"use client";

import React from "react";
import { Shield, Cpu, TrendingUp, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroLaptop } from "./HeroLaptop";
import { HeroCodeCard } from "./HeroCodeCard";
import { FloatingCapabilityCard } from "./FloatingCapabilityCard";
import { HeroOrbitBackground } from "./HeroOrbitBackground";

export function HeroProductComposition() {
  const shouldReduceMotion = useReducedMotion();

  // Entrance animations for floating items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: "spring" as const, stiffness: 100, damping: 15 },
        },
      };

  return (
    <div className="relative w-full flex items-center justify-center py-10 sm:py-16 md:py-20 lg:py-24">
      {/* 1. Concentric orbits background behind laptop */}
      <HeroOrbitBackground />

      {/* 2. Composition Area Container */}
      <motion.div
        className="relative w-full max-w-[450px] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[620px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* 3. Central realistic laptop mockup */}
        <HeroLaptop />

        {/* 4. Floating Code Panel (Above-Left) */}
        <motion.div variants={itemVariants} className="absolute top-0 left-0 z-20">
          <HeroCodeCard />
        </motion.div>

        {/* 5. Floating "Secure" Card (Above-Right) */}
        <motion.div variants={itemVariants}>
          <FloatingCapabilityCard
            title="Secure"
            description="Security-first systems"
            icon={<Shield className="w-5 h-5" />}
            className="top-[-45px] right-[5px] scale-[0.8] xs:scale-[0.85] sm:scale-100 sm:top-[-50px] sm:right-[-10px]"
            delay={0.4}
            floatYOffset={-8}
            floatDuration={6}
          />
        </motion.div>

        {/* 6. Floating "Modern" Card (Left) */}
        <motion.div variants={itemVariants}>
          <FloatingCapabilityCard
            title="Modern"
            description="Clean, maintainable architecture"
            icon={<Cpu className="w-5 h-5" />}
            className="top-[35%] left-[-15px] scale-[0.8] xs:scale-[0.85] sm:scale-100 sm:top-[35%] sm:left-[-40px]"
            delay={0.8}
            floatYOffset={-6}
            floatDuration={5.5}
          />
        </motion.div>

        {/* 7. Floating "Scalable" Card (Right - Hidden on Mobile to avoid clutter) */}
        <motion.div variants={itemVariants}>
          <FloatingCapabilityCard
            title="Scalable"
            description="Built for growth"
            icon={<TrendingUp className="w-5 h-5" />}
            className="hidden md:flex top-[20%] right-[-50px] md:scale-95 lg:scale-100"
            delay={1.2}
            floatYOffset={-7}
            floatDuration={5.8}
          />
        </motion.div>

        {/* 8. Floating "Fast" Card (Lower-Right) */}
        <motion.div variants={itemVariants}>
          <FloatingCapabilityCard
            title="Fast"
            description="Optimized product performance"
            icon={<Zap className="w-5 h-5" />}
            className="bottom-[-25px] right-[5px] scale-[0.8] xs:scale-[0.85] sm:scale-100 sm:bottom-[-30px] sm:right-[10px]"
            delay={1.6}
            floatYOffset={-5}
            floatDuration={5}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
