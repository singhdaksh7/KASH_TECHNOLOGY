"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  BarChart2, 
  Database, 
  CheckCircle2, 
  TrendingUp, 
  CornerDownRight 
} from "lucide-react";

interface VisualProps {
  progress?: number;
  active: boolean;
}

export function AIVisual({ active }: VisualProps) {
  // Step simulation for animation:
  // 1: Question in assistant
  // 2: Processing indicator + CRM/ERP retrieval
  // 3: Structured response + Chart draw
  // 4: Suggested next actions
  const [animStep, setAnimStep] = useState(1);

  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setAnimStep(2), 500);
    const t2 = setTimeout(() => setAnimStep(3), 1200);
    const t3 = setTimeout(() => setAnimStep(4), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setAnimStep(1);
    };
  }, [active]);

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0F0F17]/95 border border-[#FF5A00]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl transition-all duration-700">
        {/* Assistant Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A00] to-[#FF8A3D] flex items-center justify-center text-white shadow-lg">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">KASH Enterprise Copilot</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                  Adaptive AI
                </span>
              </div>
              <div className="text-[10px] text-stone-400 font-mono">Connected to CRM &bull; ERP &bull; Billing</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3 h-3" /> Ready
          </div>
        </div>

        {/* 1. User Inquiry Bubble */}
        <div className="flex justify-end mb-4">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] p-3 text-white shadow-md text-xs leading-relaxed font-medium">
            &ldquo;How is our sales pipeline performing across enterprise deals this month?&rdquo;
          </div>
        </div>

        {/* 2. RAG / Data Retrieval Telemetry Indicator */}
        <div className={`transition-all duration-500 ${animStep >= 2 ? "opacity-100 max-h-16 mb-4" : "opacity-0 max-h-0 overflow-hidden"}`}>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-300">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Querying PostgreSQL + CRM Deal Ledger...</span>
            </div>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 24 records retrieved
            </span>
          </div>
        </div>

        {/* 3. Structured Response & Mini Analytics Chart */}
        <div className={`transition-all duration-700 ${animStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FF5A00]/20 flex items-center justify-center text-[#FF5A00] shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
              <p className="text-xs text-stone-200 leading-relaxed font-normal">
                Enterprise pipeline closed <strong className="text-white font-semibold">$342,000 ARR</strong> in November, up <strong className="text-emerald-400 font-semibold">+24.8%</strong> vs targets. 4 high-value deals are currently in technical negotiation.
              </p>
            </div>

            {/* Micro Chart Simulation */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-2">
                <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3 text-[#FF5A00]" /> Deal Stage Breakdown</span>
                <span className="text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Win rate 68%</span>
              </div>
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-stone-400 truncate">Contract</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#FF5A00] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animStep >= 3 ? "82%" : "0%" }} />
                  </div>
                  <span className="w-10 text-right text-stone-300">$140k</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-stone-400 truncate">Proposal</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animStep >= 3 ? "64%" : "0%" }} />
                  </div>
                  <span className="w-10 text-right text-stone-300">$115k</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-stone-400 truncate">Discovery</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animStep >= 3 ? "48%" : "0%" }} />
                  </div>
                  <span className="w-10 text-right text-stone-300">$87k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Suggested Next Actions (Contextual Decision Support) */}
        <div className={`mt-3.5 pt-3 border-t border-white/10 transition-all duration-500 ${animStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <CornerDownRight className="w-3 h-3 text-[#FF5A00]" /> Recommended Next Actions
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-stone-200 flex items-center gap-1.5 transition-colors">
              <span>Send Executive Brief to Slack</span>
              <ArrowRight className="w-3 h-3 text-[#FF5A00]" />
            </button>
            <button className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-stone-200 flex items-center gap-1.5 transition-colors">
              <span>Schedule follow-up on 4 stalled quotes</span>
              <ArrowRight className="w-3 h-3 text-[#FF5A00]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
