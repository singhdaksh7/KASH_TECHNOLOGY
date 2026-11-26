"use client";

import { useEffect, useState } from "react";
import { 
  Shield, 
  Check, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { adminClient, errorMessage, type RoleItem } from "@/lib/admin-client";
import { PERMISSION_GROUPS } from "@/lib/rbac/matrix";
import { 
  AdminPage, 
  PageHeader, 
  Card, 
  StatusBadge, 
  Skeleton 
} from "@/components/admin/ui";

const DESC: Record<string, string> = {
  SUPER_ADMIN: "Complete, unrestricted access across the entire platform. System-required privilege; cannot be demoted or deactivated.",
  ADMINISTRATOR: "Manages all website content, design, SEO, media, forms, leads, and general settings. Cannot manage user credentials or roles.",
  SEO_MANAGER: "Manages search metadata, redirects, sitemaps, and indexing health. Can edit page content drafts.",
  CONTENT_EDITOR: "Drafts website pages, portfolio projects, and insights articles. Uploads media assets. Cannot publish live without approval.",
  MARKETING_MANAGER: "Manages inbound customer leads, forms, and insights content. Read-only elsewhere.",
  VIEWER: "Read-only access across the administrative dashboard.",
};

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("SUPER_ADMIN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    adminClient
      .getRoles()
      .then((data) => {
        setRoles(data);
        if (data.length > 0) setSelectedRole(data[0].name);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (key: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentRole = roles.find((r) => r.name === selectedRole) || roles[0];
  const isSuper = currentRole?.name === "SUPER_ADMIN";

  return (
    <AdminPage maxWidth="default">
      <PageHeader
        title="Roles &amp; Permissions"
        description="Review access control matrices and capability permissions granted to team members."
        breadcrumbs={[{ label: "Settings", href: "/admin/settings" }, { label: "Roles" }]}
      />

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : error ? (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: Roles List */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider font-mono block px-1">
              Select Role
            </span>
            {roles.map((r) => {
              const active = r.name === selectedRole;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.name)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? "border-[#FF5A00] bg-orange-50/20 text-[#0B0B0F] shadow-2xs font-semibold"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Shield
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-[#FF5A00]" : "text-stone-400"
                      }`}
                    />
                    <span className="text-xs truncate">{r.name.replace(/_/g, " ")}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                      active ? "bg-[#FF5A00]/10 text-[#FF5A00]" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {r.users} users
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Role Details & Permissions */}
          <div className="lg:col-span-3 space-y-5">
            {currentRole && (
              <>
                {/* Role Summary Card */}
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-semibold text-stone-900">
                          {currentRole.name.replace(/_/g, " ")}
                        </h3>
                        {isSuper && (
                          <StatusBadge variant="info" size="sm">
                            System Required
                          </StatusBadge>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                        {DESC[currentRole.name] || "Custom operational role."}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-stone-400 block font-mono">Members</span>
                      <span className="text-lg font-bold text-stone-900">
                        {currentRole.users}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* If Super Admin, show clean full access notice */}
                {isSuper ? (
                  <Card className="p-8 text-center bg-stone-50/50 border-dashed">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-stone-900">Full System Access</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                      SUPER_ADMIN has universal bypass permissions across all content, design, SEO, communications, user access, and system security protocols.
                    </p>
                  </Card>
                ) : (
                  /* Collapsible Permission Categories */
                  <div className="space-y-3">
                    {PERMISSION_GROUPS.map((group) => {
                      const isCollapsed = !!collapsedCategories[group.key];
                      const grantedInGroup = group.permissions.filter((p) =>
                        currentRole.permissions.includes(p.key)
                      );

                      return (
                        <Card key={group.key} className="overflow-hidden">
                          <div
                            onClick={() => toggleCategory(group.key)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors select-none"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-semibold text-stone-900">
                                {group.name}
                              </span>
                              <span className="text-[11px] text-stone-400">
                                ({grantedInGroup.length} of {group.permissions.length} enabled)
                              </span>
                            </div>

                            <button className="text-stone-400">
                              {isCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {!isCollapsed && (
                            <div className="p-4 pt-0 divide-y divide-stone-100 border-t border-stone-100">
                              {group.permissions.map((p) => {
                                const hasPermission = currentRole.permissions.includes(p.key);
                                return (
                                  <div
                                    key={p.key}
                                    className="py-2.5 flex items-center justify-between gap-4 text-xs"
                                  >
                                    <div className="space-y-0.5">
                                      <span className="font-medium text-stone-800">
                                        {p.description}
                                      </span>
                                      <span className="block text-[11px] font-mono text-stone-400">
                                        {p.key}
                                      </span>
                                    </div>

                                    <div>
                                      {hasPermission ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                          <Check className="w-3 h-3" /> Enabled
                                        </span>
                                      ) : (
                                        <span className="text-[11px] text-stone-400">
                                          Disabled
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  );
}
