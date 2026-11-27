"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  Workflow, 
  CheckCircle2
} from "lucide-react";

export function HeroProductComposition() {
  const [activeTab, setActiveTab] = useState<"erp" | "crm" | "mobile" | "automation">("erp");

  return (
    <div className="mt-14 lg:mt-20 relative select-none sm:select-text">
      
      {/* Subtle Warm Stripe-like Ambient Gradient Glow */}
      <div 
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-[1000px] h-72 bg-gradient-to-r from-[#FF5A00]/15 via-[#FF8A3D]/20 to-[#FF5A00]/10 blur-3xl pointer-events-none rounded-full" 
        aria-hidden="true"
      />

      {/* Main Interactive Container */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0B0B0F] border border-white/10 shadow-2xl">
        
        {/* Top Window Chrome & Interactive Capability Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur-md">
          {/* OS Window Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 text-[11px] font-mono text-stone-400 hidden sm:inline-block">
              kash-system://engine/v4.2.0
            </span>
          </div>

          {/* Interactive Demo View Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("erp")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "erp"
                  ? "bg-[#FF5A00] text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              ERP Ledger
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("crm")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "crm"
                  ? "bg-[#FF5A00] text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              CRM Pipeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mobile")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "mobile"
                  ? "bg-[#FF5A00] text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Mobile App
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("automation")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "automation"
                  ? "bg-[#FF5A00] text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              AI Workflow
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE ARCHITECTURE DEMO</span>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="p-6 sm:p-8 min-h-[380px] flex items-center justify-center">
          
          {/* TAB 1: ERP OPERATIONS LEDGER (Inspired by FuelOps & Zoho ERP) */}
          {activeTab === "erp" && (
            <div className="w-full space-y-6 animate-fadeIn">
              {/* Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Today&apos;s Pump Sales</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">₹4,82,650</div>
                  <span className="text-[10px] font-mono text-emerald-400">+12.4% vs yesterday</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Reconciled Settlement</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">99.98%</div>
                  <span className="text-[10px] font-mono text-emerald-400">Zero variance detected</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Active Shift Staff</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">14 / 14</div>
                  <span className="text-[10px] font-mono text-stone-400">Biometric synced</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Database Latency</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#FF5A00]">18ms</div>
                  <span className="text-[10px] font-mono text-stone-400">PostgreSQL Edge</span>
                </div>
              </div>

              {/* Real-time Ledger Rows */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-3 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-stone-400 bg-white/[0.02]">
                  <div className="col-span-3">Nozzle / Fuel Dip</div>
                  <div className="col-span-3">Attendant</div>
                  <div className="col-span-3">Shift Volume</div>
                  <div className="col-span-3 text-right">Status</div>
                </div>
                <div className="divide-y divide-white/5 text-xs sm:text-sm">
                  {[
                    { nozzle: "Nozzle 01 (MS Power)", attendant: "Deepak S. (Shift A)", volume: "1,420.5 L", status: "Balanced" },
                    { nozzle: "Nozzle 02 (HSD Turbo)", attendant: "Rakesh K. (Shift A)", volume: "2,890.0 L", status: "Balanced" },
                    { nozzle: "Nozzle 03 (Speed Petrol)", attendant: "Sunil V. (Shift A)", volume: "980.2 L", status: "Audited" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-12 px-4 py-3.5 items-center hover:bg-white/[0.02] transition-colors">
                      <div className="col-span-3 font-mono font-medium text-white">{row.nozzle}</div>
                      <div className="col-span-3 text-stone-300">{row.attendant}</div>
                      <div className="col-span-3 font-mono text-[#FF8A3D]">{row.volume}</div>
                      <div className="col-span-3 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM SALES PIPELINE (Kanban Stage Flow) */}
          {activeTab === "crm" && (
            <div className="w-full space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#FF5A00] font-bold">KASH CRM // DEAL FUNNEL</span>
                  <span className="text-stone-500">&bull;</span>
                  <span className="text-xs text-stone-400">Total Pipeline: ₹34.5L</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">Illustrative enterprise pipeline</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stage 1: Qualified */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-300 pb-2 border-b border-white/5">
                    <span>QUALIFIED (3)</span>
                    <span className="text-[#FF5A00]">₹12.0L</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-xs font-bold text-white">Apex Logistics ERP</div>
                      <div className="text-[11px] text-stone-400">Enterprise Shift & Dispatch</div>
                      <span className="inline-block mt-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">High Intent</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-xs font-bold text-white">Dr. Saxena Clinic Portal</div>
                      <div className="text-[11px] text-stone-400">Patient Consultation Booking</div>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Proposal Sent */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-300 pb-2 border-b border-white/5">
                    <span>PROPOSAL SENT (2)</span>
                    <span className="text-[#FF5A00]">₹14.5L</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-xs font-bold text-white">Delhi NCR Retail CRM</div>
                      <div className="text-[11px] text-stone-400">Multi-outlet inventory sync</div>
                      <span className="inline-block mt-1 text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Awaiting PO</span>
                    </div>
                  </div>
                </div>

                {/* Stage 3: Won */}
                <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 pb-2 border-b border-emerald-500/20">
                    <span>WON / CONTRACTED (4)</span>
                    <span>₹8.0L</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-emerald-500/20 space-y-1">
                      <div className="text-xs font-bold text-white">SchoolSync Multi-Tenant</div>
                      <div className="text-[11px] text-stone-400">Phase 2 Invoicing Rollout</div>
                      <span className="inline-block mt-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active Build</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOBILE APP PREVIEW (Cross-Platform Interface) */}
          {activeTab === "mobile" && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 animate-fadeIn">
              {/* Phone Mockup Frame */}
              <div className="w-64 rounded-3xl border-4 border-stone-800 bg-[#0B0B0F] p-4 shadow-2xl space-y-4">
                <div className="w-16 h-4 bg-stone-800 rounded-full mx-auto" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>KASH Driver App</span>
                    <span className="text-emerald-400 font-mono">ONLINE</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FF5A00] to-[#FF8A3D] text-white space-y-1">
                    <div className="text-[10px] uppercase font-mono tracking-wider">Today&apos;s Earnings</div>
                    <div className="text-xl font-bold font-mono">₹3,450.00</div>
                    <div className="text-[10px] text-white/80">6 Completed Trips &bull; 98% Rating</div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono text-stone-400 uppercase">Incoming Trip Dispatch</div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                      <div className="text-xs font-bold text-white">Noida Sec 62 &rarr; IGI T3</div>
                      <div className="text-[10px] text-stone-400">B2B Sedan &bull; Fixed Rate ₹1,200</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Highlights beside phone */}
              <div className="max-w-md space-y-4 text-left">
                <span className="text-xs font-mono text-[#FF5A00] font-bold uppercase tracking-wider block">
                  REACT NATIVE &bull; OFFLINE FIRST
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Native ergonomics with sub-second backend sync.
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Engineered for real-world field conditions with automatic offline caching, GPS coordinate telemetry, and encrypted local storage.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Push Notifications</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Biometric Auth</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                    <span>Background Telemetry</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI & AUTOMATION WORKFLOW */}
          {activeTab === "automation" && (
            <div className="w-full space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-mono text-[#FF5A00] font-bold">AUTONOMOUS BUSINESS PIPELINE</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">Zero-touch document parser</span>
              </div>

              {/* Visual Node-based Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Node 1 */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 relative">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    STEP 01: INPUT
                  </div>
                  <div className="text-xs font-bold text-white">Vendor Invoice PDF</div>
                  <div className="text-[11px] text-stone-400">Uploaded via email or WhatsApp webhook</div>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-2xl bg-[#FF5A00]/10 border border-[#FF5A00]/30 space-y-2 relative">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#FF8A3D]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
                    STEP 02: AI OCR
                  </div>
                  <div className="text-xs font-bold text-white">LLM Parser Agent</div>
                  <div className="text-[11px] text-stone-400">Extracts line items, GSTIN &amp; bank ledger</div>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 relative">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    STEP 03: VERIFY
                  </div>
                  <div className="text-xs font-bold text-white">Audit Rule Engine</div>
                  <div className="text-[11px] text-stone-400">Cross-matches PO &amp; inventory balance</div>
                </div>

                {/* Node 4 */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    STEP 04: EXECUTE
                  </div>
                  <div className="text-xs font-bold text-white">Database Commit</div>
                  <div className="text-[11px] text-stone-400">Auto-posts journal &amp; notifies CFO</div>
                </div>
              </div>

              {/* Execution Telemetry footer */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-stone-400 gap-2">
                <span>Avg Processing Speed: <b className="text-white">1.4 seconds</b></span>
                <span>Accuracy: <b className="text-emerald-400">99.9% verified</b></span>
                <span>Audit Trail: <b className="text-white">SHA-256 logged</b></span>
              </div>
            </div>
          )}

        </div>

        {/* Real Production Telemetry Bar */}
        <div className="px-6 py-4 bg-[#0B0B0F] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-[#FF5A00]" />
            <span>KASH Production Engineering: Next.js 16 &bull; TypeScript &bull; Docker &bull; PostgreSQL</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Uptime: <b className="text-emerald-400">99.9%</b></span>
            <span>Illustrative Client Telemetry</span>
          </div>
        </div>

      </div>
    </div>
  );
}
