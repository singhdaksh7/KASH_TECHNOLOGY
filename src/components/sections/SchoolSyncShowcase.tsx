"use client";

import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { SchoolSyncDemo } from "@/components/product-demos/schoolsync/SchoolSyncDemo";
import { trackEvent } from "@/lib/analytics";

export function SchoolSyncShowcase() {
  const product = SITE_CONFIG.products.schoolsync;

  const metadata = [
    { label: "Product", value: "School ERP" },
    { label: "Platform", value: "Web + Mobile" },
    { label: "System", value: "Multi-tenant SaaS" },
    { label: "Engineering", value: "Next.js / PostgreSQL / Prisma / AWS" }
  ];

  const capabilities = [
    "Attendance", "Fees", "Homework", "Reports", 
    "Parent Portal", "Teacher Workspace", "Multi-school Architecture"
  ];

  return (
    <section id="work" className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="max-w-[1520px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Layout: Centered editorial statement, followed by a double column content details, then the demo below */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Reveal>
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#22c55e] uppercase font-bold mb-4 block">
              01 / SchoolSync
            </span>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              One operating system for the entire school.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-[#8e9aa8] text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Multi-tenant ERP infrastructure connecting administrators, teachers, parents and students through one unified platform.
            </p>
          </Reveal>
        </div>

        {/* Info Grid & Tech Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start max-w-5xl mx-auto">
          {/* Metadata Table */}
          <Reveal className="lg:col-span-6 border border-white/5 rounded-lg p-6 bg-[#0b0b0d]">
            <span className="text-[9px] tracking-[0.2em] font-mono text-white/40 uppercase font-bold block mb-4">
              Technical Specifications
            </span>
            <div className="space-y-4">
              {metadata.map((item) => (
                <div key={item.label} className="flex justify-between items-start py-2 border-b border-white/5 text-xs font-semibold">
                  <span className="text-[#8e9aa8] font-mono">{item.label}</span>
                  <span className="text-white text-right max-w-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Capabilities & Actions */}
          <Reveal className="lg:col-span-6 border border-white/5 rounded-lg p-6 bg-[#0b0b0d] flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <span className="text-[9px] tracking-[0.2em] font-mono text-white/40 uppercase font-bold block mb-4">
                Platform Capabilities
              </span>
              <div className="flex flex-wrap gap-2 mb-8">
                {capabilities.map((cap) => (
                  <span 
                    key={cap} 
                    className="text-[10px] font-mono tracking-wider font-bold px-3 py-1 bg-white/5 text-[#8e9aa8] rounded-sm hover:text-white transition-colors duration-200"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <LinkButton 
                href={product.caseStudyPath} 
                variant="outline"
                onClick={() => trackEvent("case_study_click", { project: "schoolsync", location: "homepage_showcase" })}
                className="border border-white/8 hover:border-white/20 text-white px-5 py-2.5 text-xs font-semibold rounded-md transition-all hover:bg-white/5 h-9 min-h-[36px]"
              >
                Explore SchoolSync &rarr;
              </LinkButton>
            </div>
          </Reveal>
        </div>

        {/* Dynamic Demo Container */}
        <Reveal delay={0.2} className="w-full flex justify-center overflow-visible">
          <div className="w-full max-w-[1024px] relative">
            <div className="absolute w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <SchoolSyncDemo />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
