"use client";

import React, { useState, useEffect } from "react";
import { FooterConfig } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { Save } from "lucide-react";

export default function FooterEditorPage() {
  const [footer, setFooter] = useState<FooterConfig | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getFooterConfig().then((data) => setFooter(data));
  }, []);

  if (!footer) return null;

  const handleSave = async () => {
    await adminClient.saveFooterConfig(footer);
    addToast({ title: "Footer Saved", message: "Global footer settings updated.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Footer Configuration"
        subtitle="Manage verified contact info, business description, social handles, and legal notices"
        breadcrumbs={[{ label: "Design" }, { label: "Footer" }]}
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold hover:bg-[#e04f00] flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Footer</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs max-w-3xl space-y-5 text-xs">
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Agency Summary Line</label>
          <textarea
            rows={2}
            value={footer.description}
            onChange={(e) => setFooter({ ...footer, description: e.target.value })}
            className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Primary Phone</label>
            <input
              type="text"
              value={footer.phone}
              onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Official Email</label>
            <input
              type="text"
              value={footer.email}
              onChange={(e) => setFooter({ ...footer, email: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">WhatsApp Hotline</label>
            <input
              type="text"
              value={footer.whatsapp}
              onChange={(e) => setFooter({ ...footer, whatsapp: e.target.value })}
              className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono"
            />
          </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="pt-2 border-t border-[#E8E5E2]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-2">Social Channels</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-0.5">LinkedIn</label>
              <input
                type="text"
                value={footer.socialLinks.linkedin || ""}
                onChange={(e) =>
                  setFooter({
                    ...footer,
                    socialLinks: { ...footer.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-0.5">GitHub</label>
              <input
                type="text"
                value={footer.socialLinks.github || ""}
                onChange={(e) =>
                  setFooter({
                    ...footer,
                    socialLinks: { ...footer.socialLinks, github: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-0.5">Instagram</label>
              <input
                type="text"
                value={footer.socialLinks.instagram || ""}
                onChange={(e) =>
                  setFooter({
                    ...footer,
                    socialLinks: { ...footer.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-0.5">YouTube</label>
              <input
                type="text"
                value={footer.socialLinks.youtube || ""}
                onChange={(e) =>
                  setFooter({
                    ...footer,
                    socialLinks: { ...footer.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-2 border-t border-[#E8E5E2]">
          <label className="block font-semibold text-[#0B0B0F] mb-1">Copyright Line</label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
            className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
