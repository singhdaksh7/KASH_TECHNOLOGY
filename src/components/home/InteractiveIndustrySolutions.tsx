"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  ShoppingBag, 
  Factory, 
  Truck, 
  Stethoscope, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function InteractiveIndustrySolutions() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const INDUSTRIES = [
    {
      id: "healthcare",
      name: "Healthcare & Clinics",
      icon: Stethoscope,
      headline: "HIPAA-grade patient portals, appointment booking, and diagnostic reporting.",
      example: "Dr. Ratna Saxena IVF & Fertility Centre web platform and patient inquiry workflows.",
      features: [
        "Doctor consultation scheduling",
        "Encrypted WhatsApp enquiry funnels",
        "Patient document uploads",
        "Local SEO for regional searches"
      ],
      link: "/custom-software-development",
    },
    {
      id: "education",
      name: "Education & Academics",
      icon: GraduationCap,
      headline: "Multi-tenant school ERP, student lifecycle tracking, and automated fee invoicing.",
      example: "SchoolSync academic ERP prototype supporting fee registers, student profiles, and parent alerts.",
      features: [
        "Automated fee collection via UPI/cards",
        "SMS/WhatsApp attendance notifications",
        "Academic report card generation",
        "Teacher-parent collaboration portal"
      ],
      link: "/custom-software-development",
    },
    {
      id: "retail",
      name: "Retail & Commerce",
      icon: ShoppingBag,
      headline: "Multi-outlet inventory management, billing POS, and omni-channel customer loyalty.",
      example: "Kasba Express and retail ERP systems with real-time stock reconciliation across stores.",
      features: [
        "Barcode scanner & GST billing integrations",
        "Low-stock alert triggers",
        "Customer loyalty CRM pipelines",
        "Fast Next.js storefronts"
      ],
      link: "/website-development",
    },
    {
      id: "logistics",
      name: "Logistics & Fleet",
      icon: Truck,
      headline: "Shift sales reconciliation, driver dispatch applications, and fuel station ERPs.",
      example: "FuelOps petroleum dealership management & TaxiSegrator intercity taxi network.",
      features: [
        "Nozzle dip & fuel volume audit meters",
        "Driver GPS tracking & mobile check-ins",
        "Automated daily bank deposit reconciliation",
        "Offline-first mobile logging"
      ],
      link: "/custom-software-development",
    },
    {
      id: "manufacturing",
      name: "Manufacturing & B2B",
      icon: Factory,
      headline: "Production order workflows, raw material inventories, and vendor ledger management.",
      example: "Custom B2B order portals connecting factory supply chains with regional distribution hubs.",
      features: [
        "B2B quotation & invoice generators",
        "Vendor approval maker-checker stages",
        "Real-time warehouse stock ledger",
        "High-intent B2B Google search ads"
      ],
      link: "/custom-software-development",
    },
  ];

  const current = INDUSTRIES[activeTab];

  return (
    <section className="py-24 bg-[#FFF9F4] border-b border-[#E8E5E2] overflow-hidden">
      <Container>
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A00] uppercase">
            INDUSTRY-SPECIFIC ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B0B0F] tracking-tight">
            Tailored engineering for specific domain workflows.
          </h2>
          <p className="text-base text-[#4B5563] leading-relaxed font-normal">
            We don&apos;t apply one-size-fits-all templates. Our team studies the exact operational realities, regulatory constraints, and unit economics of your industry.
          </p>
        </div>

        {/* Tab Buttons (Real buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            const isSelected = activeTab === i;
            return (
              <button
                type="button"
                key={ind.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#0B0B0F] text-white shadow-md"
                    : "bg-white border border-[#E8E5E2] text-[#4B5563] hover:text-[#0B0B0F]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#FF5A00]" : "text-stone-400"}`} />
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Industry Detail Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E5E2] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#FF5A00] font-bold uppercase tracking-wider block">
                DOMAIN EXPERTISE &bull; {current.name}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0F] tracking-tight leading-snug">
                {current.headline}
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed font-normal">
                {current.example}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {current.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-[#0B0B0F] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E5E2]">
              <Link
                href={current.link}
                className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#FF5A00] hover:text-[#0B0B0F] transition-colors"
              >
                <span>Discuss {current.name} Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-4">
            <span className="text-xs font-mono font-bold text-stone-500 uppercase block">
              Proven Delivery SLA
            </span>
            <div className="text-3xl font-extrabold text-[#0B0B0F]">
              Direct Founder Access
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed font-normal">
              Every specialized industry engagement is led directly by technical architects with deep experience in compliance, security, and database modeling.
            </p>
            <div className="p-3 rounded-xl bg-white border border-[#E8E5E2] text-xs font-mono text-stone-600">
              Deliverable: Functional MVP within 4–6 weeks with continuous live staging.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
