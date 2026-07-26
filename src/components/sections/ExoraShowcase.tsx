"use client";

import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Activity, Fingerprint } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { ExoraDemo } from "@/components/product-demos/exora/ExoraDemo";
import { trackEvent } from "@/lib/analytics";

export function ExoraShowcase() {
  const product = SITE_CONFIG.products.exora;

  return (
    <section id="work" className="project-showcase-container py-24 max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 relative">
      <Reveal className="space-y-10 py-12">
        <div className="inline-flex px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
          Fintech Engineering
        </div>
        <h2 className="text-5xl font-black leading-tight">{product.name}: {product.description}</h2>
        <p className="text-lg text-muted leading-relaxed">
          A robust, high-frequency trading and wallet management platform. We built a real-time reactive engine that handles millions of transactions with sub-millisecond latency.
        </p>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-primary/30 transition-all group">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                <Activity className="w-4 h-4" />
              </span>
              Real-time Markets
            </h3>
            <p className="text-muted pl-11">Live WebSocket streams for instantaneous price updates and order book depth.</p>
          </div>
          <div className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-primary/30 transition-all group">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                <Fingerprint className="w-4 h-4" />
              </span>
              Biometric Security
            </h3>
            <p className="text-muted pl-11">Military-grade encryption with multi-sig wallet architectures and biometric auth.</p>
          </div>
        </div>
        <div className="pt-4">
          <LinkButton 
            href={product.caseStudyPath} 
            variant="primary"
            onClick={() => trackEvent("case_study_click", { project: "exora", location: "homepage_showcase" })}
          >
            View Case Study
          </LinkButton>
        </div>
      </Reveal>

      <Reveal delay={0.2} className="relative flex justify-center items-start pt-12">
        <div className="absolute w-[400px] h-[400px] glow-blob -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="sticky top-32 w-full max-w-[320px]">
          <ExoraDemo />
        </div>
      </Reveal>
    </section>
  );
}
