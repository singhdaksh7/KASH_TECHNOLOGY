"use client";

import React, { useState, useEffect } from "react";
import { NavigationLink } from "@/lib/admin-client/types";
import { newId } from "@/lib/admin-client/ids";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { Plus, Trash2, Save, MoveUp, MoveDown, Eye, EyeOff } from "lucide-react";

export default function NavigationEditorPage() {
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([]);
  const [, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getNavigation().then((data) => {
      setNavLinks(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    await adminClient.saveNavigation(navLinks);
    addToast({ title: "Navigation Saved", message: "Navbar menu structure updated.", type: "success" });
  };

  const handleAddLink = () => {
    const newLink: NavigationLink = {
      id: newId("nav"),
      label: "New Link",
      url: "/new-link",
      openNewTab: false,
      visible: true,
    };
    setNavLinks([...navLinks, newLink]);
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

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Navigation & Menus"
        subtitle="Configure top-level navbar links, dropdown items, external redirects, and link ordering"
        breadcrumbs={[{ label: "Design" }, { label: "Navigation" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddLink}
              className="px-3.5 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#0B0B0F] hover:bg-stone-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold hover:bg-[#e04f00] flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Menu</span>
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs max-w-4xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B0F]">Header Navigation Items</h4>

        <div className="space-y-3">
          {navLinks.map((link, idx) => (
            <div
              key={link.id}
              className="p-3 rounded-lg border border-[#E8E5E2] bg-stone-50 flex items-center gap-3 text-xs"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                >
                  <MoveUp className="w-3 h-3" />
                </button>
                <button
                  disabled={idx === navLinks.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                >
                  <MoveDown className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...navLinks];
                      updated[idx].label = e.target.value;
                      setNavLinks(updated);
                    }}
                    placeholder="Link Label"
                    className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded bg-white text-xs font-semibold"
                  />
                </div>

                <div className="col-span-5">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...navLinks];
                      updated[idx].url = e.target.value;
                      setNavLinks(updated);
                    }}
                    placeholder="URL Path (/services)"
                    className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded bg-white text-xs font-mono"
                  />
                </div>

                <div className="col-span-3 flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-600">
                    <input
                      type="checkbox"
                      checked={link.openNewTab}
                      onChange={(e) => {
                        const updated = [...navLinks];
                        updated[idx].openNewTab = e.target.checked;
                        setNavLinks(updated);
                      }}
                      className="rounded text-[#FF5A00]"
                    />
                    <span className="text-[11px]">New Tab</span>
                  </label>

                  <button
                    onClick={() => {
                      const updated = [...navLinks];
                      updated[idx].visible = !updated[idx].visible;
                      setNavLinks(updated);
                    }}
                    className="p-1 text-stone-500 hover:text-[#0B0B0F]"
                    title={link.visible ? "Visible" : "Hidden"}
                  >
                    {link.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-stone-400" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleRemove(link.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
