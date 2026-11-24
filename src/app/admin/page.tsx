"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Briefcase, 
  BookOpen, 
  Users, 
  Plus, 
  ArrowRight, 
  Upload } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient } from "@/lib/admin-client";
import { AdminPageItem, LeadItem, SeoIssue, PortfolioItem } from "@/lib/admin-client/types";

export default function AdminDashboardPage() {
  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [seoIssues, setSeoIssues] = useState<SeoIssue[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [p, l, s, port] = await Promise.all([
        adminClient.getPages(),
        adminClient.getLeads(),
        adminClient.getSeoIssues(),
        adminClient.getPortfolio(),
      ]);
      setPages(p);
      setLeads(l);
      setSeoIssues(s);
      setPortfolio(port);
      setLoading(false);
    }
    loadData();
  }, []);

  const publishedPages = pages.filter((p) => p.status === "Published").length;
  const draftPages = pages.filter((p) => p.status === "Draft").length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Overview of published content, incoming leads, and SEO health."
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
        {/* Top 5 Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Published Pages */}
          <Link href="/admin/pages" className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Published</span>
              <FileText className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{publishedPages}</div>
            <div className="text-[10px] text-[#4B5563]">Live on public domain</div>
          </Link>

          {/* Card 2: Draft Pages */}
          <Link href="/admin/pages" className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Drafts</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{draftPages}</div>
            <div className="text-[10px] text-[#4B5563]">Unpublished revisions</div>
          </Link>

          {/* Card 3: Portfolio Projects */}
          <Link href="/admin/portfolio" className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Portfolio</span>
              <Briefcase className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">{portfolio.length}</div>
            <div className="text-[10px] text-[#4B5563]">Projects &amp; Prototypes</div>
          </Link>

          {/* Card 4: Incoming Leads */}
          <Link href="/admin/leads" className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">New Leads</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">{newLeads}</div>
            <div className="text-[10px] text-[#4B5563]">Pending qualification</div>
          </Link>

          {/* Card 5: Insights */}
          <Link href="/admin/insights" className="bg-white p-4 rounded-2xl border border-[#E8E5E2] hover:border-[#FF5A00] shadow-xs transition-all space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#4B5563]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Insights</span>
              <BookOpen className="w-4 h-4 text-[#FF5A00]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B0B0F]">3</div>
            <div className="text-[10px] text-[#4B5563]">Engineering articles</div>
          </Link>

        </div>

        {/* Quick Actions Strip */}
        <div className="bg-white rounded-2xl border border-[#E8E5E2] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <span className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
            Quick Actions:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/pages/new"
              className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-[#FFF9F4] hover:border-[#FF5A00] hover:text-[#FF5A00] text-xs font-semibold text-[#0B0B0F] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Add Page</span>
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-[#FFF9F4] hover:border-[#FF5A00] hover:text-[#FF5A00] text-xs font-semibold text-[#0B0B0F] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Add Project</span>
            </Link>
            <Link
              href="/admin/insights"
              className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-[#FFF9F4] hover:border-[#FF5A00] hover:text-[#FF5A00] text-xs font-semibold text-[#0B0B0F] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Add Insight</span>
            </Link>
            <Link
              href="/admin/media"
              className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-[#FFF9F4] hover:border-[#FF5A00] hover:text-[#FF5A00] text-xs font-semibold text-[#0B0B0F] transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Upload Media</span>
            </Link>
            <Link
              href="/admin/forms"
              className="px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-[#FFF9F4] hover:border-[#FF5A00] hover:text-[#FF5A00] text-xs font-semibold text-[#0B0B0F] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Create Form</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Recent Leads & SEO Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Recent Leads (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]">
              <div>
                <h2 className="text-sm font-bold text-[#0B0B0F]">Recent Inquiries &amp; Leads</h2>
                <p className="text-[11px] text-[#4B5563]">Live client requests received from public website forms.</p>
              </div>
              <Link href="/admin/leads" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                <span>View All Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#E8E5E2]">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0B0B0F] truncate">{lead.name}</span>
                      <span className="text-[10px] text-[#4B5563] truncate">({lead.company})</span>
                    </div>
                    <div className="text-[11px] text-[#4B5563] truncate">
                      {lead.service} · <span className="font-mono text-[#0B0B0F]">{lead.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      lead.status === "NEW"
                        ? "bg-emerald-100 text-emerald-800"
                        : lead.status === "CONTACTED"
                        ? "bg-blue-100 text-blue-800"
                        : lead.status === "QUALIFIED"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-[#4B5563] font-mono">{lead.date.slice(5)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: SEO Health & Issues (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]">
              <div>
                <h2 className="text-sm font-bold text-[#0B0B0F]">SEO Health &amp; Audits</h2>
                <p className="text-[11px] text-[#4B5563]">On-page meta tags, canonicals, and index rules.</p>
              </div>
              <Link href="/admin/seo" className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1">
                <span>Audit Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {seoIssues.map((issue) => (
                <div key={issue.id} className="p-3 rounded-xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0B0F]">{issue.pageTitle}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      issue.severity === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {issue.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Content Changes Table */}
        <div className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]">
            <div>
              <h2 className="text-sm font-bold text-[#0B0B0F]">Recent Content Updates</h2>
              <p className="text-[11px] text-[#4B5563]">Pages modified across the CMS.</p>
            </div>
            <Link href="/admin/pages" className="text-xs font-bold text-[#FF5A00] hover:underline">
              Manage All Pages &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E5E2] text-[#4B5563] font-mono text-[10px] uppercase tracking-wider">
                  <th className="pb-2">Page Title</th>
                  <th className="pb-2">Slug</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">SEO Score</th>
                  <th className="pb-2">Last Updated</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5E2]">
                {pages.slice(0, 5).map((page) => (
                  <tr key={page.id} className="hover:bg-[#FFF9F4] transition-colors">
                    <td className="py-2.5 font-bold text-[#0B0B0F]">{page.title}</td>
                    <td className="py-2.5 font-mono text-[#4B5563]">{page.slug}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        page.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-[#FF5A00]">{page.seoScore}/100</td>
                    <td className="py-2.5 text-[#4B5563]">{page.lastUpdated}</td>
                    <td className="py-2.5 text-right space-x-2">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="font-bold text-[#FF5A00] hover:underline"
                      >
                        Edit Canvas
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
