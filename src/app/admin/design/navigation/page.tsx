"use client";

import React, { useState, useEffect } from "react";
import { newId } from "@/lib/admin-client/ids";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import type { EnhancedNavigationItem } from "@/lib/cms/navigation-types";
import {
  Plus,
  Trash2,
  Save,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Laptop,
  Smartphone,
  Layers,
} from "lucide-react";

export default function NavigationEditorPage() {
  const [navLinks, setNavLinks] = useState<EnhancedNavigationItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getNavigation().then((data) => {
      setNavLinks(data as EnhancedNavigationItem[]);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const sanitized = navLinks.map((l) => ({
        ...l,
        openNewTab: !!l.openNewTab,
        visible: l.visible !== false,
      }));
      await adminClient.saveNavigation(sanitized);
      addToast({
        title: "Navigation Saved",
        message: "Navbar and mega-menu hierarchy updated.",
        type: "success",
      });
    } catch {
      addToast({ title: "Could not save", message: "Failed to persist navigation.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = () => {
    const newLink: EnhancedNavigationItem = {
      id: newId("nav"),
      label: "New Menu Item",
      url: "/services",
      type: "link",
      openNewTab: false,
      visible: true,
      items: [],
    };
    setNavLinks([...navLinks, newLink]);
    setExpandedId(newLink.id);
  };

  const handleRemove = (id: string) => {
    setNavLinks(navLinks.filter((n) => n.id !== id));
  };

  const handleMove = (index: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= navLinks.length) return;
    const updated = [...navLinks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setNavLinks(updated);
  };

  const handleAddChild = (parentId: string) => {
    const updated = navLinks.map((item) => {
      if (item.id === parentId) {
        const items = item.items || [];
        return {
          ...item,
          type: (item.type === "link" ? "dropdown" : item.type) as "dropdown" | "mega",
          items: [
            ...items,
            {
              id: newId("nav_sub"),
              label: "Child Page",
              url: "/services/sub-page",
              description: "Short feature description",
            },
          ],
        };
      }
      return item;
    });
    setNavLinks(updated);
  };

  const handleRemoveChild = (parentId: string, childId: string) => {
    const updated = navLinks.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          items: (item.items || []).filter((c) => c.id !== childId),
        };
      }
      return item;
    });
    setNavLinks(updated);
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Navigation & Hierarchy Editor"
        subtitle="Manage website navigation: nested dropdowns, mega menus, badges, device visibility, and promotional cards."
        breadcrumbs={[{ label: "Design" }, { label: "Navigation" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddLink}
              className="px-3.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#0B0B0F] hover:bg-stone-50 flex items-center gap-1.5 bg-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Menu Item</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-4 py-1.5 bg-[#FF5A00] text-white rounded-lg text-xs font-bold hover:bg-[#FF8A3D] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving…" : "Save Hierarchy"}</span>
            </button>
          </div>
        }
      />

      <div className="px-4 sm:px-6 max-w-5xl space-y-4">
        {loading && <p className="text-xs text-stone-400">Loading menu hierarchy…</p>}

        <div className="space-y-3">
          {navLinks.map((link, idx) => {
            const isExpanded = expandedId === link.id;
            return (
              <div
                key={link.id}
                className="rounded-2xl border border-[#E8E5E2] bg-white overflow-hidden shadow-xs transition-all"
              >
                <div className="p-3.5 bg-white flex items-center gap-3 text-xs border-b border-[#E8E5E2]/60">
                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === navLinks.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : link.id)}
                    className="p-1 text-stone-400 hover:text-[#0B0B0F]"
                    title="Toggle children"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...navLinks];
                          updated[idx].label = e.target.value;
                          setNavLinks(updated);
                        }}
                        placeholder="Label (e.g. Services)"
                        className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg bg-stone-50 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...navLinks];
                          updated[idx].url = e.target.value;
                          setNavLinks(updated);
                        }}
                        placeholder="/services"
                        className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg bg-stone-50 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <select
                        value={link.type || "link"}
                        onChange={(e) => {
                          const updated = [...navLinks];
                          updated[idx].type = e.target.value as "link" | "dropdown" | "mega" | "cta";
                          setNavLinks(updated);
                        }}
                        className="w-full px-2 py-1.5 border border-[#E8E5E2] rounded-lg bg-stone-50 text-[11px] font-semibold text-stone-700"
                      >
                        <option value="link">Link</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="mega">Mega Menu</option>
                        <option value="cta">CTA Button</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-2 text-stone-400">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...navLinks];
                          updated[idx].desktopOnly = !updated[idx].desktopOnly;
                          if (updated[idx].desktopOnly) updated[idx].mobileOnly = false;
                          setNavLinks(updated);
                        }}
                        title={link.desktopOnly ? "Desktop only" : "All devices"}
                        className={`p-1.5 rounded ${link.desktopOnly ? "bg-stone-200 text-[#0B0B0F]" : "hover:text-stone-700"}`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...navLinks];
                          updated[idx].mobileOnly = !updated[idx].mobileOnly;
                          if (updated[idx].mobileOnly) updated[idx].desktopOnly = false;
                          setNavLinks(updated);
                        }}
                        title={link.mobileOnly ? "Mobile only" : "All devices"}
                        className={`p-1.5 rounded ${link.mobileOnly ? "bg-stone-200 text-[#0B0B0F]" : "hover:text-stone-700"}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...navLinks];
                          updated[idx].visible = !updated[idx].visible;
                          setNavLinks(updated);
                        }}
                        className="p-1.5 text-stone-500 hover:text-[#0B0B0F]"
                        title={link.visible ? "Visible" : "Hidden"}
                      >
                        {link.visible ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                        )}
                      </button>

                      <button
                        onClick={() => handleRemove(link.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-[#FAF9F8] space-y-3 border-t border-[#E8E5E2]/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-stone-400" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0B0F]">
                          Nested Items ({link.items?.length || 0})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddChild(link.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5A00] hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Nested Item
                      </button>
                    </div>

                    {link.items && link.items.length > 0 ? (
                      <div className="space-y-2 pl-4 border-l-2 border-stone-200">
                        {link.items.map((sub, sIdx) => (
                          <div
                            key={sub.id}
                            className="bg-white p-2.5 rounded-xl border border-[#E8E5E2] flex items-center gap-3 text-xs"
                          >
                            <input
                              type="text"
                              value={sub.label}
                              onChange={(e) => {
                                const updated = [...navLinks];
                                updated[idx].items![sIdx].label = e.target.value;
                                setNavLinks(updated);
                              }}
                              placeholder="Sub-item Label"
                              className="w-1/3 px-2 py-1 border border-[#E8E5E2] rounded text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={sub.url}
                              onChange={(e) => {
                                const updated = [...navLinks];
                                updated[idx].items![sIdx].url = e.target.value;
                                setNavLinks(updated);
                              }}
                              placeholder="/services/target"
                              className="w-1/3 px-2 py-1 border border-[#E8E5E2] rounded text-xs font-mono"
                            />
                            <input
                              type="text"
                              value={sub.badge || ""}
                              onChange={(e) => {
                                const updated = [...navLinks];
                                updated[idx].items![sIdx].badge = e.target.value;
                                setNavLinks(updated);
                              }}
                              placeholder="Badge (e.g. New)"
                              className="w-1/4 px-2 py-1 border border-[#E8E5E2] rounded text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveChild(link.id, sub.id)}
                              className="p-1 text-stone-400 hover:text-red-600"
                              title="Delete sub-item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic pl-4">
                        No nested sub-items. This item functions as a direct top-level link.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
