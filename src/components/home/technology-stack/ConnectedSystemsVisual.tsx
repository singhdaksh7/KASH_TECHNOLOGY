"use client";

import React from "react";
import { 
  Globe, 
  Users, 
  Boxes, 
  Smartphone, 
  BarChart3, 
  Cpu, 
  ArrowRightLeft,
  Activity
} from "lucide-react";

interface VisualProps {
  progress?: number;
  active: boolean;
}

export function ConnectedSystemsVisual({ active }: VisualProps) {
  const nodes = [
    { id: "web", name: "High-Speed Website", icon: Globe, color: "text-[#FF5A00]", pos: "top-4 left-6" },
    { id: "crm", name: "Enterprise CRM", icon: Users, color: "text-blue-400", pos: "top-4 right-6" },
    { id: "erp", name: "Operations & ERP", icon: Boxes, color: "text-amber-400", pos: "bottom-12 left-6" },
    { id: "mobile", name: "Mobile App (iOS/Android)", icon: Smartphone, color: "text-emerald-400", pos: "bottom-12 right-6" },
  ];

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-4">
      {/* Background SVG Grid and Dynamic Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 440">
        <defs>
          <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8A3D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Diagonal and Cross Connecting Paths */}
        <path 
          d="M 120 80 L 250 220 M 380 80 L 250 220 M 120 360 L 250 220 M 380 360 L 250 220" 
          stroke="rgba(255, 255, 255, 0.12)" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
        />

        {/* Active Animated Data Packets */}
        {active && (
          <>
            <path 
              d="M 120 80 L 250 220" 
              stroke="url(#connGrad)" 
              strokeWidth="2.5" 
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />
            <path 
              d="M 380 80 L 250 220" 
              stroke="url(#connGrad)" 
              strokeWidth="2.5" 
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />
            <path 
              d="M 250 220 L 120 360" 
              stroke="url(#connGrad)" 
              strokeWidth="2.5" 
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />
            <path 
              d="M 250 220 L 380 360" 
              stroke="url(#connGrad)" 
              strokeWidth="2.5" 
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />
          </>
        )}
      </svg>

      {/* Central Integration Engine Hub */}
      <div 
        className={`relative z-20 w-44 h-44 rounded-full bg-gradient-to-b from-[#181824] to-[#0A0A10] border border-[#FF5A00]/50 p-3 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-xl transition-all duration-700 ease-out transform ${
          active ? "scale-100 opacity-100 shadow-[#FF5A00]/20" : "scale-90 opacity-60"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5A00] to-[#FF8A3D] flex items-center justify-center shadow-lg mb-2">
          <ArrowRightLeft className="w-6 h-6 text-white animate-spin-slow" />
        </div>
        <div className="text-xs font-extrabold text-white tracking-wide">KASH Mesh Engine</div>
        <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center justify-center gap-1">
          <Activity className="w-3 h-3 animate-pulse" /> Live Telemetry
        </div>
        <div className="text-[9px] text-stone-400 font-mono mt-0.5">Bi-directional Webhooks</div>
      </div>

      {/* Peripheral Connected Modules */}
      {nodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            className={`absolute ${node.pos} z-10 w-48 rounded-xl bg-[#12121A]/95 border border-white/10 p-3 shadow-xl backdrop-blur-md transition-all duration-700 ease-out transform ${
              active ? "translate-y-0 opacity-100 scale-100" : "translate-y-3 opacity-40 scale-95"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${node.color}`} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{node.name}</div>
                <div className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Synced</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Top and Bottom Status Banners */}
      <div 
        className={`absolute bottom-1 z-20 flex items-center gap-4 px-4 py-2 rounded-full bg-black/70 border border-white/10 text-[11px] font-mono text-stone-300 backdrop-blur-md transition-all duration-500 ${
          active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span className="flex items-center gap-1.5 text-stone-300">
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> Unified Business Intelligence
        </span>
        <span className="text-stone-400">&bull;</span>
        <span className="flex items-center gap-1.5 text-stone-300">
          <Cpu className="w-3.5 h-3.5 text-[#FF5A00]" /> 0% Manual Data Entry
        </span>
      </div>
    </div>
  );
}
