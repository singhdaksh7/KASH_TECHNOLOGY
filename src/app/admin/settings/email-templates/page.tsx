/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import { EmailTemplateItem } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  Mail,
  Save,
  Monitor,
  Smartphone,
  CheckCircle2,
  Copy,
  Sparkles,
} from "lucide-react";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTpl, setSelectedTpl] = useState<EmailTemplateItem | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getEmailTemplates().then((data) => {
      setTemplates(data);
      if (data.length > 0) setSelectedTpl(data[0]);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!selectedTpl) return;
    const updated = await adminClient.saveEmailTemplate(selectedTpl);
    setTemplates(templates.map((t) => (t.id === updated.id ? updated : t)));
    addToast({ title: "Email Template Saved", message: `Template "${updated.name}" updated.`, type: "success" });
  };

  if (loading || !selectedTpl) return null;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Email Template Studio"
        subtitle="Configure transactional emails, inquiry confirmations, founder notifications, and team invites"
        breadcrumbs={[{ label: "Settings" }, { label: "Email Templates" }]}
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold hover:bg-[#e04f00] shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Template</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* TEMPLATES LIST */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E8E5E2] p-4 shadow-xs space-y-2">
          <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider mb-2">Available Templates</h4>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTpl(t)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTpl?.id === t.id
                  ? "border-[#FF5A00] bg-[#FFF9F4] text-[#0B0B0F]"
                  : "border-[#E8E5E2] hover:bg-stone-50 text-stone-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{t.name}</span>
                <Mail className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <p className="text-[11px] text-[#4B5563] truncate mt-1">{t.subject}</p>
            </div>
          ))}
        </div>

        {/* EDITOR FORM */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Template Name</label>
            <input
              type="text"
              value={selectedTpl.name}
              onChange={(e) => setSelectedTpl({ ...selectedTpl, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-semibold text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Subject Line</label>
            <input
              type="text"
              value={selectedTpl.subject}
              onChange={(e) => setSelectedTpl({ ...selectedTpl, subject: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Preheader / Preview Text</label>
            <input
              type="text"
              value={selectedTpl.previewText}
              onChange={(e) => setSelectedTpl({ ...selectedTpl, previewText: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Email Heading</label>
            <input
              type="text"
              value={selectedTpl.heading}
              onChange={(e) => setSelectedTpl({ ...selectedTpl, heading: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Email Body Copy</label>
            <textarea
              rows={6}
              value={selectedTpl.body}
              onChange={(e) => setSelectedTpl({ ...selectedTpl, body: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-sans leading-relaxed"
            />
          </div>

          {/* DYNAMIC VARIABLES PILLS */}
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1.5">
              Available Variables (Click to copy)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedTpl.variables.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`{{${v}}}`);
                    addToast({ title: "Variable Copied", message: `Copied {{${v}}}` });
                  }}
                  className="px-2 py-0.5 rounded bg-stone-100 hover:bg-[#FFF3E9] text-stone-700 hover:text-[#FF5A00] font-mono text-[10px] border"
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Button Text</label>
              <input
                type="text"
                value={selectedTpl.ctaText || ""}
                onChange={(e) => setSelectedTpl({ ...selectedTpl, ctaText: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Button Target Link</label>
              <input
                type="text"
                value={selectedTpl.ctaUrl || ""}
                onChange={(e) => setSelectedTpl({ ...selectedTpl, ctaUrl: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* LIVE EMAIL PREVIEW */}
        <div className="lg:col-span-4 bg-stone-100 rounded-xl border border-[#E8E5E2] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <span className="font-bold text-xs text-[#0B0B0F] uppercase tracking-wider">Live Email Mockup</span>
            <div className="flex items-center bg-white p-0.5 rounded border border-[#E8E5E2]">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1 rounded ${previewDevice === "desktop" ? "bg-stone-100 text-[#FF5A00]" : "text-stone-400"}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1 rounded ${previewDevice === "mobile" ? "bg-stone-100 text-[#FF5A00]" : "text-stone-400"}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            className={`mx-auto bg-white rounded-xl shadow-md border border-stone-200 p-6 space-y-4 transition-all ${
              previewDevice === "desktop" ? "w-full" : "w-[300px]"
            }`}
          >
            {/* Header Brand */}
            <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
              <span className="font-bold text-sm tracking-tight text-[#0B0B0F]">
                KASH <span className="text-[#FF5A00]">Technology</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Notification</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#0B0B0F]">{selectedTpl.heading}</h3>
              <p className="text-xs text-[#4B5563] whitespace-pre-line leading-relaxed">
                {selectedTpl.body
                  .replace(/\{\{name\}\}/g, "Rahul Sharma")
                  .replace(/\{\{company\}\}/g, "Apex Solutions")
                  .replace(/\{\{service\}\}/g, "Web Platform")
                  .replace(/\{\{message\}\}/g, "Need a modern, fast Next.js website for business.")
                  .replace(/\{\{admin_url\}\}/g, "https://kash-technology.com/admin")}
              </p>

              {selectedTpl.ctaText && (
                <div className="pt-2 text-center">
                  <span className="inline-block px-5 py-2 bg-[#FF5A00] text-white font-bold text-xs rounded-lg shadow-sm">
                    {selectedTpl.ctaText}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 text-center text-[10px] text-stone-400">
              {selectedTpl.footerText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
