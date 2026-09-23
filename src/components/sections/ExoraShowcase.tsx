"use client";

import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { ExoraDemo } from "@/components/product-demos/exora/ExoraDemo";
import { trackEvent } from "@/lib/analytics";

export function ExoraShowcase() {
  const product = SITE_CONFIG.products.exora;

  const metadata = [
    { label: "Product", value: "Crypto Exchange" },
    { label: "Platform", value: "Web Application" },
    { label: "System", value: "Low-latency Trading Engine" },
    { label: "Engineering", value: "Go / Next.js / Solidity / WebSockets" }
  ];

  const capabilities = [
    "Secure authentication", "Ledger architecture", 
    "Trading infrastructure", "RBAC", "Wallet systems", "API infrastructure"
  ];

  return (
    <section className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="max-w-[1520px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Technical Details (42% width) */}
          <div className="w-full lg:col-span-5 flex flex-col items-start text-left shrink-0">
            <Reveal>
              <span className="text-[10px] tracking-[0.25em] font-mono text-[#f0b90b] uppercase font-bold mb-4 block">
                02 / Exora
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Exchange infrastructure engineered for trust.
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-[#8e9aa8] text-base md:text-lg leading-relaxed mb-8">
                A high-performance reactive exchange featuring real-time WebSocket order book depth, secure multi-signature wallets, and cryptographic ledger integrity.
              </p>
            </Reveal>

            {/* Spec Table */}
            <Reveal className="w-full border border-white/5 rounded-lg p-5 bg-[#0b0b0d] mb-6">
              <span className="text-[9px] tracking-[0.2em] font-mono text-white/40 uppercase font-bold block mb-3">
                Technical Specifications
              </span>
              <div className="space-y-3">
                {metadata.map((item) => (
                  <div key={item.label} className="flex justify-between items-start py-1.5 border-b border-white/5 text-xs font-semibold">
                    <span className="text-[#8e9aa8] font-mono">{item.label}</span>
                    <span className="text-white text-right max-w-[200px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* System details */}
            <Reveal className="mb-8">
              <div className="flex flex-wrap gap-2">
                {capabilities.map((cap) => (
                  <span 
                    key={cap} 
                    className="text-[10px] font-mono tracking-wider font-bold px-3 py-1 bg-white/5 text-[#8e9aa8] rounded-sm hover:text-white transition-colors duration-200"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <LinkButton 
                href={product.caseStudyPath} 
                variant="outline"
                onClick={() => trackEvent("case_study_click", { project: "exora", location: "homepage_showcase" })}
                className="border border-white/8 hover:border-[#f0b90b]/45 text-white px-5 py-2.5 text-xs font-semibold rounded-md transition-all hover:bg-[#f0b90b]/5 h-9 min-h-[36px]"
              >
                Explore Exora &rarr;
              </LinkButton>
            </Reveal>
          </div>

          {/* Right Column: Terminal UI Mockup (58% width) */}
          <Reveal delay={0.2} className="w-full lg:col-span-7 flex justify-center overflow-visible relative">
            <div className="absolute w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f0b90b]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-[520px] bg-black border border-white/5 rounded-lg overflow-hidden shadow-2xl p-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4 text-[9px] font-mono text-white/40 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                <span className="ml-2 font-bold text-[#f0b90b]">EXORA_TERMINAL_V1.0.2</span>
              </div>
              <div className="w-full flex justify-center items-center">
                <ExoraDemo />
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
