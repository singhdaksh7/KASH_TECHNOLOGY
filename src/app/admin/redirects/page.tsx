"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { adminClient, errorMessage, type RedirectItem } from "@/lib/admin-client";
import { Plus, Trash2, ArrowRight } from "lucide-react";

const CODES = [301, 302, 307, 308] as const;

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<RedirectItem[]>([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [statusCode, setStatusCode] = useState<RedirectItem["statusCode"]>(301);
  const { addToast } = useToast();
  const load = () => adminClient.getRedirects().then(setRedirects).catch((e) => addToast({ title: "Could not load redirects", message: errorMessage(e), type: "error" }));
  useEffect(() => {
    let alive = true;
    adminClient.getRedirects().then((d) => alive && setRedirects(d)).catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminClient.saveRedirect({ sourcePath: source, destination, statusCode, active: true });
      setSource(""); setDestination("");
      addToast({ title: "Redirect added", message: "Live within a minute.", type: "success" });
      load();
    } catch (err) {
      addToast({ title: "Invalid redirect", message: errorMessage(err), type: "error" });
    }
  };
  const toggle = async (r: RedirectItem) => {
    try { await adminClient.saveRedirect({ ...r, active: !r.active }); load(); } catch (err) { addToast({ title: "Update failed", message: errorMessage(err), type: "error" }); }
  };
  const remove = async (r: RedirectItem) => {
    if (!confirm(`Delete redirect ${r.sourcePath}?`)) return;
    await adminClient.deleteRedirect(r.id).catch((err) => addToast({ title: "Delete failed", message: errorMessage(err), type: "error" }));
    load();
  };

  const input = "px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-mono focus:outline-none focus:border-[#FF5A00]";
  return (
    <div className="space-y-6">
      <AdminHeader title="Redirect Manager" subtitle="301 / 302 / 307 / 308 redirects. Loops and reserved paths are rejected." breadcrumbs={[{ label: "SEO" }, { label: "Redirects" }]} />
      <div className="px-4 sm:px-6 space-y-5 max-w-5xl">
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-[#E8E5E2] p-4 grid gap-3 sm:grid-cols-[1fr_1fr_110px_auto] items-end shadow-xs">
          <label className="text-[11px] font-semibold text-stone-500">Source path<input required value={source} onChange={(e) => setSource(e.target.value)} placeholder="/old-page" className={`${input} w-full mt-1`} /></label>
          <label className="text-[11px] font-semibold text-stone-500">Destination<input required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="/new-page" className={`${input} w-full mt-1`} /></label>
          <label className="text-[11px] font-semibold text-stone-500">Type<select value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value) as RedirectItem["statusCode"])} className={`${input} w-full mt-1`}>{CODES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          <button type="submit" className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 justify-center"><Plus className="w-3.5 h-3.5" />Add</button>
        </form>
        <div className="bg-white rounded-xl border border-[#E8E5E2] divide-y divide-[#E8E5E2] shadow-xs">
          {redirects.map((r) => (
            <div key={r.id} className="p-3 flex items-center gap-3 text-xs flex-wrap">
              <code className="font-mono">{r.sourcePath}</code><ArrowRight className="w-3.5 h-3.5 text-stone-400" /><code className="font-mono text-[#FF5A00] break-all">{r.destination}</code>
              <span className="ml-auto px-2 py-0.5 rounded bg-stone-100 font-mono">{r.statusCode}</span>
              <button onClick={() => toggle(r)} className={`px-2 py-0.5 rounded text-[11px] font-semibold ${r.active ? "bg-green-100 text-green-700" : "bg-stone-200 text-stone-600"}`}>{r.active ? "Active" : "Paused"}</button>
              <button onClick={() => remove(r)} aria-label="Delete redirect" className="text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {!redirects.length && <p className="p-6 text-center text-xs text-stone-400">No redirects yet.</p>}
        </div>
      </div>
    </div>
  );
}
