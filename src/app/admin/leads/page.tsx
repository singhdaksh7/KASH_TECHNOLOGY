"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building, Kanban, Mail, Phone, Search, Send, Table as TableIcon, X } from "lucide-react";
import type { AdminTask, EmailDeliveryItem, LeadItem, LeadPriority, LeadStatus } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

const COLUMNS: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"];
const PRIORITIES: LeadPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STATUS_CLS: Record<LeadStatus, string> = { NEW: "bg-blue-50 text-blue-700 border-blue-200", CONTACTED: "bg-amber-50 text-amber-700 border-amber-200", QUALIFIED: "bg-purple-50 text-purple-700 border-purple-200", PROPOSAL: "bg-indigo-50 text-indigo-700 border-indigo-200", WON: "bg-emerald-50 text-emerald-700 border-emerald-200", LOST: "bg-stone-100 text-stone-600 border-stone-200" };
const PRIO_CLS: Record<LeadPriority, string> = { LOW: "bg-stone-100 text-stone-600", MEDIUM: "bg-blue-100 text-blue-700", HIGH: "bg-amber-100 text-amber-700", URGENT: "bg-red-100 text-red-700 font-bold" };
const ACTIVITY_LABEL: Record<string, string> = { CREATED: "Lead created", STATUS_CHANGED: "Status changed", ASSIGNED: "Assignment changed", NOTE_ADDED: "Note added", FOLLOW_UP_SET: "Follow-up set", EMAIL_SENT: "Email sent", TASK_CREATED: "Task created", PRIORITY_CHANGED: "Priority changed", UPDATED: "Details updated" };
type Person = { id: string; name: string };

const when = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");
const toLocalInput = (iso?: string) => { if (!iso) return ""; const d = new Date(iso); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const money = (n?: number) => (n == null ? "—" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n));
const describe = (a: NonNullable<LeadItem["activities"]>[number], who: (id?: unknown) => string) => {
  const m = a.metadata as Record<string, unknown>;
  if (a.type === "STATUS_CHANGED") return `${m.from} → ${m.to}`;
  if (a.type === "ASSIGNED") return `${who(m.from)} → ${who(m.to)}`;
  if (a.type === "PRIORITY_CHANGED") return `${(m.priority as { from?: string; to?: string } | undefined)?.from ?? ""} → ${(m.priority as { to?: string } | undefined)?.to ?? ""}`;
  if (a.type === "FOLLOW_UP_SET") return m.to ? `Due ${when(String(m.to))}` : "Follow-up cleared";
  if (a.type === "TASK_CREATED") return String(m.title ?? "");
  if (a.type === "CREATED") return m.source ? `Source: ${m.source}` : "";
  return "";
};

export default function LeadsPage() {
  const { addToast } = useToast();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"board" | "table">("board");
  const [fStatus, setFStatus] = useState("ALL");
  const [fPrio, setFPrio] = useState("ALL");
  const [fAssignee, setFAssignee] = useState("ALL");
  const [fDue, setFDue] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<LeadItem | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [tagText, setTagText] = useState("");
  const [leadEmails, setLeadEmails] = useState<EmailDeliveryItem[]>([]);
  const [emailOn, setEmailOn] = useState<boolean | null>(null);

  const who = useCallback((id?: unknown) => (id ? people.find((p) => p.id === id)?.name ?? "Unknown user" : "Unassigned"), [people]);
  const reloadList = useCallback(async () => { const l = await adminClient.getLeads(); setLeads(l); return l; }, []);
  const openLead = useCallback(async (id: string) => { adminClient.getLeadEmails(id).then(setLeadEmails).catch(() => setLeadEmails([])); try { setOpen(await adminClient.getLead(id)); } catch (e) { addToast({ title: "Could not open lead", message: errorMessage(e), type: "error" }); } }, [addToast]);
  const refresh = useCallback(async (id?: string) => { await reloadList(); if (id) await openLead(id); }, [reloadList, openLead]);
  const act = async (id: string, fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); await refresh(id); addToast({ title: ok, message: "Saved.", type: "success" }); } catch (e) { addToast({ title: "Update failed", message: errorMessage(e), type: "error" }); }
  };

  useEffect(() => {
    adminClient.getLeads().then((l) => {
      setLeads(l);
      const want = new URLSearchParams(window.location.search).get("lead");
      if (want) void openLead(want);
    }).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
    adminClient.getAssignees().then((a) => setPeople(a.map((x) => ({ id: x.id, name: x.name })))).catch(() => undefined);
    adminClient.getEmailStatus().then((s) => setEmailOn(s.configured)).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) =>
      (fStatus === "ALL" || l.status === fStatus) && (fPrio === "ALL" || l.priority === fPrio)
      && (fAssignee === "ALL" || (fAssignee === "NONE" ? !l.assignedToId : l.assignedToId === fAssignee))
      && (!fDue || (l.nextFollowUp && new Date(l.nextFollowUp) <= new Date() && l.status !== "WON" && l.status !== "LOST"))
      && (!q || `${l.name} ${l.email} ${l.company} ${l.service} ${l.source}`.toLowerCase().includes(q)));
  }, [leads, fStatus, fPrio, fAssignee, fDue, search]);

  const bulk = async (run: () => Promise<{ changed: number; skipped: number }>, label: string) => {
    try { const r = await run(); setChecked([]); await refresh(open?.id); addToast({ title: label, message: `${r.changed} updated${r.skipped ? `, ${r.skipped} unchanged` : ""}.`, type: "success" }); }
    catch (e) { addToast({ title: "Bulk action failed — nothing was changed", message: errorMessage(e), type: "error" }); }
  };
  const addTask = async () => {
    if (!open || !taskTitle.trim()) return;
    const t: AdminTask = { id: "new", title: taskTitle.trim(), description: "", relatedEntity: "Lead", relatedId: open.id, assignee: "", assigneeId: open.assignedToId, dueDate: "", priority: open.priority ?? "MEDIUM", status: "TODO", createdAt: "" };
    await act(open.id, () => adminClient.saveTask(t), "Task created"); setTaskTitle("");
  };
  const overdue = (l: LeadItem) => !!l.nextFollowUp && new Date(l.nextFollowUp) < new Date() && l.status !== "WON" && l.status !== "LOST";

  const Card = ({ l }: { l: LeadItem }) => (
    <button onClick={() => void openLead(l.id)} className={`w-full text-left p-3 rounded-lg border bg-white hover:border-[#FF5A00] ${open?.id === l.id ? "border-[#FF5A00]" : "border-[#E8E5E2]"}`}>
      <div className="flex items-start justify-between gap-2"><span className="font-bold text-xs text-[#0B0B0F]">{l.name}</span><span className={`px-1.5 py-0.5 rounded text-[10px] ${PRIO_CLS[l.priority ?? "MEDIUM"]}`}>{l.priority ?? "MEDIUM"}</span></div>
      {l.company && <p className="text-[11px] text-stone-500">{l.company}</p>}
      <p className="mt-1 text-[11px] text-stone-500 truncate">{l.service || l.source}</p>
      <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400"><span>{l.assignedTo ?? "Unassigned"}</span>{overdue(l) ? <span className="text-red-600 font-bold">Follow-up overdue</span> : <span>{l.date.slice(0, 10)}</span>}</div>
    </button>
  );

  return (
    <div className="space-y-6">
      <AdminHeader title="Leads" subtitle="Everything captured from your forms: assign, prioritise, schedule follow-ups and track the deal" breadcrumbs={[{ label: "Marketing" }, { label: "Leads" }]}
        actions={<div className="flex bg-stone-100 p-0.5 rounded-lg border border-[#E8E5E2]">{([["board", Kanban], ["table", TableIcon]] as const).map(([v, Icon]) => <button key={v} onClick={() => setView(v)} aria-label={`${v} view`} className={`p-1.5 rounded-md ${view === v ? "bg-white text-[#FF5A00]" : "text-[#4B5563]"}`}><Icon className="w-4 h-4" /></button>)}</div>} />
      {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
      {emailOn === false && <p className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"><AlertTriangle className="w-4 h-4" />Email notifications are not set up on this server. New leads are still saved here and appear in this list.</p>}

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-wrap gap-3 items-center text-xs">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, company, service…" className="w-full pl-9 pr-3 py-2 border border-[#E8E5E2] rounded-lg" /></div>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="px-2 py-2 border border-[#E8E5E2] rounded-lg bg-white"><option value="ALL">All statuses</option>{COLUMNS.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={fPrio} onChange={(e) => setFPrio(e.target.value)} className="px-2 py-2 border border-[#E8E5E2] rounded-lg bg-white"><option value="ALL">All priorities</option>{PRIORITIES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={fAssignee} onChange={(e) => setFAssignee(e.target.value)} className="px-2 py-2 border border-[#E8E5E2] rounded-lg bg-white"><option value="ALL">Anyone</option><option value="NONE">Unassigned</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <label className="flex items-center gap-1.5 font-semibold"><input type="checkbox" checked={fDue} onChange={(e) => setFDue(e.target.checked)} />Follow-up due</label>
        <span className="text-stone-500">{shown.length} of {leads.length}</span>
      </div>

      {checked.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-[#FFF3E9] p-2 px-3 rounded-lg border border-[#FF5A00]/30 text-xs">
          <span className="font-bold text-[#FF5A00]">{checked.length} selected</span>
          <select defaultValue="" onChange={(e) => { const v = e.target.value; e.target.value = ""; if (v) void bulk(() => adminClient.bulkLeads({ action: "assign", ids: checked, assignedToId: v === "__none" ? null : v }), "Assigned"); }} className="px-2 py-1 bg-white border border-[#E8E5E2] rounded"><option value="" disabled>Assign to…</option><option value="__none">Unassigned</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select defaultValue="" onChange={(e) => { const v = e.target.value as LeadPriority; e.target.value = ""; if (v) void bulk(() => adminClient.bulkLeads({ action: "priority", ids: checked, priority: v }), "Priority set"); }} className="px-2 py-1 bg-white border border-[#E8E5E2] rounded"><option value="" disabled>Priority…</option>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
          <select defaultValue="" onChange={(e) => { const v = e.target.value as LeadStatus; e.target.value = ""; if (v) void bulk(() => adminClient.bulkLeads({ action: "status", ids: checked, status: v }), "Status set"); }} className="px-2 py-1 bg-white border border-[#E8E5E2] rounded"><option value="" disabled>Status…</option>{COLUMNS.map((p) => <option key={p}>{p}</option>)}</select>
          <button onClick={() => { const t = window.prompt("Tag to add to the selected leads"); if (t?.trim()) void bulk(() => adminClient.bulkLeads({ action: "tag", ids: checked, add: [t.trim()], remove: [] }), "Tagged"); }} className="px-2 py-1 bg-white border border-[#E8E5E2] rounded">Add tag</button>
          <button onClick={() => setChecked([])} className="text-stone-500 hover:underline">Clear</button>
        </div>
      )}

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {loading ? <p className="py-16 text-center text-stone-400 text-xs">Loading leads…</p> : !shown.length ? <p className="py-16 text-center text-stone-400 text-xs bg-white rounded-xl border border-[#E8E5E2]">{leads.length ? "No leads match these filters." : "No leads yet. They appear here as soon as someone submits a form."}</p>
            : view === "board" ? (
              <div className="grid grid-flow-col auto-cols-[300px] gap-4 overflow-x-auto pb-4 items-start">
                {COLUMNS.map((c) => {
                  const col = shown.filter((l) => l.status === c);
                  return (
                    <div key={c} className="space-y-2.5 bg-stone-100/60 p-2.5 rounded-xl border border-stone-200/80">
                      <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex justify-between shadow-xs ${STATUS_CLS[c]}`}>
                        <span>{c}</span>
                        <span className="font-mono">{col.length}</span>
                      </div>
                      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-0.5">
                        {col.length === 0 ? (
                          <div className="py-8 text-center text-stone-400 text-[11px] border border-dashed border-stone-200 rounded-lg">
                            No {c.toLowerCase()} leads
                          </div>
                        ) : (
                          col.map((l) => <Card key={l.id} l={l} />)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold border-b border-[#E8E5E2]"><tr><th className="p-3 w-8"><input type="checkbox" aria-label="Select all" checked={checked.length === shown.length && shown.length > 0} onChange={(e) => setChecked(e.target.checked ? shown.map((l) => l.id) : [])} /></th><th className="p-3">Lead</th><th className="p-3">Status</th><th className="p-3">Priority</th><th className="p-3">Assignee</th><th className="p-3">Next follow-up</th><th className="p-3">Value</th><th className="p-3">Source</th></tr></thead>
                  <tbody className="divide-y divide-[#E8E5E2]">
                    {shown.map((l) => (
                      <tr key={l.id} onClick={() => void openLead(l.id)} className={`cursor-pointer hover:bg-stone-50 ${open?.id === l.id ? "bg-[#FFF9F4]" : ""}`}>
                        <td className="p-3"><input type="checkbox" aria-label={`Select ${l.name}`} checked={checked.includes(l.id)} onClick={(e) => e.stopPropagation()} onChange={(e) => setChecked(e.target.checked ? [...checked, l.id] : checked.filter((i) => i !== l.id))} /></td>
                        <td className="p-3"><span className="font-bold block">{l.name}</span><span className="text-stone-500">{l.email}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded border font-bold ${STATUS_CLS[l.status]}`}>{l.status}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded ${PRIO_CLS[l.priority ?? "MEDIUM"]}`}>{l.priority}</span></td>
                        <td className="p-3">{l.assignedTo ?? <span className="text-stone-400">Unassigned</span>}</td>
                        <td className={`p-3 ${overdue(l) ? "text-red-600 font-bold" : ""}`}>{l.nextFollowUp ? when(l.nextFollowUp) : "—"}</td>
                        <td className="p-3">{money(l.leadValue)}</td><td className="p-3 text-stone-500">{l.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {open && (
          <aside className="fixed inset-0 z-40 w-full overflow-y-auto bg-white p-5 space-y-4 text-xs lg:static lg:z-auto lg:w-[380px] lg:shrink-0 lg:rounded-xl lg:border lg:border-[#E8E5E2] lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-20">
            <div className="flex items-start justify-between"><div><h3 className="text-sm font-bold">{open.name}</h3>{open.company && <p className="flex items-center gap-1 text-stone-500"><Building className="w-3 h-3" />{open.company}</p>}</div><button onClick={() => setOpen(null)} aria-label="Close lead"><X className="w-4 h-4 text-stone-400" /></button></div>
            <div className="space-y-1">{open.email && <a href={`mailto:${open.email}`} className="flex items-center gap-2 text-[#FF5A00]"><Mail className="w-3.5 h-3.5" />{open.email}</a>}{open.phone && <a href={`tel:${open.phone}`} className="flex items-center gap-2 text-[#FF5A00]"><Phone className="w-3.5 h-3.5" />{open.phone}</a>}</div>
            {open.message && <p className="p-3 rounded-lg bg-stone-50 border border-[#E8E5E2] whitespace-pre-wrap leading-relaxed">{open.message}</p>}

            <div className="grid grid-cols-2 gap-3">
              <label>Status<select value={open.status} onChange={(e) => void act(open.id, () => adminClient.updateLeadStatus(open.id, e.target.value as LeadStatus), "Status updated")} className="mt-1 w-full px-2 py-1.5 border border-[#E8E5E2] rounded-lg bg-white">{COLUMNS.map((s) => <option key={s}>{s}</option>)}</select></label>
              <label>Priority<select value={open.priority ?? "MEDIUM"} onChange={(e) => void act(open.id, () => adminClient.setLeadPriority(open.id, e.target.value as LeadPriority), "Priority updated")} className="mt-1 w-full px-2 py-1.5 border border-[#E8E5E2] rounded-lg bg-white">{PRIORITIES.map((s) => <option key={s}>{s}</option>)}</select></label>
              <label className="col-span-2">Assigned to<select value={open.assignedToId ?? ""} onChange={(e) => void act(open.id, () => adminClient.assignLead(open.id, e.target.value || null), "Assignment updated")} className="mt-1 w-full px-2 py-1.5 border border-[#E8E5E2] rounded-lg bg-white"><option value="">Unassigned</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <label className="col-span-2">Next follow-up<div className="mt-1 flex gap-2"><input type="datetime-local" defaultValue={toLocalInput(open.nextFollowUp)} key={open.id + (open.nextFollowUp ?? "")} onBlur={(e) => { const v = e.target.value ? new Date(e.target.value).toISOString() : null; if ((v ?? "") !== (open.nextFollowUp ?? "")) void act(open.id, () => adminClient.setLeadFollowUp(open.id, v), "Follow-up saved"); }} className="flex-1 px-2 py-1.5 border border-[#E8E5E2] rounded-lg" />{open.nextFollowUp && <button onClick={() => void act(open.id, () => adminClient.setLeadFollowUp(open.id, null), "Follow-up cleared")} className="px-2 border border-[#E8E5E2] rounded-lg">Clear</button>}</div></label>
              <label className="col-span-2">Estimated value (₹)<input type="number" min={0} defaultValue={open.leadValue ?? ""} key={`${open.id}-v-${open.leadValue ?? ""}`} onBlur={(e) => { const v = e.target.value === "" ? null : Number(e.target.value); if (v !== (open.leadValue ?? null)) void act(open.id, () => adminClient.updateLeadDetails(open.id, { estimatedValue: v }), "Value saved"); }} className="mt-1 w-full px-2 py-1.5 border border-[#E8E5E2] rounded-lg" /></label>
            </div>

            <div><span className="font-semibold block mb-1">Tags</span><div className="flex flex-wrap gap-1.5">{(open.tags ?? []).map((t) => <button key={t} onClick={() => void act(open.id, () => adminClient.updateLeadDetails(open.id, { tags: (open.tags ?? []).filter((x) => x !== t) }), "Tag removed")} className="px-2 py-0.5 rounded bg-stone-100 hover:bg-red-50" title="Remove tag">{t} ×</button>)}<input value={tagText} onChange={(e) => setTagText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && tagText.trim()) { e.preventDefault(); const t = tagText.trim(); setTagText(""); void act(open.id, () => adminClient.updateLeadDetails(open.id, { tags: [...(open.tags ?? []), t] }), "Tag added"); } }} placeholder="Add tag + Enter" className="px-2 py-0.5 border border-[#E8E5E2] rounded text-[11px] w-28" /></div></div>

            <div className="space-y-1 pt-2 border-t border-[#E8E5E2]"><span className="font-semibold block">Where it came from</span>
              {([["Source", open.source], ["Form", open.attribution?.formName], ["Landing page", open.landingPage], ["Referrer", open.referrer], ["UTM source", open.utm?.source], ["UTM medium", open.utm?.medium], ["UTM campaign", open.utm?.campaign], ["Service", open.service]] as const).filter(([, v]) => v).map(([k, v]) => <p key={k} className="flex gap-2"><span className="w-24 shrink-0 text-stone-400">{k}</span><span className="break-all">{v}</span></p>)}
              <p className="flex gap-2"><span className="w-24 shrink-0 text-stone-400">Received</span>{open.date} UTC</p></div>

            <div className="pt-2 border-t border-[#E8E5E2] space-y-2"><span className="font-semibold block">Email</span>
              {([["lead_internal", "Internal notification"], ["lead_confirmation", "Visitor confirmation"]] as const).map(([key, label]) => {
                const d = leadEmails.find((x) => x.templateKey === key);
                return (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span>{label}: <b className={d?.status === "SENT" ? "text-green-700" : d?.status === "FAILED" ? "text-red-600" : "text-stone-500"}>{d?.status ?? "NOT SENT"}</b>{d?.errorMessage && d.status !== "SENT" ? <span className="block text-[10px] text-stone-400">{d.errorMessage}</span> : null}</span>
                    {d && (d.status === "FAILED" || d.status === "SKIPPED") && <button type="button" onClick={() => void act(open.id, () => adminClient.retryEmailDelivery(d.id), "Email retried")} className="px-2 py-1 border border-[#E8E5E2] rounded font-semibold hover:bg-stone-50 shrink-0">Retry {key === "lead_internal" ? "Internal" : "Visitor"} Email</button>}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E8E5E2] space-y-2"><span className="font-semibold block">Tasks</span>
              {(open.tasks ?? []).map((t) => <p key={t.id} className={`flex gap-2 ${t.completed ? "line-through text-stone-400" : ""}`}><span>•</span><span className="flex-1">{t.title}{t.assignedTo ? ` — ${t.assignedTo}` : ""}</span></p>)}
              <div className="flex gap-2"><input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void addTask()} placeholder="New task for this lead…" className="flex-1 px-2 py-1.5 border border-[#E8E5E2] rounded-lg" /><button onClick={() => void addTask()} className="px-3 bg-[#FF5A00] text-white rounded-lg font-bold">Add</button></div></div>

            <div className="pt-2 border-t border-[#E8E5E2] space-y-2"><span className="font-semibold block">Notes</span>
              {open.notes.map((n) => <div key={n.id} className="p-2 rounded-lg bg-stone-50 border border-[#E8E5E2]"><p className="whitespace-pre-wrap">{n.text}</p><p className="mt-1 text-[10px] text-stone-400">{n.author} · {n.date} UTC</p></div>)}
              <div className="flex gap-2"><input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && note.trim()) { const t = note.trim(); setNote(""); void act(open.id, () => adminClient.addLeadNote(open.id, t), "Note added"); } }} placeholder="Add an internal note…" className="flex-1 px-2 py-1.5 border border-[#E8E5E2] rounded-lg" /><button aria-label="Add note" onClick={() => { if (note.trim()) { const t = note.trim(); setNote(""); void act(open.id, () => adminClient.addLeadNote(open.id, t), "Note added"); } }} className="px-3 border border-[#E8E5E2] rounded-lg"><Send className="w-3.5 h-3.5" /></button></div></div>

            <div className="pt-2 border-t border-[#E8E5E2] space-y-2"><span className="font-semibold block">Activity</span>
              {!open.activities?.length && <p className="text-stone-400">No activity recorded yet.</p>}
              <ul className="space-y-2">{open.activities?.map((a) => <li key={a.id} className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF5A00] shrink-0" /><div><p className="font-semibold">{ACTIVITY_LABEL[a.type] ?? a.type}{describe(a, who) ? <span className="font-normal text-stone-500"> · {describe(a, who)}</span> : null}</p><p className="text-[10px] text-stone-400">{a.actor} · {when(a.at)}</p></div></li>)}</ul></div>
          </aside>
        )}
      </div>
    </div>
  );
}
