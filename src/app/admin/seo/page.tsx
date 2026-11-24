"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SeoIssue } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight } from "lucide-react";

export default function SeoManagerPage() {
  const [issues, setIssues] = useState<SeoIssue[]>([]);
  const [, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  useEffect(() => {
    adminClient.getSeoIssues().then((data) => {
      setIssues(data);
      setLoading(false);
    });
  }, []);

  const filtered = issues.filter(
    (item) => filterSeverity === "ALL" || item.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="SEO Management & Health"
        subtitle="Audit on-page metadata, missing tags, canonical targets, and search indexability"
        breadcrumbs={[{ label: "Marketing" }, { label: "SEO Audit" }]}
      />

      {/* OVERVIEW SCORECARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Overall Health</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#0B0B0F]">92%</span>
            <span className="text-xs font-semibold text-green-600">Good</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Audit across 7 key canonical pages</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Critical Alerts</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-red-600">
              {issues.filter((i) => i.severity === "high").length}
            </span>
            <span className="text-xs text-red-600 font-medium">Needs Attention</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Missing titles or noindex tags</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Warnings</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-500">
              {issues.filter((i) => i.severity === "medium").length}
            </span>
            <span className="text-xs text-stone-400">Optimization</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Image ALT tags and meta length</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Canonical Coverage</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-600">100%</span>
            <span className="text-xs text-emerald-600 font-medium">SSL Verified</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">kash-technology.com canonical root</p>
        </div>
      </div>

      {/* FILTER & ISSUES TABLE */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8E5E2] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0B0B0F]">Detected SEO Optimization Items</h3>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs border border-[#E8E5E2] rounded-lg px-3 py-1.5 bg-white text-[#4B5563]"
          >
            <option value="ALL">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
            <tr>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Issue Type</th>
              <th className="py-3 px-4">Page / Path</th>
              <th className="py-3 px-4">Recommendation</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E2]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.severity === "high"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : item.severity === "medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {item.severity === "high" ? (
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                    )}
                    {item.severity}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-bold text-[#0B0B0F]">{item.type}</td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <p className="font-semibold text-[#0B0B0F]">{item.pageTitle}</p>
                  <p className="text-[11px] font-mono text-[#4B5563]">/{item.slug}</p>
                </td>

                <td className="py-3.5 px-4 text-[#4B5563] max-w-md">{item.recommendation}</td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/pages/${item.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFF3E9] text-[#FF5A00] font-semibold rounded-lg hover:bg-[#FF5A00] hover:text-white transition-colors"
                  >
                    <span>Fix In Editor</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
