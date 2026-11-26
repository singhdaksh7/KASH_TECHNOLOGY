"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage, type AuditItem } from "@/lib/admin-client";
import { Search, ChevronDown, ChevronRight, Filter } from "lucide-react";

interface AuditMetadata {
  requestId?: string;
  before?: unknown;
  after?: unknown;
  [key: string]: unknown;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminClient
      .getAuditLogs()
      .then(setLogs)
      .catch((e) => setError(errorMessage(e)));
  }, []);

  const actions = Array.from(new Set(logs.map((l) => l.action.split(".")[0])));
  const entities = Array.from(new Set(logs.map((l) => l.entity)));

  const q = search.toLowerCase();
  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.entity.toLowerCase().includes(q) ||
      (l.entityId && l.entityId.toLowerCase().includes(q));

    const matchesAction = actionFilter === "ALL" || l.action.startsWith(actionFilter);
    const matchesEntity = entityFilter === "ALL" || l.entity === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Security & Audit Logs"
        subtitle="Every administrative mutation with safe before/after change summaries and actor attribution. Passwords, tokens, and secrets are strictly scrubbed."
        breadcrumbs={[{ label: "System" }, { label: "Audit Log" }]}
      />

      <div className="px-4 sm:px-6 space-y-4 max-w-7xl">
        <div className="bg-white rounded-2xl border border-[#E8E5E2] p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Filter by actor, action or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E8E5E2] rounded-lg bg-stone-50 font-semibold"
            >
              <option value="ALL">All Action Domains</option>
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E8E5E2] rounded-lg bg-stone-50 font-semibold"
            >
              <option value="ALL">All Entity Types</option>
              {entities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-[#E8E5E2] overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF9F4] text-stone-500 uppercase text-[10px] tracking-wider border-b border-[#E8E5E2]">
              <tr>
                <th className="px-4 py-3 w-8" />
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5E2]">
              {filtered.map((l) => {
                const isExpanded = expandedId === l.id;
                const meta = (l.metadata ?? null) as AuditMetadata | null;
                const hasDetails = meta !== null && Object.keys(meta).length > 0;
                return (
                  <React.Fragment key={l.id}>
                    <tr
                      onClick={() => hasDetails && setExpandedId(isExpanded ? null : l.id)}
                      className={`${hasDetails ? "cursor-pointer hover:bg-stone-50/70" : ""} ${
                        isExpanded ? "bg-[#FFF9F4]/40" : ""
                      }`}
                    >
                      <td className="px-3 py-2.5 text-stone-400">
                        {hasDetails && (isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-stone-500 whitespace-nowrap">
                        {l.at}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-[#0B0B0F]">{l.actor}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                            l.action.includes("failed") || l.action.includes("delete")
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : l.action.includes("create") || l.action.includes("publish")
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {l.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-stone-600 font-mono">
                        {l.entity}
                        {l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ""}
                      </td>
                      <td className="px-4 py-2.5 text-right text-stone-400 font-mono text-[10px]">
                        {meta?.requestId ? `req:${meta.requestId.slice(0, 8)}` : "—"}
                      </td>
                    </tr>
                    {isExpanded && hasDetails && (
                      <tr className="bg-[#FAF9F8]">
                        <td colSpan={6} className="px-6 py-4 border-t border-stone-100">
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                              Safe Before / After Summary
                            </span>
                            {meta?.before !== undefined || meta?.after !== undefined ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                <div className="bg-white p-3 rounded-xl border border-[#E8E5E2] space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-red-600">Before</span>
                                  <pre className="text-[11px] overflow-x-auto text-stone-700 whitespace-pre-wrap">
                                    {JSON.stringify(meta.before, null, 2)}
                                  </pre>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-[#E8E5E2] space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-emerald-600">After</span>
                                  <pre className="text-[11px] overflow-x-auto text-stone-700 whitespace-pre-wrap">
                                    {JSON.stringify(meta.after, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            ) : (
                              <pre className="bg-white p-3 rounded-xl border border-[#E8E5E2] text-[11px] font-mono overflow-x-auto text-stone-700 whitespace-pre-wrap">
                                {JSON.stringify(meta, null, 2)}
                              </pre>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                    No matching audit events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
