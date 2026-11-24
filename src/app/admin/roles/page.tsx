"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage, type RoleItem } from "@/lib/admin-client";
import { Shield, Check } from "lucide-react";

const DESC: Record<string, string> = {
  SUPER_ADMIN: "Complete, unrestricted access. The only role that can create or modify Super Admins.",
  ADMINISTRATOR: "Manages all content, SEO, media, forms, leads and settings. Cannot manage users.",
  SEO_MANAGER: "Search metadata, redirects and indexing. Can edit page content but cannot publish or manage users.",
  CONTENT_EDITOR: "Drafts pages, portfolio and articles and uploads media. Cannot publish or change system settings.",
  MARKETING_MANAGER: "Leads, forms and Insights content. Read-only elsewhere.",
  VIEWER: "Read-only access to content dashboards.",
};

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    adminClient.getRoles().then(setRoles).catch((e) => setError(errorMessage(e)));
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Roles & Permissions Matrix" subtitle="Backend-enforced role-based access control (RBAC). Permissions are checked on every API request." breadcrumbs={[{ label: "System" }, { label: "Roles" }]} />
      {error && <p role="alert" className="text-xs text-red-600 px-6">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-6">
        {roles.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] text-[#FF5A00] flex items-center justify-center"><Shield className="w-4 h-4" /></div>
              <div><h4 className="font-bold text-sm text-[#0B0B0F]">{r.name.replace(/_/g, " ")}</h4><span className="text-[10px] text-stone-400">{r.users} member{r.users === 1 ? "" : "s"}</span></div>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">{DESC[r.name] ?? ""}</p>
            <div className="pt-2 border-t border-[#E8E5E2] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-stone-400">{r.name === "SUPER_ADMIN" ? "All permissions" : "Granted permissions"}</span>
              {r.name !== "SUPER_ADMIN" && r.permissions.map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-xs text-stone-700"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span className="font-mono">{p}</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
