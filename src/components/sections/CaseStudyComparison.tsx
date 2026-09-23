import React from "react";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";
import { Clock, TrendingDown, Zap, CheckCircle2 } from "lucide-react";

export function CaseStudyComparison() {
  const metrics = [
    { value: "60%", label: "Faster Reporting", icon: Clock },
    { value: "45%", label: "Cost Reduction", icon: TrendingDown },
    { value: "3x", label: "Efficiency", icon: Zap },
    { value: "100%", label: "Data Accuracy", icon: CheckCircle2 },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#050708] text-white relative overflow-hidden border-b border-white/10">
      <CircuitBackground variant="dark" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
            FEATURED CASE STUDY
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-white">
            From Manual to Automated
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-w-5xl mx-auto bg-[#0b0d0e] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          
          {/* Left Column: Interactive Before / After Split (col-span-6) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* BEFORE CARD */}
            <div className="rounded-2xl bg-[#12141a] border border-white/5 p-4 flex flex-col justify-between opacity-80">
              <div>
                <span className="text-[10px] font-mono font-bold text-white/50 tracking-wider uppercase block mb-1">
                  BEFORE
                </span>
                <p className="text-xs text-[#9ca3af] leading-normal mb-3">
                  Manual data entry &amp; delayed reports.
                </p>
              </div>
              
              {/* Simulated Legacy UI */}
              <div className="h-28 rounded-xl bg-[#08080a] border border-white/5 p-2.5 flex flex-col justify-between">
                <div className="flex items-center gap-1 border-b border-white/5 pb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-10 h-1 rounded bg-white/10 ml-2" />
                </div>
                <div className="space-y-1 my-auto">
                  <div className="w-full h-1.5 rounded bg-white/5" />
                  <div className="w-4/5 h-1.5 rounded bg-white/5" />
                  <div className="w-2/3 h-1.5 rounded bg-red-400/20" />
                </div>
                <div className="text-[7px] font-mono text-white/30">Manual Entry Required</div>
              </div>
            </div>

            {/* AFTER CARD */}
            <div className="rounded-2xl bg-[#14161f] border border-[#f36b21]/40 p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(243,107,33,0.12)]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#f36b21] tracking-wider uppercase block mb-1">
                  AFTER
                </span>
                <p className="text-xs text-white leading-normal mb-3">
                  Automated workflows &amp; real-time sync.
                </p>
              </div>

              {/* Simulated Modern Dashboard UI */}
              <div className="h-28 rounded-xl bg-[#090b10] border border-[#f36b21]/30 p-2.5 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[7.5px] font-mono text-[#f36b21]">
                  <span>FinTrack Live</span>
                  <span className="text-emerald-400">SYNCED</span>
                </div>
                <div className="flex items-end gap-1.5 h-12 pt-1">
                  <div className="flex-1 bg-[#f36b21]/40 h-[45%] rounded-t" />
                  <div className="flex-1 bg-[#f36b21]/70 h-[75%] rounded-t" />
                  <div className="flex-1 bg-[#f36b21] h-[100%] rounded-t shadow-[0_0_8px_#f36b21]" />
                  <div className="flex-1 bg-[#c5a880] h-[90%] rounded-t" />
                </div>
                <div className="flex justify-between text-[7px] font-mono text-white/40 border-t border-white/5 pt-1">
                  <span>Throughput: +300%</span>
                  <span>99.99% Uptime</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Case Study Narrative & Metrics (col-span-6) */}
          <div className="lg:col-span-6 space-y-5 lg:pl-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white">
                  FinTrack ERP
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#c5a880] border border-[#c5a880]/20">
                  ERP / Finance
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Centralized finance and operations into one scalable ERP platform.
              </p>
            </div>

            {/* 4 Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[#f36b21]">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-serif-heading text-base sm:text-lg font-bold text-white">
                        {m.value}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9ca3af] block leading-tight">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
