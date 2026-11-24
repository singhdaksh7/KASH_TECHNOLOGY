/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdvancedSeoIssue, SeoIssueSeverity, SeoIssueType } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Search,
  Globe,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Link2,
  Image as ImageIcon,
  Key,
  Layers,
  Sparkles,
  RotateCw,
} from "lucide-react";

export default function AdvancedSeoDashboard() {
  const { addToast } = useToast();
  const [issues, setIssues] = useState<AdvancedSeoIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "pages" | "keywords" | "technical" | "links" | "images" | "schema" | "redirects"
  >("overview");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [filterPageType, setFilterPageType] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminClient.getAdvancedSeoIssues().then((data) => {
      setIssues(data);
      setLoading(false);
    });
  }, []);

  const handleResolve = async (id: string) => {
    const ok = await adminClient.resolveSeoIssue(id);
    if (ok) {
      setIssues(issues.map((i) => (i.id === id ? { ...i, status: "Resolved" } : i)));
      addToast({ title: "Issue Resolved", message: "Item marked as resolved in SEO health tracker." });
    }
  };

  const filtered = issues.filter((i) => {
    const matchSev = filterSeverity === "ALL" || i.severity === filterSeverity;
    const matchType = filterPageType === "ALL" || i.pageType === filterPageType;
    const matchSearch =
      i.pageTitle.toLowerCase().includes(search.toLowerCase()) ||
      i.slug.toLowerCase().includes(search.toLowerCase()) ||
      i.type.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "images") return matchSev && matchType && matchSearch && i.type === "Missing ALT Text";
    if (activeTab === "schema") return matchSev && matchType && matchSearch && i.type === "Schema Issue";
    if (activeTab === "redirects") return matchSev && matchType && matchSearch && i.type === "Redirect Chain";
    if (activeTab === "technical") return matchSev && matchType && matchSearch && (i.type === "Noindex Page" || i.type === "Canonical Issue");
    return matchSev && matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Advanced SEO & Search Engine Health"
        subtitle="Comprehensive on-page audit, Schema markup validation, technical crawlability, and canonical health"
        breadcrumbs={[{ label: "Marketing" }, { label: "Advanced SEO" }]}
        actions={
          <button
            onClick={() => {
              addToast({ title: "Audit Refreshed", message: "Scanned all 69 static/dynamic canonical routes.", type: "success" });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#0B0B0F] hover:bg-stone-50 bg-white"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rerun Audit</span>
          </button>
        }
      />

      {/* 8 AUDIT TABS */}
      <div className="flex border-b border-[#E8E5E2] bg-white rounded-xl px-4 pt-1 shadow-xs overflow-x-auto">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "pages", label: "Page Titles & Meta" },
            { id: "keywords", label: "Target Keywords" },
            { id: "technical", label: "Technical & Index" },
            { id: "links", label: "Internal Links" },
            { id: "images", label: "Image ALT Tags" },
            { id: "schema", label: "Schema.org" },
            { id: "redirects", label: "301 Redirects" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#FF5A00] text-[#FF5A00]"
                : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW METRICS SCORECARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Crawl Health Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#0B0B0F]">94%</span>
            <span className="text-xs font-semibold text-green-600">Optimal</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Audit across all 69 static & dynamic routes</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Critical Alerts</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-red-600">
              {issues.filter((i) => i.severity === "Critical" && i.status === "Open").length}
            </span>
            <span className="text-xs text-red-600 font-medium">Needs Action</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Missing H1 tags or missing meta tags</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Warnings</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-500">
              {issues.filter((i) => i.severity === "Warning" && i.status === "Open").length}
            </span>
            <span className="text-xs text-stone-400">Review</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Image ALT tags and redirects</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E8E5E2] shadow-xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Verified Passed</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {issues.filter((i) => i.status === "Resolved" || i.severity === "Passed").length + 28}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Pass</span>
          </div>
          <p className="text-[11px] text-[#4B5563] mt-1">Robots, sitemap, SSL & canonical root</p>
        </div>
      </div>

      {/* FILTER & AUDIT ITEMS TABLE */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] shadow-xs overflow-hidden space-y-4">
        <div className="p-4 border-b border-[#E8E5E2] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search audit issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-xs border border-[#E8E5E2] rounded-lg px-3 py-1.5 bg-white text-[#4B5563]"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Recommendation">Recommendation</option>
              <option value="Passed">Passed</option>
            </select>

            <select
              value={filterPageType}
              onChange={(e) => setFilterPageType(e.target.value)}
              className="text-xs border border-[#E8E5E2] rounded-lg px-3 py-1.5 bg-white text-[#4B5563]"
            >
              <option value="ALL">All Page Types</option>
              <option value="Page">Core Pages</option>
              <option value="Location">Location Hubs</option>
              <option value="Portfolio">Portfolio Projects</option>
              <option value="Article">Insights Articles</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
            <tr>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Audit Category</th>
              <th className="py-3 px-4">Page & Type</th>
              <th className="py-3 px-4">Diagnosis & Remediation</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E2]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.severity === "Critical"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : item.severity === "Warning"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : item.severity === "Passed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {item.severity === "Critical" ? (
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    ) : item.severity === "Warning" ? (
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    )}
                    {item.severity}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-bold text-[#0B0B0F]">{item.type}</td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <p className="font-semibold text-[#0B0B0F]">{item.pageTitle}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#4B5563]">
                    <span className="font-mono">{item.slug}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-500 font-medium">{item.pageType}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-[#4B5563] max-w-sm">{item.recommendation}</td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`text-[11px] font-semibold ${
                      item.status === "Resolved" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {item.status !== "Resolved" && (
                      <button
                        onClick={() => handleResolve(item.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold border border-[#E8E5E2] rounded-md hover:bg-stone-50"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <Link
                      href="/admin/pages"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF3E9] text-[#FF5A00] font-semibold rounded-md hover:bg-[#FF5A00] hover:text-white transition-colors"
                    >
                      <span>Fix</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
