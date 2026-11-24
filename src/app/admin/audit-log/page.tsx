"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage, type AuditItem } from "@/lib/admin-client";
import { Search } from "lucide-react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    adminClient.getAuditLogs().then(setLogs).catch((e) => setError(errorMessage(e)));
  }, []);

  const q = search.toLowerCase();
  const filtered = logs.filter((l) => l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.entity.toLowerCase().includes(q));

  return (
    <div className="space-y-6">
      <AdminHeader title="Security & Audit Logs" subtitle="Every sign-in, content change, publish, role and settings change (no secrets are recorded)" breadcrumbs={[{ label: "System" }, { label: "Audit Log" }]} />
      <div className="px-4 sm:px-6 space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input type="text" placeholder="Filter by user, action or entity..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]" />
        </div>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF9F4] text-stone-500 uppercase text-[10px] tracking-wider"><tr><th className="px-4 py-3">Time (UTC)</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th></tr></thead>
            <tbody className="divide-y divide-[#E8E5E2]">
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-2.5 font-mono text-stone-500 whitespace-nowrap">{l.at}</td>
                  <td className="px-4 py-2.5 font-semibold">{l.actor}</td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded font-mono text-[11px] ${l.action.includes("failed") ? "bg-red-100 text-red-700" : "bg-stone-100 text-stone-700"}`}>{l.action}</span></td>
                  <td className="px-4 py-2.5 text-stone-600">{l.entity}{l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ""}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-stone-400">No audit events.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
