"use client";

import React from "react";
import { 
  GitBranch, 
  Play, 
  Filter, 
  Send, 
  Database, 
  Sparkles, 
  CheckCheck
} from "lucide-react";

interface VisualProps {
  progress?: number;
  active: boolean;
}

export function WorkflowVisual({ active }: VisualProps) {
  const steps = [
    {
      id: "trigger",
      label: "Trigger Event",
      title: "New High-Value Lead Created",
      sub: "Lead Score > 85 • Source: Web & API",
      icon: Play,
      iconColor: "text-emerald-400",
      accent: "border-emerald-500/40",
      tag: "AUTO_TRIGGER",
    },
    {
      id: "eval",
      label: "Business Rules Filter",
      title: "Evaluate Deal Routing & Priority",
      sub: "Segment: Enterprise Tier • SLA: <15 mins",
      icon: Filter,
      iconColor: "text-blue-400",
      accent: "border-blue-500/40",
      tag: "RULE_ENGINE",
    },
    {
      id: "action",
      label: "Autonomous Actions",
      title: "Provision CRM + Calendar Dispatch",
      sub: "Assigned to Lead Architect • WhatsApp & Email sent",
      icon: Send,
      iconColor: "text-[#FF5A00]",
      accent: "border-[#FF5A00]/50",
      tag: "MULTI_DISPATCH",
    },
    {
      id: "sync",
      label: "State Persistence",
      title: "PostgreSQL Ledger & Webhook Broadcast",
      sub: "Event hash verified • Audit log appended",
      icon: Database,
      iconColor: "text-purple-400",
      accent: "border-purple-500/40",
      tag: "IMMUTABLE_LOG",
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-4">
      {/* Visual Canvas Wrapper */}
      <div className="w-full max-w-lg bg-[#101018]/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#FF5A00]/20 flex items-center justify-center text-[#FF5A00]">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              Configurable Workflow Canvas
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Zero-Code Rules
          </span>
        </div>

        {/* Vertical Connected Node Sequence */}
        <div className="relative pl-6 space-y-4">
          {/* Vertical Connecting Guide Line */}
          <div className="absolute left-[33px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-[#FF5A00] to-purple-500 opacity-40" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`relative flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border ${step.accent} transition-all duration-500 ease-out transform ${
                  active ? "translate-x-0 opacity-100" : "translate-x-4 opacity-40"
                }`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                {/* Node Anchor Icon */}
                <div className="relative z-10 w-8 h-8 rounded-lg bg-[#181824] border border-white/15 flex items-center justify-center shrink-0 shadow-md">
                  <Icon className={`w-4 h-4 ${step.iconColor}`} />
                </div>

                {/* Node Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      {step.label}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-stone-300">
                      {step.tag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-0.5 truncate">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5 font-normal">
                    {step.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary Banner */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCheck className="w-3.5 h-3.5" /> 100% Deterministic Execution
          </span>
          <span className="text-stone-300">Latency: ~42ms</span>
        </div>
      </div>
    </div>
  );
}
