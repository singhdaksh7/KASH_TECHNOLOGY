/* eslint-disable */
"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { Plus, Trash2, ArrowRight, CornerDownRight, CheckCircle2 } from "lucide-react";

interface RedirectItem {
  id: string;
  source: string;
  destination: string;
  type: "301" | "302";
  hits: number;
}

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<RedirectItem[]>([
    { id: "r1", source: "/services/web", destination: "/services", type: "301", hits: 142 },
    { id: "r2", source: "/work", destination: "/portfolio", type: "301", hits: 391 },
    { id: "r3", source: "/case-studies", destination: "/portfolio", type: "301", hits: 88 },
  ]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [type, setType] = useState<"301" | "302">("301");
  const { addToast } = useToast();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;
    const item: RedirectItem = {
      id: `r-${Date.now()}`,
      source: source.startsWith("/") ? source : `/${source}`,
      destination: destination.startsWith("/") ? destination : `/${destination}`,
      type,
      hits: 0,
    };
    setRedirects([...redirects, item]);
    setSource("");
    setDestination("");
    addToast({ title: "Redirect Created", message: `Redirect from ${item.source} added.`, type: "success" });
  };

  const handleDelete = (id: string) => {
    setRedirects(redirects.filter((r) => r.id !== id));
    addToast({ title: "Redirect Removed", message: "Rule deleted." });
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="URL Redirects (301 / 302)"
        subtitle="Manage permanent and temporary URL path redirects for SEO preservation"
        breadcrumbs={[{ label: "Marketing" }, { label: "Redirects" }]}
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs space-y-6">
        {/* ADD RULE */}
        <form onSubmit={handleAdd} className="p-4 rounded-xl bg-stone-50 border border-[#E8E5E2] flex flex-col sm:flex-row gap-3 items-end text-xs">
          <div className="flex-1">
            <label className="block font-semibold text-[#0B0B0F] mb-1">Source Path (Old URL)</label>
            <input
              type="text"
              placeholder="/old-page"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white font-mono"
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold text-[#0B0B0F] mb-1">Destination Path (Target)</label>
            <input
              type="text"
              placeholder="/new-page"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Status Code</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"
            >
              <option value="301">301 (Permanent)</option>
              <option value="302">302 (Temporary)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#FF5A00] text-white font-semibold rounded-lg hover:bg-[#e04f00] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </form>

        {/* RULES LIST */}
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold border-b border-[#E8E5E2]">
            <tr>
              <th className="py-3 px-4">Source Path</th>
              <th className="py-3 px-4">Redirect Type</th>
              <th className="py-3 px-4">Target Destination</th>
              <th className="py-3 px-4">Hits</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E2]">
            {redirects.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50">
                <td className="py-3 px-4 font-mono font-semibold text-[#0B0B0F]">{r.source}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    HTTP {r.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[#4B5563] flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-stone-400" />
                  <span>{r.destination}</span>
                </td>
                <td className="py-3 px-4 text-stone-500 font-mono">{r.hits}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1 text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
