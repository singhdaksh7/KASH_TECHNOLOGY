"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, CheckCircle2, Lightbulb, RotateCw } from "lucide-react";
import type { AdvancedSeoIssue, SeoIssueSeverity } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

type Audit = Awaited<ReturnType<typeof adminClient.getSeoAudit>>;
type Tab = "all" | "meta" | "technical" | "links" | "images" | "schema" | "redirects";

const TABS: Array<{ id: Tab; label: string; match: (t: string) => boolean }> = [
  { id: "all", label: "All findings", match: () => true },
  { id: "meta", label: "Titles & meta", match: (t) => /Title|Description|H1/.test(t) },
  { id: "technical", label: "Technical & index", match: (t) => /Noindex|Canonical|OG Image/.test(t) },
  { id: "links", label: "Internal links", match: (t) => /Link|Orphan/.test(t) },
  { id: "images", label: "Image ALT", match: (t) => /ALT/.test(t) },
  { id: "schema", label: "Schema", match: (t) => /Schema/.test(t) },
  { id: "redirects", label: "Redirects", match: (t) => /Redirect/.test(t) },
];
const SEV: Record<SeoIssueSeverity, { cls: string; icon: React.ReactNode }> = {
  Critical: { cls: "bg-red-50 text-red-700 border-red-200", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  Warning: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  Recommendation: { cls: "bg-blue-50 text-blue-700 border-blue-200", icon: <Lightbulb className="w-3.5 h-3.5" /> },
  Passed: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
};

export default function SeoAuditPage() {
  const { addToast } = useToast();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [severity, setSeverity] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const load = useCallback(async (announce = false) => {
    setLoading(true);
    try {
      const a = await adminClient.getSeoAudit();
      setAudit(a);
      setError("");
      if (announce) addToast({ title: "Audit refreshed", message: `${a.summary.pagesAudited} pages audited: ${a.summary.critical} critical, ${a.summary.warning} warnings.`, type: "success" });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [addToast]);
  useEffect(() => {
    adminClient.getSeoAudit().then((a) => { setAudit(a); setError(""); }).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const t = TABS.find((x) => x.id === tab)!;
    const q = search.trim().toLowerCase();
    return (audit?.issues ?? []).filter((i) => t.match(i.type) && (severity === "ALL" || i.severity === severity) && (!q || `${i.pageTitle} ${i.slug} ${i.type} ${i.recommendation}`.toLowerCase().includes(q)));
  }, [audit, tab, severity, search]);

  const editorLink = (i: AdvancedSeoIssue) => (i.entityType === "Page" && i.entityId ? `/admin/pages/${i.entityId}/edit` : i.entityType === "Redirect" ? "/admin/redirects" : i.entityType === "MediaAsset" ? "/admin/media" : undefined);
  const s = audit?.summary;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="SEO Audit"
        subtitle="Findings from the pages, redirects and media stored in this CMS. No traffic, ranking or Search Console data is shown because none is connected."
        breadcrumbs={[{ label: "Marketing" }, { label: "SEO Audit" }]}
        actions={<button onClick={() => void load(true)} disabled={loading} className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#0B0B0F] hover:bg-stone-50 bg-white disabled:opacity-60"><RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /><span>Re-run audit</span></button>}
      />

      {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">Could not load the audit: {error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([["Critical", s?.critical], ["Warning", s?.warning], ["Recommendation", s?.recommendation], ["Passed", s?.passed]] as Array<[SeoIssueSeverity, number | undefined]>).map(([label, n]) => (
          <button key={label} onClick={() => setSeverity(severity === label ? "ALL" : label)} className={`p-5 text-left rounded-xl border bg-white shadow-xs transition ${severity === label ? "border-[#FF5A00]" : "border-[#E8E5E2]"}`}>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">{SEV[label].icon}{label === "Passed" ? "Checks passed" : label === "Recommendation" ? "Recommendations" : `${label}s`}</p>
            <p className="mt-2 text-3xl font-black text-[#0B0B0F]">{n ?? "—"}</p>
          </button>
        ))}
      </div>
      {s && <p className="text-xs text-stone-500">Audited {s.pagesAudited} page{s.pagesAudited === 1 ? "" : "s"} · generated {new Date(audit!.generatedAt).toLocaleString()}</p>}
      {audit?.notes.map((n) => <p key={n} className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{n}</p>)}

      <div className="flex border-b border-[#E8E5E2] bg-white rounded-xl px-4 pt-1 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 ${tab === t.id ? "border-[#FF5A00] text-[#FF5A00]" : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"}`}>{t.label}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by page, URL or issue…" className="flex-1 min-w-[220px] px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs bg-white" />
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs bg-white">
          <option value="ALL">All severities</option>{(["Critical", "Warning", "Recommendation", "Passed"] as const).map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E5E2] divide-y divide-[#E8E5E2]">
        {loading && !audit && <p className="p-6 text-xs text-stone-400">Running audit…</p>}
        {!loading && !rows.length && !error && <p className="p-6 text-xs text-stone-500">{audit?.issues.length ? "No findings match these filters." : "No findings."}</p>}
        {rows.map((i) => {
          const link = editorLink(i);
          return (
            <div key={i.id} className="p-4 flex flex-wrap items-start gap-3 text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold ${SEV[i.severity].cls}`}>{SEV[i.severity].icon}{i.severity}</span>
              <div className="flex-1 min-w-[240px]">
                <p className="font-bold text-[#0B0B0F]">{i.type} <span className="font-normal text-stone-500">· {i.pageTitle}</span></p>
                {i.slug && <p className="font-mono text-[11px] text-stone-400 break-all">{i.slug}</p>}
                <p className="mt-1 text-stone-600 leading-relaxed">{i.recommendation}</p>
              </div>
              {link && <Link href={link} className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-[#FFF3E9] whitespace-nowrap">Open</Link>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
