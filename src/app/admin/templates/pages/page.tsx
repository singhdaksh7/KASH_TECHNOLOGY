/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTemplate } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileCode,
  LayoutTemplate,
  ArrowRight,
} from "lucide-react";

export default function PageTemplatesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  useEffect(() => {
    adminClient.getPageTemplates().then((data) => {
      setTemplates(data);
      if (data.length > 0) setSelectedTemplate(data[1] || data[0]);
      setLoading(false);
    });
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !newPageTitle) return;
    const slug = newPageSlug || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created = await adminClient.createPageFromTemplate(selectedTemplate.id, newPageTitle, slug);
    addToast({
      title: "Page Created from Template",
      message: `Created "${created.title}" with ${created.sections.length} predefined sections.`,
      type: "success",
    });
    setCreateModalOpen(false);
    router.push(`/admin/pages/${created.id}/edit`);
  };

  const handleDuplicate = async (id: string) => {
    const dup = await adminClient.duplicatePageTemplate(id);
    if (dup) {
      setTemplates([...templates, dup]);
      addToast({ title: "Template Duplicated", message: `Created "${dup.name}" copy.` });
    }
  };

  const handleDelete = async (id: string, isSystem: boolean) => {
    if (isSystem) {
      addToast({ title: "Action Blocked", message: "Built-in system templates cannot be deleted.", type: "error" });
      return;
    }
    if (confirm("Delete this custom page template?")) {
      const ok = await adminClient.deletePageTemplate(id);
      if (ok) {
        setTemplates(templates.filter((t) => t.id !== id));
        addToast({ title: "Template Deleted", message: "Custom template removed.", type: "info" });
      }
    }
  };

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.recommendedUse.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Page Templates Library"
        subtitle="Standardized layout blueprints for high-converting service pages, local hubs, and case studies"
        breadcrumbs={[{ label: "Content" }, { label: "Page Templates" }]}
      />

      {/* SEARCH TOOLBAR */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search templates or recommended uses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
          />
        </div>
        <p className="text-xs text-[#4B5563]">
          Showing <span className="font-bold text-[#0B0B0F]">{filtered.length}</span> standardized templates
        </p>
      </div>

      {/* TEMPLATES GRID & DETAIL INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* TEMPLATE CARDS LIST */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((tpl) => {
            const isSelected = selectedTemplate?.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#FF5A00] ring-2 ring-[#FF5A00]/20 shadow-md"
                    : "border-[#E8E5E2] hover:border-stone-400 shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-[#0B0B0F]">{tpl.name}</span>
                    {tpl.isSystem ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF3E9] text-[#FF5A00] border border-[#FF5A00]/20">
                        System Template
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed mb-3">
                    {tpl.description}
                  </p>

                  <div className="space-y-1.5 py-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Sections Included ({tpl.sections.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tpl.sections.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-stone-100 text-[#0B0B0F] text-[10px] font-medium"
                        >
                          {s.type}
                        </span>
                      ))}
                      {tpl.sections.length === 0 && (
                        <span className="text-stone-400 text-xs italic">Empty canvas</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E5E2] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 truncate max-w-[140px]">
                    {tpl.recommendedUse}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(tpl.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded"
                      title="Duplicate Template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {!tpl.isSystem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tpl.id, tpl.isSystem);
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(tpl);
                        setNewPageTitle(`${tpl.name} Draft`);
                        setNewPageSlug(tpl.slug);
                        setCreateModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-[#FF5A00] text-white text-[11px] font-semibold rounded-md hover:bg-[#e04f00] flex items-center gap-1"
                    >
                      <span>Use</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SELECTED TEMPLATE DETAILS INSPECTOR */}
        {selectedTemplate && (
          <aside className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E8E5E2]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FF5A00] uppercase tracking-wider">
                  Template Specification
                </span>
                {selectedTemplate.isSystem && (
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected Core</span>
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base text-[#0B0B0F] mt-1">{selectedTemplate.name}</h3>
              <p className="text-xs text-[#4B5563] mt-1">{selectedTemplate.description}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">Recommended Use</span>
                <p className="font-semibold text-[#0B0B0F] mt-0.5">{selectedTemplate.recommendedUse}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">Predefined Section Stack</span>
                <div className="space-y-2 mt-1.5">
                  {selectedTemplate.sections.map((sec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0B0B0F] flex items-center gap-1.5">
                          <span className="font-mono text-stone-400 text-[10px]">{idx + 1}.</span>
                          {sec.label}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-[#E8E5E2] font-mono text-[9px] text-[#FF5A00]">
                          {sec.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#4B5563] mt-0.5">{sec.description}</p>
                    </div>
                  ))}
                  {selectedTemplate.sections.length === 0 && (
                    <p className="text-stone-400 italic text-[11px]">No initial sections attached.</p>
                  )}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setNewPageTitle(`${selectedTemplate.name} Draft`);
                    setNewPageSlug(selectedTemplate.slug);
                    setCreateModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-bold hover:opacity-95 shadow-sm transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Page from this Template</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* CREATE PAGE MODAL */}
      {createModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E5E2] space-y-4">
            <h3 className="text-base font-bold text-[#0B0B0F]">
              Create Page from {selectedTemplate.name}
            </h3>
            <p className="text-xs text-[#4B5563]">
              Configure title and slug. Pre-populates all {selectedTemplate.sections.length} blueprint sections into the visual builder canvas.
            </p>

            <form onSubmit={handleCreatePage} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g. Noida Custom Software Development"
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">URL Path Slug</label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="e.g. noida-software-development"
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E5E2] rounded-lg text-[#4B5563] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-semibold hover:bg-[#e04f00]"
                >
                  Initialize in Builder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
