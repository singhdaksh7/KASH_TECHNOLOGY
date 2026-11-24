"use client";

import React, { useState, useEffect } from "react";
import { HeaderConfig } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { Save } from "lucide-react";

export default function HeaderEditorPage() {
  const [header, setHeader] = useState<HeaderConfig | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getHeaderConfig().then((data) => setHeader(data));
  }, []);

  if (!header) return null;

  const handleSave = async () => {
    await adminClient.saveHeaderConfig(header);
    addToast({ title: "Header Settings Saved", message: "Global header configuration updated.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Header & Navbar Settings"
        subtitle="Manage brand logo asset, announcement ticker, sticky behaviors, and CTA actions"
        breadcrumbs={[{ label: "Design" }, { label: "Header" }]}
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold hover:bg-[#e04f00] flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Header</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs max-w-3xl space-y-5 text-xs">
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Brand Logo Path</label>
          <input
            type="text"
            value={header.logoUrl}
            onChange={(e) => setHeader({ ...header, logoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-mono"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B0B0F]">
            <input
              type="checkbox"
              checked={header.sticky}
              onChange={(e) => setHeader({ ...header, sticky: e.target.checked })}
              className="rounded text-[#FF5A00]"
            />
            <span>Sticky Header on Scroll</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B0B0F]">
            <input
              type="checkbox"
              checked={header.showAnnouncement}
              onChange={(e) => setHeader({ ...header, showAnnouncement: e.target.checked })}
              className="rounded text-[#FF5A00]"
            />
            <span>Display Announcement Bar</span>
          </label>
        </div>

        {header.showAnnouncement && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-[#E8E5E2]">
            <div>
              <label className="block text-[11px] font-semibold text-[#0B0B0F] mb-1">Announcement Copy</label>
              <input
                type="text"
                value={header.announcementText}
                onChange={(e) => setHeader({ ...header, announcementText: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#0B0B0F] mb-1">Announcement Link</label>
              <input
                type="text"
                value={header.announcementLink}
                onChange={(e) => setHeader({ ...header, announcementLink: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded bg-white text-xs font-mono"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Primary CTA Button</label>
            <input
              type="text"
              value={header.primaryCtaText}
              onChange={(e) => setHeader({ ...header, primaryCtaText: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg mb-2"
            />
            <input
              type="text"
              value={header.primaryCtaUrl}
              onChange={(e) => setHeader({ ...header, primaryCtaUrl: e.target.value })}
              placeholder="Target URL (/contact)"
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Secondary CTA Button</label>
            <input
              type="text"
              value={header.secondaryCtaText}
              onChange={(e) => setHeader({ ...header, secondaryCtaText: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg mb-2"
            />
            <input
              type="text"
              value={header.secondaryCtaUrl}
              onChange={(e) => setHeader({ ...header, secondaryCtaUrl: e.target.value })}
              placeholder="Target URL (/contact)"
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Mobile Menu Display Type</label>
          <select
            value={header.mobileMenuType}
            onChange={(e) => setHeader({ ...header, mobileMenuType: e.target.value as HeaderConfig["mobileMenuType"] })}
            className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
          >
            <option value="Drawer">Slide-Over Drawer</option>
            <option value="Dropdown">Accordion Dropdown</option>
          </select>
        </div>
      </div>
    </div>
  );
}
