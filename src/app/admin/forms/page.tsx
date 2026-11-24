/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FormItem, FormField } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  FileText,
  Copy,
  ChevronDown,
  ChevronUp,
  Settings,
  Mail,
  HelpCircle,
  Eye,
} from "lucide-react";

export default function FormsManagerPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getForms().then((data) => {
      setForms(data);
      if (data.length > 0) setSelectedForm(data[0]);
      setLoading(false);
    });
  }, []);

  const handleAddField = (type: FormField["type"]) => {
    if (!selectedForm) return;
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: `New ${type} Field`,
      name: `field_${Date.now()}`,
      type,
      required: false,
      placeholder: `Enter ${type.toLowerCase()}...`,
    };
    const updated = {
      ...selectedForm,
      fields: [...selectedForm.fields, newField],
    };
    setSelectedForm(updated);
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleRemoveField = (fieldId: string) => {
    if (!selectedForm) return;
    const updated = {
      ...selectedForm,
      fields: selectedForm.fields.filter((f) => f.id !== fieldId),
    };
    setSelectedForm(updated);
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleSaveForm = async () => {
    if (!selectedForm) return;
    await adminClient.saveForm(selectedForm);
    addToast({ title: "Form Saved", message: `Configuration for "${selectedForm.title}" saved.`, type: "success" });
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Form Builder & Lead Capture"
        subtitle="Manage contact forms, audit quote requests, field validations, and lead routing"
        breadcrumbs={[{ label: "Marketing" }, { label: "Forms" }]}
        actions={
          <button
            onClick={() => {
              const newForm: FormItem = {
                id: `form-${Date.now()}`,
                title: "New Custom Form",
                slug: `form-${Date.now()}`,
                description: "Lead capture form",
                fields: [
                  { id: "f1", label: "Full Name", name: "name", type: "Text", required: true },
                  { id: "f2", label: "Email Address", name: "email", type: "Email", required: true },
                ],
                submitButtonText: "Submit Inquiry",
                successMessage: "Thank you for reaching out!",
                sendEmailNotification: true,
                createCrmLead: true,
                submissionsCount: 0,
                updatedAt: new Date().toISOString().slice(0, 10),
              };
              setForms([newForm, ...forms]);
              setSelectedForm(newForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </button>
        }
      />

      <div className="flex gap-6 items-start">
        {/* FORMS LIST */}
        <div className="w-80 bg-white rounded-xl border border-[#E8E5E2] p-4 shrink-0 shadow-xs space-y-2">
          <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider mb-2">Available Forms</h4>
          {forms.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedForm(f)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedForm?.id === f.id
                  ? "border-[#FF5A00] bg-[#FFF9F4] text-[#0B0B0F]"
                  : "border-[#E8E5E2] hover:bg-stone-50 text-stone-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{f.title}</span>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono">
                  {f.fields.length} fields
                </span>
              </div>
              <p className="text-[11px] text-[#4B5563] truncate mt-1">{f.description}</p>
              <p className="text-[10px] text-stone-400 mt-2 flex justify-between">
                <span>{f.submissionsCount} submissions</span>
                <span>{f.updatedAt}</span>
              </p>
            </div>
          ))}
        </div>

        {/* FORM BUILDER & FIELD CANVAS */}
        {selectedForm ? (
          <div className="flex-1 bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5E2]">
              <div>
                <input
                  type="text"
                  value={selectedForm.title}
                  onChange={(e) => setSelectedForm({ ...selectedForm, title: e.target.value })}
                  className="font-bold text-base text-[#0B0B0F] border-b border-transparent hover:border-stone-300 focus:border-[#FF5A00] focus:outline-none"
                />
                <p className="text-xs text-[#4B5563] mt-0.5 font-mono">ID: {selectedForm.slug}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveForm}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5A00] text-white text-xs font-semibold rounded-lg hover:bg-[#e04f00] shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Form</span>
                </button>
              </div>
            </div>

            {/* FIELD BUILDER CANVAS */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#0B0B0F]">Form Fields</h5>
              {selectedForm.fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-lg border border-[#E8E5E2] bg-stone-50 flex items-center gap-3 text-xs"
                >
                  <span className="text-stone-400 font-mono text-xs">{idx + 1}.</span>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-stone-400 uppercase font-semibold">Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...selectedForm.fields];
                          updated[idx].label = e.target.value;
                          setSelectedForm({ ...selectedForm, fields: updated });
                        }}
                        className="w-full px-2 py-1 border border-[#E8E5E2] rounded bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-400 uppercase font-semibold">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updated = [...selectedForm.fields];
                          updated[idx].type = e.target.value as any;
                          setSelectedForm({ ...selectedForm, fields: updated });
                        }}
                        className="w-full px-2 py-1 border border-[#E8E5E2] rounded bg-white text-xs"
                      >
                        <option value="Text">Text</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Textarea">Textarea</option>
                        <option value="Dropdown">Dropdown</option>
                        <option value="Checkbox">Checkbox</option>
                        <option value="Date">Date</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const updated = [...selectedForm.fields];
                            updated[idx].required = e.target.checked;
                            setSelectedForm({ ...selectedForm, fields: updated });
                          }}
                          className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                        />
                        <span className="font-semibold text-stone-700">Required</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* ADD FIELD PALETTE */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-[#4B5563] mb-2">Add Field to Form:</p>
              <div className="flex flex-wrap gap-2">
                {(["Text", "Email", "Phone", "Textarea", "Dropdown", "Checkbox", "Date"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => handleAddField(t)}
                      className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] text-xs font-semibold bg-white hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{t}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* SUBMISSION BEHAVIOR */}
            <div className="pt-4 border-t border-[#E8E5E2] grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Submit Button Text</label>
                <input
                  type="text"
                  value={selectedForm.submitButtonText}
                  onChange={(e) => setSelectedForm({ ...selectedForm, submitButtonText: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Success Message Banner</label>
                <input
                  type="text"
                  value={selectedForm.successMessage}
                  onChange={(e) => setSelectedForm({ ...selectedForm, successMessage: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 py-16 text-center text-stone-400">Select a form to configure</div>
        )}
      </div>
    </div>
  );
}
