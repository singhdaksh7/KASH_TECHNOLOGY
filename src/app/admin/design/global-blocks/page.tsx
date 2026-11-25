"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Copy, ExternalLink, Link2, Plus, Save, Trash2, Unlink } from "lucide-react";
import type { AdminPageItem, GlobalBlock, SectionType } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

const BLOCK_TYPES: SectionType[] = ["CTA", "Rich Text", "Stats", "Trust Strip", "Logo Strip", "FAQ", "Services Grid", "Process", "Testimonials", "Founder", "Team", "Contact Form"];
const isText = (v: unknown): v is string => typeof v === "string";
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export default function GlobalBlocksPage() {
  const { addToast } = useToast();
  const [blocks, setBlocks] = useState<GlobalBlock[]>([]);
  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<GlobalBlock | null>(null);
  const [linkPage, setLinkPage] = useState("");
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<SectionType>("CTA");

  const refresh = useCallback(async (selectId?: string) => {
    try {
      const [b, p] = await Promise.all([adminClient.getGlobalBlocks(), adminClient.getPages().catch(() => [] as AdminPageItem[])]);
      setBlocks(b);
      setPages(p);
      setEditing((cur) => { const pick = b.find((x) => x.id === (selectId ?? cur?.id)) ?? null; return pick ? clone(pick) : null; });
      setError("");
    } catch (e) { setError(errorMessage(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    Promise.all([adminClient.getGlobalBlocks(), adminClient.getPages().catch(() => [] as AdminPageItem[])])
      .then(([b, p]) => { setBlocks(b); setPages(p); }).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);

  const run = async (fn: () => Promise<unknown>, ok: { title: string; message: string }, selectId?: string) => {
    setBusy(true);
    try { await fn(); await refresh(selectId); addToast({ ...ok, type: "success" }); }
    catch (e) { addToast({ title: "Action failed", message: errorMessage(e), type: "error" }); }
    finally { setBusy(false); }
  };

  const create = () => run(async () => {
    const b = await adminClient.saveGlobalBlock({
      id: "new", name: newName.trim(), description: "", category: "CTA", usageCount: 0, pagesUsing: [], updatedAt: "",
      section: { id: "new", type: newType, order: 1, enabled: true, content: newType === "CTA" ? { heading: "Ready to start your project?", body: "Tell us what you need and we'll reply within one working day.", primaryCta: "Get in touch", primaryCtaUrl: "/contact" } : { heading: newName.trim() }, style: {} as GlobalBlock["section"]["style"] },
    });
    setNewName("");
    return b;
  }, { title: "Block created", message: "Add it to a page with “Link to page”." });

  const setContent = (k: string, v: string) => editing && setEditing({ ...editing, section: { ...editing.section, content: { ...editing.section.content, [k]: v } } });
  const textKeys = editing ? Object.keys(editing.section.content).filter((k) => isText(editing.section.content[k])) : [];
  const otherKeys = editing ? Object.keys(editing.section.content).filter((k) => !isText(editing.section.content[k])) : [];

  return (
    <div className="space-y-6">
      <AdminHeader title="Global Blocks" subtitle="Reusable sections shared across pages. Edit once; every page that links the block updates." breadcrumbs={[{ label: "Design" }, { label: "Global Blocks" }]} />
      {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-xl border border-[#E8E5E2] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">New block</h4>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Block name" className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs" />
            <select value={newType} onChange={(e) => setNewType(e.target.value as SectionType)} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs bg-white">{BLOCK_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            <button disabled={busy || !newName.trim()} onClick={create} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold disabled:opacity-50"><Plus className="w-4 h-4" />Create block</button>
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Blocks ({blocks.length})</h4>
          {loading && <p className="text-xs text-stone-400">Loading…</p>}
          {!loading && !blocks.length && <p className="text-xs text-stone-500 p-4 bg-white rounded-xl border border-[#E8E5E2]">No global blocks yet.</p>}
          {blocks.map((b) => (
            <button key={b.id} onClick={() => setEditing(clone(b))} className={`w-full text-left p-4 rounded-xl border-2 bg-white transition ${editing?.id === b.id ? "border-[#FF5A00]" : "border-[#E8E5E2] hover:border-stone-400"}`}>
              <div className="flex items-center justify-between gap-2"><span className="font-bold text-xs">{b.name}</span><span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF3E9] text-[#FF5A00]">{b.usageCount} {b.usageCount === 1 ? "page" : "pages"}</span></div>
              <p className="mt-1 text-[11px] text-stone-500">{b.section.type} · {b.category}</p>
            </button>
          ))}
        </div>

        {editing && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E5E2] p-6 space-y-6">
            {editing.usageCount > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div><span className="font-bold block">Linked on {editing.usageCount} {editing.usageCount === 1 ? "page" : "pages"}</span>Saving changes this block everywhere it is linked. Linked pages that were in review, approved or scheduled return to Draft so they are re-approved.</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <label className="block"><span className="block font-semibold mb-1">Name</span><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-semibold" /></label>
              <label className="block"><span className="block font-semibold mb-1">Section type</span>
                <select value={editing.section.type} onChange={(e) => setEditing({ ...editing, section: { ...editing.section, type: e.target.value as SectionType } })} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white">{BLOCK_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="block col-span-2"><span className="block font-semibold mb-1">Description</span><input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" /></label>
            </div>

            <div className="pt-4 border-t border-[#E8E5E2] space-y-3 text-xs">
              <h5 className="font-bold uppercase tracking-wider">Content</h5>
              {textKeys.map((k) => (
                <label key={k} className="block"><span className="block font-semibold mb-1">{k}</span>
                  {(editing.section.content[k] as string).length > 90 ? <textarea rows={3} value={editing.section.content[k] as string} onChange={(e) => setContent(k, e.target.value)} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" />
                    : <input value={editing.section.content[k] as string} onChange={(e) => setContent(k, e.target.value)} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" />}
                </label>
              ))}
              {otherKeys.length > 0 && <p className="text-[11px] text-stone-500">List fields ({otherKeys.join(", ")}) are preserved but edited inside the page builder after detaching.</p>}
            </div>

            <div className="pt-4 border-t border-[#E8E5E2] space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-400">Pages using this block ({editing.pagesUsing.length})</span>
              <div className="flex flex-wrap gap-2">
                {editing.pagesUsing.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1 border border-[#E8E5E2] rounded-lg bg-stone-50 text-stone-700">
                    <Link href={`/admin/pages/${p.id}/edit`} className="px-3 py-1.5 hover:text-[#FF5A00] inline-flex items-center gap-1.5">{p.title}<ExternalLink className="w-3 h-3 opacity-60" /></Link>
                    <button disabled={busy} title="Detach from this page" onClick={() => run(() => adminClient.detachGlobalBlock(editing.id, p.id), { title: "Detached", message: `${p.title} now has its own copy.` }, editing.id)} className="px-2 py-1.5 border-l border-[#E8E5E2] hover:text-red-600"><Unlink className="w-3 h-3" /></button>
                  </span>
                ))}
                {!editing.pagesUsing.length && <p className="text-stone-400 italic">Not placed on any page yet.</p>}
              </div>
              <div className="flex gap-2">
                <select value={linkPage} onChange={(e) => setLinkPage(e.target.value)} className="flex-1 px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"><option value="">Choose a page to add this block to…</option>{pages.map((p) => <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>)}</select>
                <button disabled={busy || !linkPage} onClick={() => run(() => adminClient.linkGlobalBlock(editing.id, linkPage), { title: "Linked", message: "Added to the page's draft. Publish the page to make it live." }, editing.id)} className="px-3 py-2 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-[#FFF3E9] disabled:opacity-50 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" />Link to page</button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E5E2] flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button disabled={busy} onClick={() => run(async () => { const d = await adminClient.duplicateGlobalBlock(editing.id); return d; }, { title: "Duplicated", message: "A copy was created." })} className="px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" />Duplicate</button>
                <button disabled={busy || editing.usageCount > 0} title={editing.usageCount > 0 ? "Detach this block from every page before deleting it" : "Delete block"}
                  onClick={() => { if (confirm(`Delete "${editing.name}"? This cannot be undone.`)) void run(() => adminClient.deleteGlobalBlock(editing.id), { title: "Deleted", message: "Block removed." }); }}
                  className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 disabled:opacity-40 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" />Delete</button>
              </div>
              <button disabled={busy} onClick={() => run(() => adminClient.saveGlobalBlock(editing), { title: "Block saved", message: editing.usageCount ? `Updated on ${editing.usageCount} linked page(s).` : "Saved." }, editing.id)} className="px-5 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-60"><Save className="w-4 h-4" />Save changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
