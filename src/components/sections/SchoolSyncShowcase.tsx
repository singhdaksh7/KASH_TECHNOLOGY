"use client";

import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { SchoolSyncDemo } from "@/components/product-demos/schoolsync/SchoolSyncDemo";
import { trackEvent } from "@/lib/analytics";

export function SchoolSyncShowcase() {
  const product = SITE_CONFIG.products.schoolsync;

  return (
    <section className="py-24 bg-white/[0.02] relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] glow-blob -z-10 bottom-0 right-0 opacity-20"></div>
      
      <div className="max-w-[1280px] mx-auto px-8">
        <Reveal className="text-center mb-16">
          <div className="inline-flex px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            SaaS & ERP
          </div>
          <h2 className="text-5xl font-black mb-6">{product.name} Ecosystem</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            Bridging the gap between administrators, teachers, and parents with a unified data-driven platform.
          </p>
          <LinkButton 
            href={product.caseStudyPath} 
            variant="primary"
            onClick={() => trackEvent("case_study_click", { project: "schoolsync", location: "homepage_showcase" })}
          >
            View Case Study
          </LinkButton>
        </Reveal>

        <Reveal delay={0.1} className="w-full">
          <SchoolSyncDemo />
        </Reveal>
      </div>
    </section>
  );
}
