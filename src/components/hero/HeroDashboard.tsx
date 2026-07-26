"use client";

import React from "react";
import { LayoutDashboard, ShieldCheck, RefreshCw, Circle } from "lucide-react";

export function HeroDashboard() {
  // SVG Chart path generators for a clean line chart
  const linePath = "M 0 60 Q 40 10, 80 50 T 160 20 T 240 70 T 320 30 L 320 100 L 0 100 Z";
  const lineStrokePath = "M 0 60 Q 40 10, 80 50 T 160 20 T 240 70 T 320 30";

  return (
    <div className="w-full h-full bg-[#0a0a0d] text-white flex flex-col font-sans select-none text-[10px] sm:text-xs">
      {/* Top Banner Disclaimer */}
      <div className="bg-blue-500/10 border-b border-blue-500/20 px-3 py-1 text-[8px] sm:text-[10px] text-blue-400 font-medium flex items-center justify-between">
        <span>Showcase: Product Engineering & Project Status Overview</span>
        <span className="opacity-75">Demo Data Only</span>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Compact Sidebar */}
        <div className="w-8 sm:w-12 bg-[#0e0e12] border-r border-white/5 flex flex-col items-center py-3 gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <LayoutDashboard className="w-3.5 h-3.5" />
          </div>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-[12px] sm:text-sm text-slate-100 leading-none">Product Overview</h3>
              <p className="text-[8px] sm:text-[10px] text-slate-400 mt-1">Academic & Trading Platforms</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Products: 3
            </div>
          </div>

          {/* Cards (Exora, SchoolSync, Launchpad) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between">
              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Exora</span>
              <span className="font-bold text-slate-200 mt-1 text-[10px] sm:text-xs">Web3 Exchange</span>
              <span className="text-[8px] text-blue-400 mt-0.5">Fintech System</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between">
              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">SchoolSync</span>
              <span className="font-bold text-slate-200 mt-1 text-[10px] sm:text-xs">Multi-Tenant</span>
              <span className="text-[8px] text-cyan-400 mt-0.5">ERP Solution</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between">
              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Launchpad</span>
              <span className="font-bold text-slate-200 mt-1 text-[10px] sm:text-xs">BSC Crypto</span>
              <span className="text-[8px] text-indigo-400 mt-0.5">SaaS Platform</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
            {/* Development Activity Line Chart */}
            <div className="col-span-3 bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">System Activity</span>
              <div className="flex-1 w-full relative min-h-[40px] opacity-80">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={linePath} fill="url(#chartGlow)" />
                  <path d={lineStrokePath} fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Categories Donut Chart */}
            <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Categories</span>
              <div className="flex-1 flex items-center justify-center gap-2">
                {/* SVG Donut */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="33 100" strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="33 100" strokeDashoffset="92" />
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="34 100" strokeDashoffset="59" />
                  </svg>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-1 text-[7px] sm:text-[9px]">
                  <div className="flex items-center gap-1">
                    <Circle className="w-1.5 h-1.5 fill-blue-500 stroke-none" />
                    <span className="text-slate-300">Fintech</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="w-1.5 h-1.5 fill-cyan-400 stroke-none" />
                    <span className="text-slate-300">SaaS</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="w-1.5 h-1.5 fill-indigo-500 stroke-none" />
                    <span className="text-slate-300">Web3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Recent Development Log</span>
            <div className="space-y-1 text-[8px] sm:text-[9px]">
              <div className="flex justify-between text-slate-300">
                <span>SchoolSync: Multi-tenant database migrations completed</span>
                <span className="text-slate-500">10m ago</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Exora: Matching engine trade throughput audit passed</span>
                <span className="text-slate-500">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
