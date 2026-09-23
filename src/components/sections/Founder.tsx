"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function Founder() {
  return (
    <section id="company" className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />
      
      <Container className="relative z-10 max-w-[1520px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Tag and Headline */}
          <div className="lg:col-span-5 text-left shrink-0">
            <Reveal>
              <span className="text-[10px] tracking-[0.25em] font-mono text-[#3b82f6] uppercase font-bold mb-4 block">
                08 / Company
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                Small team.
                <br />
                Serious engineering.
              </h2>
            </Reveal>
          </div>

          {/* Right Side: Philosophy Statement Details */}
          <div className="lg:col-span-7 space-y-6 text-[#8e9aa8] text-base md:text-lg leading-relaxed text-left max-w-2xl pt-2">
            <Reveal delay={0.15}>
              <p>
                KASH Technologies operates as an elite product engineering studio. We partner directly with founders and product teams to translate complex business requirements into robust, production-ready software.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                We do not have sales representatives, project managers, or communication layers. When you collaborate with us, you work directly with the developers building your systems. This removes latency, ensures alignment, and guarantees technical integrity from day one.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-xs font-mono tracking-wider font-bold text-white/40 uppercase mt-8 block">
                Direct Collaboration • Rapid Shipping • Architecture to Production
              </p>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  );
}
