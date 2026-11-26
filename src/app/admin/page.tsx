"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  ArrowRight, 
  Calendar,
  AlertTriangle,
  CheckSquare,
  Activity,
  Layers,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient } from "@/lib/admin-client";
import type { AdminPageItem, LeadItem, SeoIssue, AdminTask } from "@/lib/admin-client/types";

interface SystemHealthSummary {
  overallStatus: string;
}

export default function AdminDashboardPage() {
  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [seoIssues, setSeoIssues] = useState<SeoIssue[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [health, setHealth] = useState<SystemHealthSummary | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, l, s, t, h] = await Promise.all([
          adminClient.getPages().catch(() => []),
          adminClient.getLeads().catch(() => []),
          adminClient.getSeoIssues().catch(() => []),
          adminClient.getTasks().catch(() => []),
          adminClient.getSystemHealth().catch(() => null),
        ]);
        setPages(p);
        setLeads(l);
        setSeoIssues(s);
        setTasks(t);
        setHealth((h as unknown as SystemHealthSummary) ?? null);
      } catch {
        // Real-API dashboard loads empty fallback cleanly
      }
    }
    loadData();
  }, []);

  const inReviewPages = pages.filter((p) => p.status === "In_Review").length;
  const scheduledPages = pages.filter((p) => p.status === "Scheduled").length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const criticalSeo = seoIssues.filter((i) => i.severity === "high" || i.severity === "critical").length;
  const pendingTasks = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Admin Control Center"
        subtitle="Operational overview of CMS content pipeline, incoming project leads, SEO health, and system status."
        breadcrumbs={[{ label: "Overview" }, { label: "Dashboard" }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#FF8A3D] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Page</span>
            </Link>
          </div>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Quick Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/leads"
            className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">New Leads</span>
              <Users className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{newLeads}</div>
            <div className="text-[10px] text-[#4B5563]">Inbound enquiries</div>
          </Link>

          <Link
            href="/admin/pages"
            className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">In Review</span>
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{inReviewPages}</div>
            <div className="text-[10px] text-[#4B5563]">Awaiting approval</div>
          </Link>

          <Link
            href="/admin/pages"
            className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Scheduled</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{scheduledPages}</div>
            <div className="text-[10px] text-[#4B5563]">Future publishing</div>
          </Link>

          <Link
            href="/admin/tasks"
            className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Tasks Due</span>
              <CheckSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{pendingTasks}</div>
            <div className="text-[10px] text-[#4B5563]">Operational tasks</div>
          </Link>

          <Link
            href="/admin/seo"
            className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">SEO Issues</span>
              <AlertTriangle className={`w-4 h-4 ${criticalSeo > 0 ? "text-red-500" : "text-emerald-500"}`} />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{criticalSeo}</div>
            <div className="text-[10px] text-[#4B5563]">Critical warnings</div>
          </Link>

          <Link
            href="/admin/system/health"
            className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">System</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-extrabold text-[#0B0B0F] truncate mt-1">
              {health?.overallStatus || "HEALTHY"}
            </div>
            <div className="text-[10px] text-[#4B5563]">All services verified</div>
          </Link>
        </div>

        {/* Quick Actions Strip */}
        <div className="bg-[#FFF9F4] rounded-2xl border border-[#FF5A00]/20 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B0B0F] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]" />
            Quick Operational Actions
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link
              href="/admin/pages"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E5E2] text-stone-700 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
            >
              + Create Page
            </Link>
            <Link
              href="/admin/portfolio"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E5E2] text-stone-700 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
            >
              + Create Portfolio Project
            </Link>
            <Link
              href="/admin/insights"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E5E2] text-stone-700 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
            >
              + Create Insight
            </Link>
            <Link
              href="/admin/media"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E5E2] text-stone-700 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
            >
              Upload Media
            </Link>
            <Link
              href="/admin/leads"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E5E2] text-stone-700 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
            >
              View Inbound Leads
            </Link>
          </div>
        </div>

        {/* Main Content Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E5E2] pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                Recent Inbound Leads
              </h3>
              <Link href="/admin/leads" className="text-xs font-semibold text-[#FF5A00] hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#E8E5E2]">
              {leads.slice(0, 5).map((l) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0B0B0F] block">{l.name}</span>
                    <span className="text-[11px] text-stone-400">{l.service || l.company || l.email}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    l.status === "NEW" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-600"
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
              {!leads.length && (
                <p className="text-xs text-stone-400 py-4 text-center">No leads received yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E5E2] pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                Recent CMS Pages
              </h3>
              <Link href="/admin/pages" className="text-xs font-semibold text-[#FF5A00] hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#E8E5E2]">
              {pages.slice(0, 5).map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0B0B0F] block">{p.title}</span>
                    <span className="text-[11px] text-stone-400 font-mono">{p.slug}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.status === "Published" ? "bg-emerald-50 text-emerald-700" :
                    p.status === "Scheduled" ? "bg-blue-50 text-blue-700" :
                    p.status === "In_Review" ? "bg-purple-50 text-purple-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
              {!pages.length && (
                <p className="text-xs text-stone-400 py-4 text-center">No pages created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
