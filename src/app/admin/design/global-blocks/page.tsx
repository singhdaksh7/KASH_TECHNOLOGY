/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlobalBlock } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  Layers,
  Plus,
  Copy,
  Archive,
  AlertTriangle,
  ExternalLink,
  Edit,
  Save,
  CheckCircle2,
  FileCode,
  Globe,
  Sparkles,
} from "lucide-react";

export default function GlobalBlocksPage() {
  const [blocks, setBlocks] = useState<GlobalBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<GlobalBlock | null>(null);
  const [editingBlock, setEditingBlock] = useState<GlobalBlock | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getGlobalBlocks().then((data) => {
      setBlocks(data);
      if (data.length > 0) {
        setSelectedBlock(data[0]);
        setEditingBlock(JSON.parse(JSON.stringify(data[0])));
      }
      setLoading(false);
    });
  }, []);

  const handleSelect = (b: GlobalBlock) => {
    setSelectedBlock(b);
    setEditingBlock(JSON.parse(JSON.stringify(b)));
  };

  const handleSave = async () => {
    if (!editingBlock) return;
    const updated = await adminClient.saveGlobalBlock(editingBlock);
    setBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBlock(updated);
    addToast({
      title: "Global Block Updated",
      message: `Changes propagate automatically across all ${updated.usageCount} linked pages.`,
      type: "success",
    });
  };

  const handleDuplicate = async (id: string) => {
    const dup = await adminClient.duplicateGlobalBlock(id);
    if (dup) {
      setBlocks([dup, ...blocks]);
      handleSelect(dup);
      addToast({ title: "Global Block Duplicated", message: `Created "${dup.name}" copy.` });
    }
  };

  const handleToggleArchive = async (id: string) => {
    const ok = await adminClient.archiveGlobalBlock(id);
    if (ok) {
      setBlocks(
        blocks.map((b) => (b.id === id ? { ...b, isArchived: !b.isArchived } : b))
      );
      addToast({ title: "Status Updated", message: "Global block archive state changed." });
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Reusable Global Sections"
        subtitle="Manage master blocks synchronized across multiple live pages (CTAs, trust strips, founder stories)"
        breadcrumbs={[{ label: "Design" }, { label: "Global Blocks" }]}
        actions={
          <button
            onClick={() => {
              const newGb: GlobalBlock = {
                id: `gb-${Date.now()}`,
                name: "New Master CTA",
                description: "Synchronized global call-to-action block",
                category: "CTA",
                usageCount: 0,
                pagesUsing: [],
                updatedAt: new Date().toISOString().slice(0, 10),
                section: {
                  id: `sec-gb-${Date.now()}`,
                  type: "CTA",
                  order: 1,
                  enabled: true,
                  isGlobalBlock: true,
                  content: {
                    heading: "Ready to Scale Your Digital Presence?",
                    subheading: "Contact KASH Technology to discuss your project.",
                    buttonText: "Get in Touch",
                    buttonUrl: "/contact",
                  },
                  style: {
                    background: "Orange",
                    paddingTop: 4,
                    paddingBottom: 4,
                    container: "Normal",
                    alignment: "Center",
                  },
                },
              };
              setBlocks([newGb, ...blocks]);
              handleSelect(newGb);
              addToast({ title: "New Global Block", message: "Master block drafted." });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Create Master Block</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* BLOCKS LIST */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Active Master Sections ({blocks.length})
          </h4>
          {blocks.map((b) => {
            const isSelected = selectedBlock?.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => handleSelect(b)}
                className={`p-4 rounded-xl border-2 bg-white cursor-pointer transition-all shadow-xs ${
                  isSelected
                    ? "border-[#FF5A00] ring-2 ring-[#FF5A00]/20"
                    : "border-[#E8E5E2] hover:border-stone-400"
                } ${b.isArchived ? "opacity-60 bg-stone-50" : ""}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-[#0B0B0F]">{b.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF3E9] text-[#FF5A00]">
                    {b.usageCount} {b.usageCount === 1 ? "page" : "pages"}
                  </span>
                </div>
                <p className="text-[11px] text-[#4B5563] line-clamp-2">{b.description}</p>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100 text-[10px] text-stone-400">
                  <span className="font-mono">{b.category}</span>
                  <span>Updated {b.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MASTER BLOCK EDITOR & LINKED PAGES WARNING */}
        {editingBlock && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs space-y-6">
            {/* PROPAGATION ALERT BANNER */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block">Global Synchronized Instance</span>
                Editing this block will propagate immediately to all{" "}
                <strong>{editingBlock.usageCount} live pages</strong> using this master definition. You can also detach or convert instances to normal independent sections inside the individual page editor.
              </div>
            </div>

            {/* BLOCK METADATA */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Master Block Name</label>
                <input
                  type="text"
                  value={editingBlock.name}
                  onChange={(e) => setEditingBlock({ ...editingBlock, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Category Classification</label>
                <select
                  value={editingBlock.category}
                  onChange={(e) => setEditingBlock({ ...editingBlock, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs bg-white"
                >
                  <option value="CTA">CTA</option>
                  <option value="Trust & Social Proof">Trust & Social Proof</option>
                  <option value="Services & Process">Services & Process</option>
                  <option value="Brand & Team">Brand & Team</option>
                  <option value="Forms & Subscriptions">Forms & Subscriptions</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-[#0B0B0F] mb-1">Block Description / Usage Context</label>
                <input
                  type="text"
                  value={editingBlock.description}
                  onChange={(e) => setEditingBlock({ ...editingBlock, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>
            </div>

            {/* SECTION CONTENT FIELDS */}
            <div className="pt-4 border-t border-[#E8E5E2] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                  Master Content: {editingBlock.section.type}
                </h5>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono">
                  Type: {editingBlock.section.type}
                </span>
              </div>

              {editingBlock.section.content.heading !== undefined && (
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Heading</label>
                  <input
                    type="text"
                    value={(editingBlock.section.content.heading as string) || ""}
                    onChange={(e) =>
                      setEditingBlock({
                        ...editingBlock,
                        section: {
                          ...editingBlock.section,
                          content: { ...editingBlock.section.content, heading: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold"
                  />
                </div>
              )}

              {editingBlock.section.content.subheading !== undefined && (
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Subheading / Description</label>
                  <textarea
                    rows={3}
                    value={(editingBlock.section.content.subheading as string) || ""}
                    onChange={(e) =>
                      setEditingBlock({
                        ...editingBlock,
                        section: {
                          ...editingBlock.section,
                          content: { ...editingBlock.section.content, subheading: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                  />
                </div>
              )}

              {editingBlock.section.content.buttonText !== undefined && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Button Text</label>
                    <input
                      type="text"
                      value={(editingBlock.section.content.buttonText as string) || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          section: {
                            ...editingBlock.section,
                            content: { ...editingBlock.section.content, buttonText: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Button Link</label>
                    <input
                      type="text"
                      value={(editingBlock.section.content.buttonUrl as string) || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          section: {
                            ...editingBlock.section,
                            content: { ...editingBlock.section.content, buttonUrl: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PAGES CURRENTLY USING THIS BLOCK */}
            <div className="pt-4 border-t border-[#E8E5E2] space-y-2 text-xs">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-400">
                Live Pages Linked ({editingBlock.pagesUsing.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {editingBlock.pagesUsing.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/pages/${p.id}/edit`}
                    className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-stone-50 hover:bg-[#FFF9F4] hover:border-[#FF5A00] text-stone-700 hover:text-[#FF5A00] text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>{p.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                ))}
                {editingBlock.pagesUsing.length === 0 && (
                  <p className="text-stone-400 italic">This block is not currently placed on any page.</p>
                )}
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="pt-4 border-t border-[#E8E5E2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDuplicate(editingBlock.id)}
                  className="px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#4B5563] hover:bg-stone-50 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => handleToggleArchive(editingBlock.id)}
                  className="px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-50 flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{editingBlock.isArchived ? "Unarchive" : "Archive"}</span>
                </button>
              </div>

              <button
                onClick={handleSave}
                className="px-5 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-bold hover:opacity-95 shadow-sm transition-opacity flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Propagate Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
