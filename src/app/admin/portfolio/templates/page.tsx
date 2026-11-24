/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortfolioTemplateItem } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  Briefcase,
  Layers,
  ArrowRight,
  Code,
  Sparkles,
} from "lucide-react";

export default function PortfolioTemplatesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<PortfolioTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminClient.getPortfolioTemplates().then((data) => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  const handleUseTemplate = async (tpl: PortfolioTemplateItem) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name: `New ${tpl.name}`,
      slug: `${tpl.slug}-${Date.now().toString().slice(-4)}`,
      status: "Draft" as const,
      projectType: "REAL PROJECT" as const,
      category: tpl.category,
      industry: "Enterprise / Growth",
      shortDescription: tpl.description,
      fullDescription: `Comprehensive case study based on ${tpl.name} blueprint.`,
      thumbnail: "/images/projects/exora-preview.png",
      heroImage: "/images/hero/hero-laptop-composition.png",
      gallery: [],
      technologies: tpl.sampleTechStack,
      services: [tpl.category, "Custom Architecture"],
      problem: ["Operational bottlenecks and fragmentation"],
      solution: ["Engineered scalable Next.js and cloud infrastructure"],
      features: [{ title: "Modular Architecture", description: "Standardized service layers." }],
      architecture: [{ label: "Stack", description: tpl.sampleTechStack.join(", ") }],
      clickBehaviour: "Open Case Study" as const,
      seo: {
        title: `${tpl.name} Case Study | KASH Technology`,
        metaDescription: tpl.description,
        slug: tpl.slug,
        canonicalUrl: "",
        focusKeyword: tpl.name,
        secondaryKeywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        index: true,
        follow: true,
      },
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    await adminClient.saveProject(newProject);
    addToast({ title: "Case Study Initialized", message: `Created "${newProject.name}" from blueprint.`, type: "success" });
    router.push(`/admin/portfolio/${newProject.id}`);
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Portfolio Templates & Case Study Blueprints"
        subtitle="Standardized technical structures for SaaS platforms, mobile apps, ERPs, and branding campaigns"
        breadcrumbs={[{ label: "Portfolio", href: "/admin/portfolio" }, { label: "Templates" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-4 hover:border-[#FF5A00] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-[#0B0B0F]">{tpl.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF3E9] text-[#FF5A00]">
                  {tpl.category}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-3">{tpl.description}</p>

              <div className="space-y-2 py-2 border-t border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Recommended Case Study Sections
                </span>
                <div className="flex flex-wrap gap-1">
                  {tpl.recommendedSections.map((sec, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-stone-100 text-[#0B0B0F] text-[10px] font-medium">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Sample Tech Stack
                </span>
                <div className="flex flex-wrap gap-1">
                  {tpl.sampleTechStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-stone-50 border border-stone-200 text-stone-600 font-mono text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E5E2] flex justify-end">
              <button
                onClick={() => handleUseTemplate(tpl)}
                className="px-4 py-2 bg-[#FF5A00] text-white text-xs font-semibold rounded-lg hover:bg-[#e04f00] flex items-center gap-1.5"
              >
                <span>Initialize Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
