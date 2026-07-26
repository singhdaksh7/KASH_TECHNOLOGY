"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroCodeCard() {
  const shouldReduceMotion = useReducedMotion();

  // Floating animation setup
  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        animate: {
          y: [0, -6, 0],
        },
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <motion.div
      className="absolute top-[-40px] left-[-30px] z-20 w-[240px] bg-[#0d0d0f]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 pointer-events-none hidden sm:block"
      {...floatAnimation}
    >
      {/* Window Controls */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>

      {/* Code Text with Custom Highlights */}
      <div className="space-y-1 select-none">
        <div>
          <span className="text-blue-400">const</span>{" "}
          <span className="text-cyan-300">build</span> = (
          <span className="text-orange-300">idea</span>) =&gt; &#123;
        </div>
        <div className="pl-4">
          <span className="text-blue-400">const</span>{" "}
          <span className="text-slate-100">product</span> ={" "}
          <span className="text-cyan-300">solve</span>(idea);
        </div>
        <div className="pl-4">
          <span className="text-blue-400">const</span>{" "}
          <span className="text-slate-100">scale</span> ={" "}
          <span className="text-cyan-300">grow</span>(product);
        </div>
        <div className="pl-4">
          <span className="text-blue-400">return</span>{" "}
          <span className="text-cyan-300">impact</span>(scale);
        </div>
        <div>&#125;;</div>
        <div className="pt-1.5">
          <span className="text-cyan-300">build</span>(
          <span className="text-orange-300">yourVision</span>);
        </div>
      </div>
    </motion.div>
  );
}
