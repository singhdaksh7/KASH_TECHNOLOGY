"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { 
  Layers, 
  Lock, 
  Boxes, 
  Cloud, 
  Cpu, 
  Wallet, 
  UserCheck, 
  Code 
} from "lucide-react";

interface TrustCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function TrustSection() {
  const cards: TrustCard[] = [
    {
      icon: <Layers className="w-5 h-5" />,
      title: "End-to-End Product Development",
      description: "Full lifecycle engineering from product concept and prototyping to production launch.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Secure Backend Engineering",
      description: "High-performance, secure backend architectures built with strict data protection.",
    },
    {
      icon: <Boxes className="w-5 h-5" />,
      title: "Multi-Tenant SaaS Architecture",
      description: "Isolated database schemas and robust tenant separation designed for massive scaling.",
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      title: "Cloud Deployment on AWS",
      description: "Highly available, automated cloud infrastructure setups engineered on AWS.",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "AI and Automation Integrations",
      description: "Process automation integrations, intelligence layers, and bespoke API connections.",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Blockchain and Fintech Expertise",
      description: "Crypto systems, launchpads, secure ledger architectures, and transaction handling.",
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Direct Founder Communication",
      description: "Direct alignment with the engineering founders for clear, fast decision making.",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Clean, Scalable Codebases",
      description: "Fully documented, modular, and lint-clean code written for easy long-term maintenance.",
    },
  ];

  return (
    <section id="why-us" className="py-24 border-t border-white/5 bg-black relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Reveal>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-blue-400 uppercase block mb-3">
              Why KASH Technologies
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Engineering partners for serious digital products.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              We combine product thinking, backend engineering, cloud infrastructure and practical delivery to turn ideas into scalable software.
            </p>
          </Reveal>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Reveal key={i} delay={0.05 * i} y={12}>
              <div className="group h-full bg-[#0d0d0f] border border-white/5 hover:border-blue-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col gap-4">
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-300 transition-colors">
                  {card.icon}
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
