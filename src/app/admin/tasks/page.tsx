"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import type { AdminTask, AdminTaskEntity, AdminTaskStatus, LeadPriority } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

type Assignee = { id: string; name: string; email: string };
type Option = { id: string; label: string };
const PRIORITY_CLS: Record<LeadPriority, string> = { LOW: "bg-stone-100 text-stone-600", MEDIUM: "bg-blue-50 text-blue-700", HIGH: "bg-amber-50 text-amber-700", URGENT: "bg-red-50 text-red-700" };
const ENTITIES: AdminTaskEntity[] = ["System", "Lead", "Page", "Article", "Portfolio"];
const blank = (): AdminTask => ({ id: "new", title: "", description: "", relatedEntity: "System", assignee: "", dueDate: "", priority: "MEDIUM", status: "TODO", createdAt: "" });

export default function TasksPage() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [people, setPeople] = useState<Assignee[]>([]);
  const [draft, setDraft] = useState<AdminTask | null>(null);
  const [picked, setPicked] = useState<{ type: string; items: Option[] }>({ type: "", items: [] });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setTasks(await adminClient.getTasks()); setError(""); } catch (e) { setError(errorMessage(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    adminClient.getTasks().then((t) => { setTasks(t); setError(""); }).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
    adminClient.getAssignees().then(setPeople).catch(() => undefined);
  }, []);

  // Entity picker: list real records of the chosen type (only what this user may view).
  useEffect(() => {
    if (!draft || draft.relatedEntity === "System") return;
    const t = draft.relatedEntity;
    const load = t === "Lead" ? adminClient.getLeads().then((r) => r.map((x) => ({ id: x.id, label: `${x.name}${x.company ? ` — ${x.company}` : ""}` })))
      : t === "Page" ? adminClient.getPages().then((r) => r.map((x) => ({ id: x.id, label: `${x.title} (${x.slug})` })))
      : t === "Article" ? adminClient.getArticles().then((r) => r.map((x) => ({ id: x.id, label: x.title })))
      : adminClient.getPortfolio().then((r) => r.map((x) => ({ id: x.id, label: x.name })));
    load.then((items) => setPicked({ type: t, items })).catch((e) => { addToast({ title: `Cannot list ${t.toLowerCase()}s`, message: errorMessage(e), type: "error" }); });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the entity type changes
  }, [draft?.relatedEntity]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft || !draft.title.trim()) return;
    if (draft.relatedEntity !== "System" && !draft.relatedId) { addToast({ title: "Pick a record", message: `Choose which ${draft.relatedEntity.toLowerCase()} this task is about.`, type: "error" }); return; }
    setSaving(true);
    try {
      await adminClient.saveTask({ ...draft, title: draft.title.trim(), relatedId: draft.relatedEntity === "System" ? undefined : draft.relatedId });
      addToast({ title: draft.id === "new" ? "Task created" : "Task updated", message: draft.title.trim(), type: "success" });
      setDraft(null);
      await load();
    } catch (err) { addToast({ title: "Could not save task", message: errorMessage(err), type: "error" }); } finally { setSaving(false); }
  };
  const toggle = async (t: AdminTask) => {
    const next: AdminTaskStatus = t.status === "DONE" ? "TODO" : "DONE";
    try { await adminClient.updateTaskStatus(t.id, next); setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, status: next } : x))); }
    catch (err) { addToast({ title: "Could not update task", message: errorMessage(err), type: "error" }); }
  };
  const remove = async (t: AdminTask) => {
    if (!confirm(`Delete task "${t.title}"?`)) return;
    try { await adminClient.deleteTask(t.id); setTasks((all) => all.filter((x) => x.id !== t.id)); addToast({ title: "Task deleted", message: t.title, type: "info" }); }
    catch (err) { addToast({ title: "Could not delete task", message: errorMessage(err), type: "error" }); }
  };

  const options = draft && picked.type === draft.relatedEntity ? picked.items : [];
  const shown = tasks.filter((t) => filter === "ALL" || t.status === filter);
  const overdue = (t: AdminTask) => t.dueDate && t.status !== "DONE" && t.status !== "CANCELLED" && new Date(`${t.dueDate}T23:59:59`) < new Date();

  return (
    <div className="space-y-6">
      <AdminHeader title="Tasks" subtitle="Follow-ups and work items, optionally linked to a lead, page, article or portfolio project" breadcrumbs={[{ label: "System" }, { label: "Tasks" }]}
        actions={<button onClick={() => setDraft(blank())} className="flex items-center gap-2 px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold"><Plus className="w-4 h-4" />New task</button>} />
      {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
      <div className="flex gap-2 flex-wrap">
        {(["ALL", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === s ? "bg-[#FF5A00] text-white" : "bg-white border border-[#E8E5E2] text-stone-700 hover:bg-stone-50"}`}>{s === "ALL" ? "All" : s.replace("_", " ")}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#E8E5E2] divide-y divide-[#E8E5E2]">
        {loading && <p className="p-6 text-xs text-stone-400">Loading tasks…</p>}
        {!loading && !shown.length && <p className="p-6 text-xs text-stone-500">No tasks here yet.</p>}
        {shown.map((t) => (
          <div key={t.id} className={`p-4 flex items-start gap-3 ${t.status === "DONE" ? "opacity-60" : ""}`}>
            <button onClick={() => toggle(t)} aria-label={t.status === "DONE" ? "Reopen task" : "Mark done"} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${t.status === "DONE" ? "bg-emerald-500 border-emerald-500 text-white" : "border-stone-300 hover:border-[#FF5A00]"}`}>{t.status === "DONE" && <Check className="w-3.5 h-3.5" />}</button>
            <div className="flex-1 min-w-0 text-xs">
              <p className={`font-bold text-[#0B0B0F] ${t.status === "DONE" ? "line-through" : ""}`}>{t.title}</p>
              {t.description && <p className="mt-0.5 text-stone-500">{t.description}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${PRIORITY_CLS[t.priority]}`}>{t.priority}</span>
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600">{t.status.replace("_", " ")}</span>
                {t.relatedEntity !== "System" && (t.entityUrl ? <Link href={t.entityUrl} className="text-[#FF5A00] font-semibold hover:underline">{t.relatedEntity}: {t.entityTitle ?? "record"}</Link> : <span>{t.relatedEntity}: {t.entityTitle}</span>)}
                <span className="text-stone-500">{t.assignee ? `Assigned to ${t.assignee}` : "Unassigned"}</span>
                {t.dueDate && <span className={overdue(t) ? "text-red-600 font-bold" : "text-stone-500"}>Due {t.dueDate}{overdue(t) ? " · overdue" : ""}</span>}
              </div>
            </div>
            <button onClick={() => setDraft({ ...t })} aria-label="Edit task" className="p-1.5 text-stone-400 hover:text-[#FF5A00]"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => remove(t)} aria-label="Delete task" className="p-1.5 text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-label="Task">
          <form onSubmit={save} className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-3 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold">{draft.id === "new" ? "New task" : "Edit task"}</h3><button type="button" onClick={() => setDraft(null)} aria-label="Close"><X className="w-4 h-4" /></button></div>
            <input required autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="What needs doing?" className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-semibold" />
            <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} placeholder="Details (optional)" className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <label>Assignee<select value={draft.assigneeId ?? ""} onChange={(e) => { const p = people.find((x) => x.id === e.target.value); setDraft({ ...draft, assigneeId: p?.id, assignee: p?.name ?? "" }); }} className="mt-1 w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"><option value="">Unassigned</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <label>Priority<select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as LeadPriority })} className="mt-1 w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white">{(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => <option key={p}>{p}</option>)}</select></label>
              <label>Due date<input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} className="mt-1 w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" /></label>
              <label>Status<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as AdminTaskStatus })} className="mt-1 w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white">{(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const).map((p) => <option key={p}>{p}</option>)}</select></label>
              <label>Related to<select value={draft.relatedEntity} onChange={(e) => setDraft({ ...draft, relatedEntity: e.target.value as AdminTaskEntity, relatedId: undefined })} className="mt-1 w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white">{ENTITIES.map((p) => <option key={p} value={p}>{p === "System" ? "Nothing (general task)" : p}</option>)}</select></label>
              {draft.relatedEntity !== "System" && <label>Record<select value={draft.relatedId ?? ""} onChange={(e) => setDraft({ ...draft, relatedId: e.target.value })} className="mt-1 w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"><option value="">Choose…</option>{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>}
            </div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setDraft(null)} className="px-4 py-2 border border-[#E8E5E2] rounded-lg font-semibold">Cancel</button><button disabled={saving} className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-bold disabled:opacity-60">{saving ? "Saving…" : "Save task"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
