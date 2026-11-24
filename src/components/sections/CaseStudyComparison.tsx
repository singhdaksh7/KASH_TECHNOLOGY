import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowRight, Layers, Users, TrendingUp } from "lucide-react";

export function CaseStudyComparison() {
  return (
    <section className="py-16 md:py-24 bg-white text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
      <Container className="relative z-10">
        <div className="bg-[#FFF9F4] rounded-3xl border border-[#E8E5E2] p-6 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Mockup */}
          <div className="w-full lg:w-1/2 relative aspect-16/10 rounded-2xl overflow-hidden bg-white border border-[#E8E5E2] shadow-sm">
            <Image
              src="/images/projects/portfolio-exora-hero.png"
              alt="Exora Platform Case Study"
              fill
              className="object-contain"
            />
          </div>

          {/* Right Information */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md">
              Featured Case Study
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0F] tracking-tight">
              Exora – Business Operations Platform
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              A comprehensive platform to manage leads, projects, teams, finance and client operations for growing businesses. Engineered with real-time analytics and role-based permissions.
            </p>

            {/* 3 Value Points */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                  <Layers className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>CRM + Project</span>
                </div>
                <p className="text-[10px] text-[#4B5563]">Management</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                  <Users className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Team & Client</span>
                </div>
                <p className="text-[10px] text-[#4B5563]">Collaboration</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Business</span>
                </div>
                <p className="text-[10px] text-[#4B5563]">Analytics</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/work/exora"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#FF8A3D] transition-colors shadow-sm"
              >
                <span>Read Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
