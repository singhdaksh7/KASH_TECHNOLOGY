"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage, type RoleItem } from "@/lib/admin-client";
import { PERMISSION_GROUPS } from "@/lib/rbac/matrix";
import { Shield, Check, Lock, Users } from "lucide-react";

const DESC: Record<string, string> = {
  SUPER_ADMIN: "Complete, unrestricted access. System-required privilege; cannot be deleted or deprived of rights.",
  ADMINISTRATOR: "Manages all content, SEO, media, forms, leads and settings. Cannot manage users.",
  SEO_MANAGER: "Search metadata, redirects and indexing. Can edit page content but cannot publish or manage users.",
  CONTENT_EDITOR: "Drafts pages, portfolio and articles and uploads media. Cannot publish or change system settings.",
  MARKETING_MANAGER: "Leads, forms and Insights content. Read-only elsewhere.",
  VIEWER: "Read-only access to content dashboards.",
};

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("SUPER_ADMIN");
  const [error, setError] = useState("");

  useEffect(() => {
    adminClient
      .getRoles()
      .then((data) => {
        setRoles(data);
        if (data.length > 0) setSelectedRole(data[0].name);
      })
      .catch((e) => setError(errorMessage(e)));
  }, []);

  const currentRole = roles.find((r) => r.name === selectedRole) || roles[0];
  const isSuper = currentRole?.name === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Roles & Permissions Matrix"
        subtitle="Declarative permission matrix grouping capabilities across Content, SEO, Leads, Media, System and Security."
        breadcrumbs={[{ label: "System" }, { label: "Roles" }]}
      />

      {error && (
        <p role="alert" className="text-xs text-red-600 px-6">
          {error}
        </p>
      )}

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl">
        {/* Role Select Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {roles.map((r) => {
            const active = r.name === selectedRole;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  active
                    ? "bg-[#0B0B0F] text-white border-[#0B0B0F] shadow-sm"
                    : "bg-white text-stone-600 border-[#E8E5E2] hover:bg-stone-50"
                }`}
              >
                <Shield className={`w-3.5 h-3.5 ${active ? "text-[#FF5A00]" : "text-stone-400"}`} />
                <span>{r.name.replace(/_/g, " ")}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {r.users}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Summary */}
        {currentRole && (
          <div className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-base text-[#0B0B0F]">
                  {currentRole.name.replace(/_/g, " ")}
                </h3>
                {isSuper ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    <Lock className="w-3 h-3" /> System Protected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                    Standard Role
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4B5563]">{DESC[currentRole.name] || "Standard system role."}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-stone-400" />
                <span>{currentRole.users} assigned team member{currentRole.users === 1 ? "" : "s"}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isSuper ? "ALL" : currentRole.permissions.length} privileges</span>
              </div>
            </div>
          </div>
        )}

        {/* Permission Groups Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PERMISSION_GROUPS.map((group) => {
            return (
              <div
                key={group.key}
                className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden shadow-xs flex flex-col"
              >
                <div className="px-5 py-3.5 bg-[#FFF9F4] border-b border-[#E8E5E2] flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                    {group.name}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {group.permissions.length} items
                  </span>
                </div>
                <div className="divide-y divide-[#E8E5E2] p-2 flex-1">
                  {group.permissions.map((p) => {
                    const enabled = isSuper || currentRole?.permissions.includes(p.key);
                    return (
                      <div
                        key={p.key}
                        className="p-3 flex items-start justify-between gap-3 rounded-lg hover:bg-stone-50/70 transition-colors"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#0B0B0F]">
                              {p.key}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-normal">
                            {p.description}
                          </p>
                        </div>
                        <div className="shrink-0 pt-0.5">
                          {enabled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-3 h-3" /> Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-400">
                              Off
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
