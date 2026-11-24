/* eslint-disable */
"use client";

import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Shield, Check, X } from "lucide-react";

const ROLES_MATRIX = [
  {
    role: "Super Admin",
    desc: "Complete, unrestricted access across all CMS, code injection, credentials, and settings.",
    permissions: ["Full CMS Access", "Deploy Authority", "User & Role Management", "Code Injection", "Billing & Integrations"],
  },
  {
    role: "Administrator",
    desc: "Full management of pages, portfolio, forms, and marketing settings without core code access.",
    permissions: ["Full CMS Access", "User Management (Standard)", "SEO & Media Management", "No Custom Code"],
  },
  {
    role: "SEO Manager",
    desc: "Dedicated control over search metadata, slugs, redirects, indexing flags, and sitemaps.",
    permissions: ["SEO Metadata Edits", "Redirects Management", "Analytics & Audit Logs", "Read-only CMS"],
  },
  {
    role: "Content Editor",
    desc: "Drafts and updates text, case studies, insights, and media library assets.",
    permissions: ["Draft / Edit Content", "Upload Media", "No Publishing Directly", "No System Settings"],
  },
  {
    role: "Marketing Manager",
    desc: "Access to CRM leads, form submissions, campaign tracking, and customer communications.",
    permissions: ["CRM Leads Pipeline", "Form Submissions", "Marketing Analytics", "Read-only Content"],
  },
  {
    role: "Viewer",
    desc: "Read-only audit access across all content and project dashboards.",
    permissions: ["View Content Only", "No Edit Permissions", "No Asset Deletion"],
  },
];

export default function RolesManagementPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Roles & Permissions Matrix"
        subtitle="Role-based access control (RBAC) definitions and capability boundaries"
        breadcrumbs={[{ label: "System" }, { label: "Roles" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES_MATRIX.map((r) => (
          <div key={r.role} className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] text-[#FF5A00] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#0B0B0F]">{r.role}</h4>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">{r.desc}</p>

            <div className="pt-2 border-t border-[#E8E5E2] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-stone-400">Granted Capabilities</span>
              {r.permissions.map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-xs text-stone-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
