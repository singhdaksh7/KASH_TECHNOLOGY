/* eslint-disable */
"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Search, Filter, ShieldCheck, Clock, FileEdit, Trash2, Key } from "lucide-react";

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
}

const INITIAL_LOGS: AuditEntry[] = [
  { id: "log-1", user: "Daksh Singh", action: "Published Page", target: "/services", timestamp: "2026-11-24 16:20", ip: "103.21.124.5", status: "SUCCESS" },
  { id: "log-2", user: "Daksh Singh", action: "Updated Project", target: "Exora Case Study", timestamp: "2026-11-24 15:45", ip: "103.21.124.5", status: "SUCCESS" },
  { id: "log-3", user: "Daksh Singh", action: "Updated Theme Tokens", target: "Theme Config", timestamp: "2026-11-24 14:10", ip: "103.21.124.5", status: "SUCCESS" },
  { id: "log-4", user: "System", action: "Automated SEO Audit", target: "7 Canonical Routes", timestamp: "2026-11-24 12:00", ip: "Internal", status: "SUCCESS" },
  { id: "log-5", user: "Security Guard", action: "Failed 2FA Challenge", target: "Admin Login Gate", timestamp: "2026-11-23 23:14", ip: "194.26.29.11", status: "BLOCKED" },
];

export default function AuditLogPage() {
  const [logs] = useState<AuditEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Security & Audit Logs"
        subtitle="Immutable trail of administrative changes, logins, content revisions, and security events"
        breadcrumbs={[{ label: "System" }, { label: "Audit Log" }]}
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E8E5E2] flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none"
            />
          </div>
          <span className="text-xs text-stone-400 font-mono">Retaining 90 days of logs</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E2]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4 font-mono text-[#4B5563] whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3.5 px-4 font-bold text-[#0B0B0F]">{log.user}</td>
                <td className="py-3.5 px-4 font-medium text-stone-700">{log.action}</td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#4B5563]">{log.target}</td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400">{log.ip}</td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : log.status === "BLOCKED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
