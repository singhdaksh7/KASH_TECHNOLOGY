/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PortfolioItem, ProjectKind, ProjectStatus } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  ImageIcon,
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Code,
  FileText,
} from "lucide-react";

export default function PortfolioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const projectId = params.id as string;
  const isNew = projectId === "new" || !projectId;

  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "media" | "seo">("overview");

  // Media Picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"thumbnail" | "heroImage" | "gallery">("thumbnail");

  useEffect(() => {
    if (isNew) {
      setProject({
        id: `proj-${Date.now()}`,
        name: "New Showcase Project",
        slug: "new-showcase-project",
        status: "Draft",
        projectType: "REAL PROJECT",
        category: "Web Platform",
        industry: "Enterprise",
        shortDescription: "A modern platform built with high performance and scalable architecture.",
        fullDescription: "Detailed case study description highlighting problem, solution, and technical impact.",
        thumbnail: "/images/projects/exora-preview.png",
        heroImage: "/images/hero/hero-laptop-composition.png",
        gallery: [],
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        services: ["Web Development", "UI/UX Design"],
        problem: ["Fragmented legacy tooling", "High manual overhead"],
        solution: ["Unified reactive dashboard", "Automated pipelines"],
        features: [{ title: "Automated Workflows", description: "Streamlined operational data syncing." }],
        architecture: [{ label: "Frontend", description: "Next.js 16 with SSR & Static caching." }],
        clickBehaviour: "Open Case Study",
        seo: {
          title: "New Project | KASH Technology",
          metaDescription: "Case study for KASH Technology project deliverable.",
          slug: "new-showcase-project",
          canonicalUrl: "",
          focusKeyword: "project",
          secondaryKeywords: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
          index: true,
          follow: true,
        },
        updatedAt: new Date().toISOString().slice(0, 10),
      });
      setLoading(false);
    } else {
      adminClient.getProject(projectId).then((data) => {
        if (data) setProject(data);
        setLoading(false);
      });
    }
  }, [projectId, isNew]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-semibold text-red-600">Project not found.</p>
        <Link href="/admin/portfolio" className="text-xs text-[#FF5A00] underline mt-2 inline-block">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    const updated: PortfolioItem = {
      ...project,
      status: publish ? "Published" : project.status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    await adminClient.saveProject(updated);
    setProject(updated);
    setSaving(false);
    addToast({
      title: publish ? "Project Published" : "Project Saved",
      message: `Changes for "${updated.name}" updated successfully.`,
      type: "success",
    });
    if (isNew) {
      router.push(`/admin/portfolio/${updated.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title={isNew ? "Create Portfolio Project" : `Edit: ${project.name}`}
        subtitle="Manage project details, screenshots, technical breakdown, and case study content"
        breadcrumbs={[{ label: "Portfolio", href: "/admin/portfolio" }, { label: project.name }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/portfolio"
              className="px-3.5 py-2 border border-[#E8E5E2] text-xs font-semibold rounded-lg text-[#4B5563] hover:bg-stone-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#0B0B0F] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-semibold rounded-lg shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
          </div>
        }
      />

      {/* TABS */}
      <div className="flex border-b border-[#E8E5E2] bg-white rounded-t-xl px-4 pt-1">
        {(["overview", "content", "media", "seo"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab
                ? "border-[#FF5A00] text-[#FF5A00]"
                : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"
            }`}
          >
            {tab === "overview"
              ? "1. Overview & Type"
              : tab === "content"
              ? "2. Case Study Breakdown"
              : tab === "media"
              ? "3. Screenshots & Assets"
              : "4. SEO & Linkage"}
          </button>
        ))}
      </div>

      {/* FORM BODY */}
      <div className="bg-white rounded-b-xl border border-[#E8E5E2] border-t-0 p-6 space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-4 max-w-3xl text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={project.slug}
                  onChange={(e) => setProject({ ...project, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Project Kind</label>
                <select
                  value={project.projectType}
                  onChange={(e) => setProject({ ...project, projectType: e.target.value as ProjectKind })}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-medium"
                >
                  <option value="REAL PROJECT">REAL PROJECT</option>
                  <option value="PROTOTYPE">PROTOTYPE</option>
                  <option value="CONCEPT">CONCEPT</option>
                </select>
                <p className="text-[10px] text-stone-400 mt-1">Authenticity gate: clearly flags deliverable level</p>
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Category</label>
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => setProject({ ...project, category: e.target.value })}
                  placeholder="e.g. ERP / SaaS, Web Platform"
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Industry</label>
                <input
                  type="text"
                  value={project.industry}
                  onChange={(e) => setProject({ ...project, industry: e.target.value })}
                  placeholder="e.g. EdTech, Operations"
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Short Description (Card Summary)</label>
              <textarea
                rows={2}
                value={project.shortDescription}
                onChange={(e) => setProject({ ...project, shortDescription: e.target.value })}
                className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Full Executive Overview</label>
              <textarea
                rows={4}
                value={project.fullDescription}
                onChange={(e) => setProject({ ...project, fullDescription: e.target.value })}
                className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={project.technologies.join(", ")}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Services Provided (Comma-separated)</label>
                <input
                  type="text"
                  value={project.services.join(", ")}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      services: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-5 max-w-3xl text-xs">
            {/* Problem Statements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[#0B0B0F]">Client Challenges / Problems</label>
                <button
                  type="button"
                  onClick={() => setProject({ ...project, problem: [...project.problem, ""] })}
                  className="text-[#FF5A00] font-semibold text-[11px] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Challenge
                </button>
              </div>
              {project.problem.map((prob, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={prob}
                    onChange={(e) => {
                      const updated = [...project.problem];
                      updated[idx] = e.target.value;
                      setProject({ ...project, problem: updated });
                    }}
                    placeholder="Describe specific friction or problem"
                    className="flex-1 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = project.problem.filter((_, i) => i !== idx);
                      setProject({ ...project, problem: updated });
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Solutions Delivered */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[#0B0B0F]">Engineered Solutions</label>
                <button
                  type="button"
                  onClick={() => setProject({ ...project, solution: [...project.solution, ""] })}
                  className="text-[#FF5A00] font-semibold text-[11px] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Solution
                </button>
              </div>
              {project.solution.map((sol, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sol}
                    onChange={(e) => {
                      const updated = [...project.solution];
                      updated[idx] = e.target.value;
                      setProject({ ...project, solution: updated });
                    }}
                    placeholder="Describe technical implementation delivered"
                    className="flex-1 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = project.solution.filter((_, i) => i !== idx);
                      setProject({ ...project, solution: updated });
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Architecture Highlights */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[#0B0B0F]">Architecture & Tech Highlights</label>
                <button
                  type="button"
                  onClick={() =>
                    setProject({
                      ...project,
                      architecture: [...project.architecture, { label: "Layer", description: "Details" }],
                    })
                  }
                  className="text-[#FF5A00] font-semibold text-[11px] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Highlight
                </button>
              </div>
              {project.architecture.map((arch, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
                  <input
                    type="text"
                    value={arch.label}
                    onChange={(e) => {
                      const updated = [...project.architecture];
                      updated[idx].label = e.target.value;
                      setProject({ ...project, architecture: updated });
                    }}
                    placeholder="Layer / Area"
                    className="col-span-4 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={arch.description}
                    onChange={(e) => {
                      const updated = [...project.architecture];
                      updated[idx].description = e.target.value;
                      setProject({ ...project, architecture: updated });
                    }}
                    placeholder="Implementation specification"
                    className="col-span-7 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = project.architecture.filter((_, i) => i !== idx);
                      setProject({ ...project, architecture: updated });
                    }}
                    className="col-span-1 p-1.5 text-stone-400 hover:text-red-600 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-6 max-w-3xl text-xs">
            {/* Thumbnail */}
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Card Thumbnail Image</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-stone-100 rounded-lg overflow-hidden relative border border-[#E8E5E2] shrink-0">
                  {project.thumbnail ? (
                    <Image src={project.thumbnail} alt="Thumbnail" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={project.thumbnail}
                    onChange={(e) => setProject({ ...project, thumbnail: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget("thumbnail");
                      setMediaPickerOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#FFF3E9] text-[#FF5A00] font-semibold rounded-lg hover:bg-[#FF5A00] hover:text-white transition-colors"
                  >
                    Choose from Media Library
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Case Study Hero Composition</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-stone-100 rounded-lg overflow-hidden relative border border-[#E8E5E2] shrink-0">
                  {project.heroImage ? (
                    <Image src={project.heroImage} alt="Hero" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={project.heroImage}
                    onChange={(e) => setProject({ ...project, heroImage: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget("heroImage");
                      setMediaPickerOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#FFF3E9] text-[#FF5A00] font-semibold rounded-lg hover:bg-[#FF5A00] hover:text-white transition-colors"
                  >
                    Choose from Media Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Click Behaviour on Public Cards</label>
              <select
                value={project.clickBehaviour}
                onChange={(e) => setProject({ ...project, clickBehaviour: e.target.value as any })}
                className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
              >
                <option value="Open Case Study">Open Dedicated Case Study Page</option>
                <option value="External Website">Open External Client Website (New Tab)</option>
                <option value="Modal">Open Quickview Modal</option>
                <option value="No Link">No Link (Display Only)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">External Live URL (Optional)</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={project.externalUrl || ""}
                onChange={(e) => setProject({ ...project, externalUrl: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Case Study SEO Title</label>
              <input
                type="text"
                value={project.seo.title}
                onChange={(e) => setProject({ ...project, seo: { ...project.seo, title: e.target.value } })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={project.seo.metaDescription}
                onChange={(e) =>
                  setProject({ ...project, seo: { ...project.seo, metaDescription: e.target.value } })
                }
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          if (mediaPickerTarget === "thumbnail") {
            setProject({ ...project, thumbnail: media.url });
          } else if (mediaPickerTarget === "heroImage") {
            setProject({ ...project, heroImage: media.url });
          }
        }}
      />
    </div>
  );
}
