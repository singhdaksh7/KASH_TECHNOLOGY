"use client";

import React from "react";
import { 
  ShieldCheck, 
  Server, 
  HardDrive, 
  Lock, 
  Activity, 
  RefreshCw,
  CheckCircle,
  Cloud
} from "lucide-react";

interface VisualProps {
  progress?: number;
  active: boolean;
}

export function InfrastructureVisual({ active }: VisualProps) {
  const infraLayers = [
    {
      name: "Edge & Traffic Routing",
      desc: "Cloudflare CDN &bull; Traefik Reverse Proxy &bull; TLS 1.3 Termination",
      icon: Cloud,
      iconColor: "text-blue-400",
      status: "ACTIVE",
    },
    {
      name: "Application Runtime",
      desc: "Containerized Next.js 16 Web &bull; Node.js Microservices",
      icon: Server,
      iconColor: "text-[#FF5A00]",
      status: "HEALTHY",
    },
    {
      name: "Relational Persistence",
      desc: "PostgreSQL with connection pooling &bull; Automated WAL replication",
      icon: HardDrive,
      iconColor: "text-emerald-400",
      status: "OPTIMIZED",
    },
    {
      name: "Security & Zero-Trust",
      desc: "TOTP 2FA &bull; Strict RBAC &bull; AES-256 Encrypted Backups",
      icon: Lock,
      iconColor: "text-amber-400",
      status: "ENFORCED",
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0E0E16]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">Hardened Cloud Infrastructure</h3>
              <p className="text-[10px] text-stone-400 font-mono">Automated CI/CD &bull; Container Isolation</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            99.98% Monitored Uptime
          </div>
        </div>

        {/* Stacked Infrastructure Diagram */}
        <div className="space-y-3">
          {infraLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.name}
                className={`flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 transition-all duration-500 ease-out transform ${
                  active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-40"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${layer.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{layer.name}</h4>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5" dangerouslySetInnerHTML={{ __html: layer.desc }} />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {layer.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Operational Guardrails Row */}
        <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] font-mono text-stone-400">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
            <RefreshCw className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Nightly Automated Dumps</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Sub-Second Health Probes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
