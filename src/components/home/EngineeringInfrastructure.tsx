"use client";

import React, { useState } from "react";
import { 
  Copy,
  Check
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function EngineeringInfrastructure() {
  const [copied, setCopied] = useState(false);

  const STACK_ITEMS = [
    { title: "Next.js 16 App Router", desc: "React 19 Server Components, zero-bundle streaming, and edge caching for sub-second page loads.", tag: "FRONTEND" },
    { title: "PostgreSQL & Prisma ORM", desc: "Strict schema migrations, foreign key integrity, connection pooling, and multi-tenant row isolation.", tag: "DATABASE" },
    { title: "Docker & Linux Containers", desc: "Deterministic build artifacts with automated zero-downtime rolling deploys and volume isolation.", tag: "INFRASTRUCTURE" },
    { title: "Node.js & Python Services", desc: "Type-safe REST and RPC APIs combined with background Python microservices for document parsing.", tag: "BACKEND" },
    { title: "Cloud Edge & Traefik Routing", desc: "Automated Let's Encrypt TLS certificates, rate-limiting shields, and low-latency SSL termination.", tag: "NETWORKING" },
    { title: "Audit & RBAC Security", desc: "Fine-grained permissions, encrypted secrets, and tamper-evident audit logs on all administrative actions.", tag: "SECURITY" },
  ];

  const SAMPLE_CODE = `// KASH Production Pipeline: Multi-Tenant Schema Isolation
export async function getTenantLedger(tenantId: string, shiftId: string) {
  return await prisma.$transaction(async (tx) => {
    const shift = await tx.shiftRecord.findUniqueOrThrow({
      where: { id: shiftId, tenantId },
      include: { nozzleReadings: true, settlements: true }
    });

    const variance = shift.nozzleReadings.reduce((acc, r) => 
      acc + (r.meterEnd - r.meterStart) * r.unitPrice, 0) - shift.settledAmount;

    return { shift, variance, isBalanced: Math.abs(variance) < 1.0 };
  });
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(SAMPLE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-[#0B0B0F] text-white border-t border-white/10 overflow-hidden relative">
      <Container>
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A00] uppercase">
              ENGINEERING RIGOR // ARCHITECTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Built with production-grade engineering principles.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
            No fragile WordPress plugins. No opaque no-code tools. We build deterministic, maintainable software systems designed for longevity and audit compliance.
          </p>
        </div>

        {/* Stack Grid and Code Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Stack Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STACK_ITEMS.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-[#FF5A00]/40 transition-colors"
              >
                <span className="text-[9px] font-mono font-bold text-[#FF8A3D] bg-white/5 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
                <h3 className="text-sm font-bold text-white pt-1">{item.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Code Preview (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[10px] font-mono text-stone-400 ml-2">ledger.engine.ts</span>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="text-stone-400 hover:text-white transition-colors p-1"
                title="Copy code"
                aria-label="Copy snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-stone-300 leading-relaxed overflow-x-auto scrollbar-none">
              <code>{SAMPLE_CODE}</code>
            </pre>
            <div className="p-3 border-t border-white/10 bg-white/[0.01] text-[10px] font-mono text-stone-400 flex items-center justify-between">
              <span>TypeScript Strict Mode</span>
              <span className="text-emerald-400">Zero Type Errors</span>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
