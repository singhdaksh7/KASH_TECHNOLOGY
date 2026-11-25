"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { EmailDeliveryItem } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

const CLS: Record<string, string> = { SENT: "bg-green-50 text-green-700", FAILED: "bg-red-50 text-red-700", SKIPPED: "bg-stone-100 text-stone-600", QUEUED: "bg-blue-50 text-blue-700" };
const LABEL: Record<string, string> = { lead_internal: "Internal enquiry", lead_confirmation: "Visitor thank-you", test: "Test email" };

export default function EmailLogsPage() {
  const { addToast } = useToast();
  const [rows, setRows] = useState<EmailDeliveryItem[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => { try { setRows(await adminClient.getEmailDeliveries(filter || undefined)); setError(""); } catch (e) { setError(errorMessage(e)); } }, [filter]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(() => { void load(); }, [load]);

  const retry = async (id: string) => {
    setBusy(id);
    try { const r = await adminClient.retryEmailDelivery(id); addToast({ title: r.status === "SENT" ? "Email sent" : "Retry did not send", message: r.errorMessage ?? r.status, type: r.status === "SENT" ? "success" : "error" }); await load(); }
    catch (e) { addToast({ title: "Retry failed", message: errorMessage(e), type: "error" }); } finally { setBusy(""); }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Email Logs" subtitle="Every transactional email the CMS attempted or skipped. No secrets or provider payloads are stored here." breadcrumbs={[{ label: "Settings" }, { label: "Email & Resend", href: "/admin/settings/email" }, { label: "Logs" }]} />
      <div className="px-4 sm:px-6 space-y-4 max-w-6xl">
        <div className="flex gap-2 text-xs">
          {["", "SENT", "FAILED", "SKIPPED"].map((f) => <button key={f || "all"} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg border font-semibold ${filter === f ? "bg-[#FF5A00] text-white border-[#FF5A00]" : "bg-white border-[#E8E5E2]"}`}>{f ? f[0] + f.slice(1).toLowerCase() : "All"}</button>)}
        </div>
        {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
        <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-stone-500 border-b border-[#E8E5E2]"><tr><th className="p-3">Date</th><th className="p-3">Template</th><th className="p-3">Recipient</th><th className="p-3">Lead</th><th className="p-3">Status</th><th className="p-3">Provider</th><th className="p-3" /></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-stone-400">No emails yet.</td></tr>}
              {rows.map((r) => (
                <React.Fragment key={r.id}>
                  <tr className="border-b border-[#F2EFEC] align-top">
                    <td className="p-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="p-3">{LABEL[r.templateKey] ?? r.templateKey}{r.attempts > 1 ? <span className="text-stone-400"> · attempt {r.attempts}</span> : null}</td>
                    <td className="p-3 break-all">{r.recipient}</td>
                    <td className="p-3">{r.entityType === "Lead" && r.entityId ? <Link className="text-[#FF5A00] hover:underline" href={`/admin/leads/${r.entityId}`}>{r.leadName || "View lead"}</Link> : "—"}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full font-bold ${CLS[r.status]}`}>{r.status}</span></td>
                    <td className="p-3">{r.provider}</td>
                    <td className="p-3 whitespace-nowrap space-x-2">
                      {(r.errorMessage) && <button onClick={() => setOpen(open === r.id ? null : r.id)} className="text-stone-500 underline">Reason</button>}
                      {(r.status === "FAILED" || r.status === "SKIPPED") && (r.templateKey === "lead_internal" || r.templateKey === "lead_confirmation") && <button disabled={busy === r.id} onClick={() => void retry(r.id)} className="px-2 py-1 border border-[#E8E5E2] rounded font-semibold hover:bg-stone-50 disabled:opacity-50">{busy === r.id ? "…" : "Retry"}</button>}
                    </td>
                  </tr>
                  {open === r.id && <tr className="bg-stone-50"><td colSpan={7} className="p-3 text-stone-700">{r.errorMessage} <span className="text-stone-400 font-mono">({r.errorCode})</span> — Subject: {r.subject}</td></tr>}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
