/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormTemplateItem } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  FileText,
  Plus,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function FormTemplatesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<FormTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminClient.getFormTemplates().then((data) => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  const handleUseTemplate = async (tpl: FormTemplateItem) => {
    const newForm = {
      id: `form-${Date.now()}`,
      title: `${tpl.name} Form`,
      slug: `${tpl.slug}-${Date.now().toString().slice(-4)}`,
      description: tpl.description,
      fields: tpl.fields,
      submitButtonText: tpl.submitButtonText,
      successMessage: tpl.successMessage,
      sendEmailNotification: true,
      createCrmLead: true,
      submissionsCount: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    await adminClient.saveForm(newForm);
    addToast({ title: "Form Created", message: `Initialized "${newForm.title}" from blueprint.`, type: "success" });
    router.push("/admin/forms");
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Form Templates Library"
        subtitle="Pre-configured form schemas for contact intake, project scoping, and free digital audits"
        breadcrumbs={[{ label: "Marketing", href: "/admin/forms" }, { label: "Form Templates" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF5A00] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-[#0B0B0F]">{tpl.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF3E9] text-[#FF5A00]">
                  {tpl.category}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-3">{tpl.description}</p>

              <div className="space-y-1.5 py-2 border-t border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Pre-configured Fields ({tpl.fields.length})
                </span>
                <div className="space-y-1">
                  {tpl.fields.map((f) => (
                    <div key={f.id} className="flex items-center justify-between text-[11px] text-stone-700">
                      <span>• {f.label}</span>
                      <span className="text-stone-400 font-mono text-[10px]">{f.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E5E2] flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-400">
                {tpl.isMultiStep ? "Multi-Step Flow" : "Single-Step"}
              </span>
              <button
                onClick={() => handleUseTemplate(tpl)}
                className="px-3.5 py-1.5 bg-[#FF5A00] text-white text-xs font-semibold rounded-lg hover:bg-[#e04f00] flex items-center gap-1.5"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
