"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

interface ProcessStep {
  name: string;
  description: string;
}

interface TechBadge {
  name: string;
}

export function EngineeringSystem() {
  const shouldReduceMotion = useReducedMotion();

  const steps: ProcessStep[] = [
    { name: "Understand", description: "Deeply analyze requirements and align target scopes." },
    { name: "Architect", description: "Establish system boundaries, data schemas, and API interfaces." },
    { name: "Build", description: "Write clean, type-safe code using modular design patterns." },
    { name: "Test", description: "Verify correctness through automated checks and QA pipelines." },
    { name: "Ship", description: "Deploy securely to optimized production cloud infrastructure." },
    { name: "Iterate", description: "Monitor logs, gather feedback, and continuously refine performance." }
  ];

  const technologies: TechBadge[] = [
    { name: "Next.js" }, { name: "React" }, { name: "TypeScript" }, 
    { name: "Node.js" }, { name: "PostgreSQL" }, { name: "Prisma" }, 
    { name: "Python" }, { name: "AWS" }, { name: "Docker" }, 
    { name: "Redis" }, { name: "Solidity" }, { name: "REST APIs" }
  ];

  const nodes = [
    { id: "auth", name: "AUTH", x: 15, y: 35 },
    { id: "payments", name: "PAYMENTS", x: 15, y: 65 },
    { id: "frontend", name: "FRONTEND", x: 50, y: 15 },
    { id: "api", name: "API", x: 85, y: 35 },
    { id: "database", name: "POSTGRESQL", x: 50, y: 85 },
    { id: "cloud", name: "AWS", x: 85, y: 65 },
    { id: "product", name: "[ PRODUCT ]", x: 50, y: 50, isCenter: true },
  ];

  return (
    <section id="engineering" className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />

      <Container className="relative z-10 max-w-[1520px]">
        
        {/* 1. Header & Philosophy Statement */}
        <div className="max-w-4xl mb-20 text-left">
          <Reveal>
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#3b82f6] uppercase font-bold mb-4 block">
              07 / Engineering System
            </span>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              GOOD SOFTWARE ISN&apos;T
              <br />
              JUST DESIGNED.
              <br />
              IT&apos;S ENGINEERED.
            </h2>
          </Reveal>
        </div>

        {/* 2. Process Flow Horizontal System (Desktop) / Vertical (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 border-y border-white/5 py-12 mb-24 bg-[#0b0b0d]/30 px-4 md:px-6 rounded-lg">
          {steps.map((step, idx) => (
            <Reveal key={step.name} delay={0.05 * idx} y={10} className="w-full">
              <div className="flex flex-col items-start gap-3 h-full">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-[10px] font-mono font-bold text-primary">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {step.name}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="hidden md:inline-block text-[#8e9aa8]/15 ml-auto font-mono select-none">&rarr;</span>
                  )}
                </div>
                <p className="text-xs text-[#8e9aa8] leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 3. Node-based Architecture Diagram Block */}
        <div className="relative border border-white/5 bg-[#0b0b0d] rounded-lg p-4 sm:p-8 md:p-16 w-full max-w-4xl mx-auto overflow-hidden min-h-[320px] sm:min-h-[380px] flex items-center justify-center">
          <div className="absolute inset-0 grid-pattern opacity-[0.01] pointer-events-none" />
          
          <div className="absolute inset-0 w-full h-full scale-[0.68] xs:scale-[0.82] sm:scale-[0.9] md:scale-100 transform origin-center">
            {/* SVG Connector Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              {nodes.map((node) => {
                if (node.isCenter) return null;
                return (
                  <g key={node.id}>
                    {/* Faint static connection path */}
                    <line 
                      x1={node.x} 
                      y1={node.y} 
                      x2={50} 
                      y2={50} 
                      stroke="rgba(59, 130, 246, 0.08)" 
                      strokeWidth="0.4"
                    />
                    {/* Subtle animated path indicator representing system ping */}
                    <motion.line 
                      x1={node.x} 
                      y1={node.y} 
                      x2={50} 
                      y2={50} 
                      stroke="rgba(59, 130, 246, 0.3)" 
                      strokeWidth="0.6"
                      strokeDasharray="1.5 5"
                      animate={shouldReduceMotion ? {} : {
                        strokeDashoffset: [10, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Absolute Nodes Container */}
            <div className="absolute inset-0 w-full h-full">
              {nodes.map((node) => (
                <div 
                  key={node.id}
                  style={{ 
                    left: `${node.x}%`, 
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  className={`absolute px-4 py-2 text-[10px] font-mono tracking-widest font-bold rounded border transition-colors duration-200 cursor-default select-none ${
                    node.isCenter 
                      ? "bg-primary border-primary/20 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] text-xs px-5 py-2.5" 
                      : "bg-[#050505] border-white/5 text-[#8e9aa8] hover:border-primary/30 hover:text-white"
                  }`}
                >
                  {node.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Tech Stack Monochrome badges below */}
        <Reveal delay={0.2} className="mt-16 text-center">
          <span className="text-[9px] tracking-[0.2em] font-mono text-white/30 uppercase font-bold block mb-6">
            Selected Engineering Stack
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {technologies.map((tech) => (
              <span 
                key={tech.name}
                className="px-4 py-2 border border-white/5 bg-[#0b0b0d] text-xs font-mono font-semibold text-[#8e9aa8] rounded-md cursor-default hover:text-white hover:border-white/10 transition-all duration-200"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </Reveal>

      </Container>
    </section>
  );
}
