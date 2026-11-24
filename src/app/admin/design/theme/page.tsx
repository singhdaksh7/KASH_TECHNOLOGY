"use client";

import React, { useState, useEffect } from "react";
import { ThemeConfig } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { Save, RotateCcw } from "lucide-react";

export default function ThemeSettingsPage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getThemeConfig().then((data) => setTheme(data));
  }, []);

  if (!theme) return null;

  const handleSave = async () => {
    await adminClient.saveThemeConfig(theme);
    addToast({ title: "Theme Saved", message: "Global visual tokens updated.", type: "success" });
  };

  const handleReset = async () => {
    const defaultTheme: ThemeConfig = {
      primaryOrange: "#FF5A00",
      secondaryOrange: "#FF8A3D",
      ivory: "#FFF9F4",
      white: "#FFFFFF",
      black: "#0B0B0F",
      bodyText: "#4B5563",
      borderColor: "#E8E5E2",
      headingFont: "Clash Display, Inter, sans-serif",
      bodyFont: "Inter, sans-serif",
      buttonRadius: 10,
      cardRadius: 16,
      containerWidth: 1280,
      sectionSpacing: "Normal",
    };
    setTheme(defaultTheme);
    await adminClient.saveThemeConfig(defaultTheme);
    addToast({ title: "Theme Reset", message: "Restored official KASH visual guidelines." });
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Theme & Brand Tokens"
        subtitle="Manage global typography, color palette, corner radii, and container layouts"
        breadcrumbs={[{ label: "Design" }, { label: "Theme" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#4B5563] hover:bg-stone-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to KASH Theme</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold hover:bg-[#e04f00] flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Theme</span>
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs max-w-3xl space-y-6 text-xs">
        {/* COLOR PALETTE */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-3">Color System</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Primary Orange</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border shadow-inner" style={{ backgroundColor: theme.primaryOrange }} />
                <input
                  type="text"
                  value={theme.primaryOrange}
                  onChange={(e) => setTheme({ ...theme, primaryOrange: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-[#E8E5E2] rounded font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Secondary Orange</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border shadow-inner" style={{ backgroundColor: theme.secondaryOrange }} />
                <input
                  type="text"
                  value={theme.secondaryOrange}
                  onChange={(e) => setTheme({ ...theme, secondaryOrange: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-[#E8E5E2] rounded font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Ivory / Warm Surface</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border shadow-inner" style={{ backgroundColor: theme.ivory }} />
                <input
                  type="text"
                  value={theme.ivory}
                  onChange={(e) => setTheme({ ...theme, ivory: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-[#E8E5E2] rounded font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Primary Black</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border shadow-inner" style={{ backgroundColor: theme.black }} />
                <input
                  type="text"
                  value={theme.black}
                  onChange={(e) => setTheme({ ...theme, black: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-[#E8E5E2] rounded font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Border Line</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border shadow-inner" style={{ backgroundColor: theme.borderColor }} />
                <input
                  type="text"
                  value={theme.borderColor}
                  onChange={(e) => setTheme({ ...theme, borderColor: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-[#E8E5E2] rounded font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TYPOGRAPHY */}
        <div className="pt-4 border-t border-[#E8E5E2]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-3">Typography</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Headings Font Family</label>
              <input
                type="text"
                value={theme.headingFont}
                onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Body Text Font Family</label>
              <input
                type="text"
                value={theme.bodyFont}
                onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* GEOMETRY & RADII */}
        <div className="pt-4 border-t border-[#E8E5E2]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-3">Geometry & Spacing</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Button Radius (px)</label>
              <input
                type="number"
                value={theme.buttonRadius}
                onChange={(e) => setTheme({ ...theme, buttonRadius: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Card Radius (px)</label>
              <input
                type="number"
                value={theme.cardRadius}
                onChange={(e) => setTheme({ ...theme, cardRadius: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Max Container Width (px)</label>
              <input
                type="number"
                value={theme.containerWidth}
                onChange={(e) => setTheme({ ...theme, containerWidth: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
