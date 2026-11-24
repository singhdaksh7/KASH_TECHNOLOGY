/* eslint-disable */
"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { Save, Shield, Database, Globe, Bell, Lock } from "lucide-react";

export default function SystemSettingsPage() {
  const { addToast } = useToast();
  const [siteName, setSiteName] = useState("KASH Technology");
  const [canonicalDomain, setCanonicalDomain] = useState("kash-technology.com");
  const [require2fa, setRequire2fa] = useState(true);
  const [notifyLeads, setNotifyLeads] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ title: "Settings Saved", message: "System preferences updated.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="System Settings"
        subtitle="Global platform preferences, security enforcement, email dispatch, and canonical domain"
        breadcrumbs={[{ label: "System" }, { label: "Settings" }]}
      />

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs max-w-3xl space-y-6 text-xs">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FF5A00]" />
            <span>Site Identity</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Site Title</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0B0B0F] mb-1">Primary Canonical Domain</label>
              <input
                type="text"
                value={canonicalDomain}
                onChange={(e) => setCanonicalDomain(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E5E2]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FF5A00]" />
            <span>Security & Authentication</span>
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B0B0F]">
              <input
                type="checkbox"
                checked={require2fa}
                onChange={(e) => setRequire2fa(e.target.checked)}
                className="rounded text-[#FF5A00]"
              />
              <span>Mandate TOTP Two-Factor Authentication for all Admin Accounts</span>
            </label>
            <p className="text-[11px] text-[#4B5563] pl-5">
              Requires Google Authenticator or 1Password setup before dashboard access is permitted.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E5E2]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F] mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF5A00]" />
            <span>Notifications</span>
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B0B0F]">
              <input
                type="checkbox"
                checked={notifyLeads}
                onChange={(e) => setNotifyLeads(e.target.checked)}
                className="rounded text-[#FF5A00]"
              />
              <span>Email Founder immediately on new lead capture</span>
            </label>
            <p className="text-[11px] text-[#4B5563] pl-5">
              Dispatches transactional alert to founder@kash-technology.com via Resend.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E5E2] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#FF5A00] text-white rounded-lg font-semibold hover:bg-[#e04f00] flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
