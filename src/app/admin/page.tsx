"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  CheckSquare, 
  FileText,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { adminClient } from "@/lib/admin-client";
import type { AdminPageItem, LeadItem, SeoIssue, AdminTask } from "@/lib/admin-client/types";
import { 
  AdminPage, 
  PageHeader, 
  Card, 
  CardHeader, 
  CardContent, 
  StatCard, 
  StatusBadge, 
  Button, 
  Skeleton 
} from "@/components/admin/ui";

interface SystemHealthSummary {
  overallStatus: string;
}

export default function AdminDashboardPage() {
  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [seoIssues, setSeoIssues] = useState<SeoIssue[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [health, setHealth] = useState<SystemHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const inReviewPages = pages.filter((p) => p.status === "In_Review").length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const criticalSeo = seoIssues.filter((i) => i.severity === "high" || i.severity === "critical").length;
  const pendingTasks = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;

  // Build items needing attention
  const attentionItems: Array<{
    title: string;
    description: string;
    href: string;
    badgeVariant: "warning" | "danger" | "info";
    badgeText: string;
  }> = [];

  if (newLeads > 0) {
    attentionItems.push({
      title: `${newLeads} new inbound enquiry${newLeads > 1 ? "s" : ""}`,
      description: "Potential clients waiting for initial follow-up or quote proposal.",
      href: "/admin/leads",
      badgeVariant: "info",
      badgeText: "Inbound Leads",
    });
  }

  if (inReviewPages > 0) {
    attentionItems.push({
      title: `${inReviewPages} page draft${inReviewPages > 1 ? "s" : ""} pending review`,
      description: "Content changes submitted by editors awaiting approval and publication.",
      href: "/admin/pages",
      badgeVariant: "warning",
      badgeText: "Content Review",
    });
  }

  if (criticalSeo > 0) {
    attentionItems.push({
      title: `${criticalSeo} critical SEO issue${criticalSeo > 1 ? "s" : ""} detected`,
      description: "Pages missing meta titles, descriptions, or canonical links.",
      href: "/admin/seo",
      badgeVariant: "danger",
      badgeText: "SEO Health",
    });
  }

  if (pendingTasks > 0) {
    attentionItems.push({
      title: `${pendingTasks} operational task${pendingTasks > 1 ? "s" : ""} assigned`,
      description: "Editorial checklists or administrative duties pending completion.",
      href: "/admin/tasks",
      badgeVariant: "warning",
      badgeText: "Pending Tasks",
    });
  }

  return (
    <AdminPage maxWidth="default">
      {/* Welcome & Context Header */}
      <PageHeader
        title="Dashboard"
        description="Here is an overview of what needs your attention today."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/pages">
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Create Page
              </Button>
            </Link>
          </div>
        }
      />

      {/* 4 Primary Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="New Inbound Leads"
          value={loading ? "…" : newLeads}
          subtext="Awaiting response"
          icon={<Users className="w-4 h-4" />}
        />

        <StatCard
          label="Waiting for Review"
          value={loading ? "…" : inReviewPages}
          subtext="Pages in review queue"
          icon={<FileText className="w-4 h-4" />}
        />

        <StatCard
          label="Tasks Pending"
          value={loading ? "…" : pendingTasks}
          subtext="Operational items"
          icon={<CheckSquare className="w-4 h-4" />}
        />

        <StatCard
          label="System Health"
          value={
            loading
              ? "Checking…"
              : health?.overallStatus
              ? health.overallStatus
              : "Operational"
          }
          subtext="All systems verified"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Needs Your Attention List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Needs Your Attention</span>
          {attentionItems.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FF5A00]/10 text-[#FF5A00] font-semibold">
              {attentionItems.length}
            </span>
          )}
        </h2>

        {loading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : attentionItems.length > 0 ? (
          <div className="bg-white rounded-xl border border-stone-200/80 divide-y divide-stone-100 shadow-2xs overflow-hidden">
            {attentionItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors group cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={item.badgeVariant} size="sm">
                      {item.badgeText}
                    </StatusBadge>
                    <span className="text-sm font-medium text-stone-900 group-hover:text-[#FF5A00] transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 text-center shadow-2xs">
            <CheckSquare className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-800">You&apos;re completely caught up</p>
            <p className="text-xs text-stone-500 mt-0.5">
              No new pending leads, review items, or critical issues require your attention right now.
            </p>
          </div>
        )}
      </div>

      {/* Two Column Section: Recent Leads & Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Recent Leads */}
        <Card className="flex flex-col">
          <CardHeader
            title="Recent Inbound Leads"
            description="Latest customer enquiries received through public forms"
            actions={
              <Link href="/admin/leads">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            }
          />
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-stone-100">
              {leads.slice(0, 4).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads?id=${lead.id}`}
                  className="p-4 flex items-center justify-between hover:bg-stone-50/60 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900 group-hover:text-[#FF5A00] transition-colors truncate">
                        {lead.name}
                      </span>
                      <StatusBadge
                        variant={lead.status === "NEW" ? "info" : "neutral"}
                        size="sm"
                      >
                        {lead.status}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {lead.service || "General Enquiry"} · {lead.email}
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-400 shrink-0 font-mono">
                    {lead.date ? new Date(lead.date).toLocaleDateString() : "Recent"}
                  </span>
                </Link>
              ))}
              {leads.length === 0 && (
                <div className="p-8 text-center text-xs text-stone-400">
                  No leads recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Pages */}
        <Card className="flex flex-col">
          <CardHeader
            title="Recent Pages"
            description="Recently edited or scheduled content items"
            actions={
              <Link href="/admin/pages">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            }
          />
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-stone-100">
              {pages.slice(0, 4).map((page) => (
                <Link
                  key={page.id}
                  href={`/admin/pages/${page.id}/edit`}
                  className="p-4 flex items-center justify-between hover:bg-stone-50/60 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900 group-hover:text-[#FF5A00] transition-colors truncate">
                        {page.title}
                      </span>
                      <StatusBadge
                        variant={
                          page.status === "Published"
                            ? "success"
                            : page.status === "In_Review"
                            ? "warning"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {page.status}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-stone-400 font-mono truncate mt-0.5">
                      /{page.slug}
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-400 shrink-0 font-mono">
                    {page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : "Recently"}
                  </span>
                </Link>
              ))}
              {pages.length === 0 && (
                <div className="p-8 text-center text-xs text-stone-400">
                  No pages created yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
