"use client";

import React from "react";
import { Terminal, Code2, Layers, Cpu, CheckCircle } from "lucide-react";

interface VisualProps {
  progress?: number;
  active: boolean;
}

export function EngineeringVisual({ active }: VisualProps) {
  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40">
        <div className="w-72 h-72 rounded-full bg-[#FF5A00]/15 blur-3xl mx-auto mt-10" />
      </div>

      {/* Layer 1: Code / IDE Layer (Backdrop) */}
      <div 
        className={`absolute w-[90%] max-w-lg rounded-2xl bg-[#0B0B0F]/95 border border-white/10 p-5 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out transform ${
          active 
            ? "translate-y-[-48px] scale-[0.94] opacity-80" 
            : "translate-y-[-10px] scale-[0.90] opacity-40"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-stone-300">platform.architecture.ts</span>
          </div>
          <span className="text-[#FF5A00] font-semibold text-[11px]">TypeScript 5.8</span>
        </div>
        <div className="space-y-1.5 font-mono text-[11px] leading-relaxed text-stone-300">
          <p><span className="text-purple-400">export async function</span> <span className="text-blue-400">bootstrapEnterprise</span>() &#123;</p>
          <p className="pl-4 text-stone-400">&#47;&#47; Next.js 16 SSR + High concurrency multi-tenant pool</p>
          <p className="pl-4"><span className="text-purple-400">const</span> stack = <span className="text-amber-400">await</span> initStack(&#123; <span className="text-cyan-400">type</span>: <span className="text-emerald-300">&quot;HYBRID_CORE&quot;</span> &#125;);</p>
          <p className="pl-4"><span className="text-purple-400">return</span> stack.<span className="text-blue-400">deploy</span>(&#123; <span className="text-cyan-400">strictLatencySla</span>: <span className="text-emerald-300">&quot;&lt;40ms&quot;</span> &#125;);</p>
          <p>&#125;</p>
        </div>
      </div>

      {/* Layer 2: Main Application Dashboard (Center stage) */}
      <div 
        className={`relative z-10 w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#14141E] to-[#0D0D14] border border-[#FF5A00]/30 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-700 ease-out transform ${
          active ? "translate-y-0 scale-100 opacity-100 shadow-[#FF5A00]/10" : "translate-y-8 scale-95 opacity-50"
        }`}
      >
        {/* Top App Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#FF5A00] flex items-center justify-center text-white font-black text-xs shadow-md">
              K
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">KASH Enterprise Workspace</div>
              <div className="text-[10px] text-stone-400 font-mono">v4.0.0-production &bull; cluster-fra1</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            99.98% SLA
          </div>
        </div>

        {/* Dashboard Metrics Matrix */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Edge Latency</span>
            <span className="text-base font-extrabold text-white mt-1 block">28ms</span>
            <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block">&uarr; 3.2x faster</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">API Ingestion</span>
            <span className="text-base font-extrabold text-white mt-1 block">14.8k/s</span>
            <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block">Zero dropped events</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Type Safety</span>
            <span className="text-base font-extrabold text-[#FF5A00] mt-1 block">100%</span>
            <span className="text-[9px] text-stone-400 font-mono mt-0.5 block">Strict ts-checked</span>
          </div>
        </div>

        {/* Modular Layer Stacks */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <Layers className="w-4 h-4 text-[#FF5A00]" />
              <span>Full-Stack Next.js 16 Web Framework</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> compiled
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>High-Concurrency Relational PostgreSQL</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> pooled
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Cross-Platform React Native &amp; Mobile UI</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> synced
            </span>
          </div>
        </div>
      </div>

      {/* Layer 3: Floating Telemetry Badge (Front foreground) */}
      <div 
        className={`absolute z-20 -bottom-2 right-4 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] p-3 text-white shadow-xl border border-white/20 transition-all duration-700 delay-150 ease-out transform ${
          active ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-90"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-tight">Zero-Lockin Architecture</div>
            <div className="text-[9px] text-white/80 font-mono">100% Client Codebase Ownership</div>
          </div>
        </div>
      </div>
    </div>
  );
}
