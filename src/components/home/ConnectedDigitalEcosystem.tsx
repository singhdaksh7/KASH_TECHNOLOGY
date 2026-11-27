"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Globe, 
  Smartphone, 
  Database, 
  Workflow, 
  Palette, 
  TrendingUp, 
  Layers, 
  ArrowRight
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function ConnectedDigitalEcosystem() {
  const [selectedNode, setSelectedNode] = useState<number>(0);

  const ECOSYSTEM_NODES = [
    {
      id: "web",
      name: "High-Speed Website",
      category: "BUILD",
      icon: Globe,
      description: "Sub-second Next.js platform engineered with 95+ Core Web Vitals to capture search traffic and convert visitors.",
      link: "/website-development",
      connectedTo: ["CRM", "Marketing", "Analytics"],
    },
    {
      id: "crm",
      name: "Operational CRM",
      category: "BUILD",
      icon: Database,
      description: "Real-time pipeline tracking and automated lead routing so no commercial inquiry goes unanswered.",
      link: "/custom-software-development",
      connectedTo: ["Website", "ERP", "Automation"],
    },
    {
      id: "erp",
      name: "Enterprise ERP",
      category: "BUILD",
      icon: Layers,
      description: "Custom billing, inventory dip reconciliation, and staff shift settlements eliminating spreadsheets.",
      link: "/custom-software-development",
      connectedTo: ["CRM", "Analytics"],
    },
    {
      id: "mobile",
      name: "Mobile Applications",
      category: "BUILD",
      icon: Smartphone,
      description: "Offline-first React Native mobile applications for on-field drivers, teachers, and field operators.",
      link: "/mobile-app-development",
      connectedTo: ["ERP", "CRM"],
    },
    {
      id: "ai",
      name: "AI & Automation",
      category: "BUILD",
      icon: Workflow,
      description: "Document parsing agents and background workers that automate manual data entry and invoice audits.",
      link: "/custom-software-development",
      connectedTo: ["ERP", "Website"],
    },
    {
      id: "branding",
      name: "Brand & Video",
      category: "CREATE",
      icon: Palette,
      description: "Editorial visual identity, logo systems, and high-retention commercial video that builds buyer trust.",
      link: "/branding",
      connectedTo: ["Website", "Marketing"],
    },
    {
      id: "marketing",
      name: "Targeted Marketing",
      category: "GROW",
      icon: TrendingUp,
      description: "High-intent Google and Meta advertising funnels that channel verified buyers into your CRM.",
      link: "/digital-marketing",
      connectedTo: ["Website", "CRM"],
    },
  ];

  const current = ECOSYSTEM_NODES[selectedNode];

  return (
    <section className="py-24 bg-[#0B0B0F] text-white border-y border-white/10 overflow-hidden relative">
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FF5A00]/10 blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true" 
      />

      <Container className="relative z-10">
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A00] uppercase">
              UNIFIED DIGITAL ECOSYSTEM
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How our capabilities connect to power your business.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
            Every digital component reinforces the next. Websites funnel leads to CRMs, ERPs automate fulfillment, and brand content drives conversion efficiency.
          </p>
        </div>

        {/* Interactive Hub & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Interactive Wheel / Selector (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ECOSYSTEM_NODES.map((node, index) => {
              const Icon = node.icon;
              const isSelected = selectedNode === index;
              return (
                <button
                  type="button"
                  key={node.id}
                  onClick={() => setSelectedNode(index)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                    isSelected
                      ? "bg-white/[0.08] border-[#FF5A00] shadow-lg shadow-[#FF5A00]/10"
                      : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected ? "bg-[#FF5A00] text-white" : "bg-white/5 text-stone-400"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-wider block">
                      {node.category}
                    </span>
                    <span className="text-sm font-bold text-white block">
                      {node.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Connected Hub Visualizer (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-stone-400 uppercase">
                ACTIVE SUBSYSTEM // 0{selectedNode + 1}
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CONNECTED
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">{current.name}</h3>
              <p className="text-sm text-stone-300 leading-relaxed font-normal">
                {current.description}
              </p>
            </div>

            {/* Connected Nodes Badges */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-stone-400 block">
                Synchronized With:
              </span>
              <div className="flex flex-wrap gap-2">
                {current.connectedTo.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10"
                  >
                    &bull; {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href={current.link}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF5A00] hover:text-[#FF8A3D] transition-colors"
              >
                <span>Explore Full Service Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
