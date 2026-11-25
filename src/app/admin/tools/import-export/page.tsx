"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Download, ShieldCheck, Upload, XCircle } from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

type ExportKind = "pages" | "portfolio" | "articles" | "forms" | "leads";
type ImportKind = "pages" | "portfolio" | "leads";
type Report = Awaited<ReturnType<typeof adminClient.importData>>;

const EXPORTS: Array<{ kind: ExportKind; label: string; formats: Array<"json" | "csv"> }> = [
  { kind: "pages", label: "Pages (with sections and SEO)", formats: ["json"] },
  { kind: "portfolio", label: "Portfolio projects", formats: ["json", "csv"] },
  { kind: "articles", label: "Insights articles", formats: ["json"] },
  { kind: "forms", label: "Forms and fields (no submissions)", formats: ["json"] },
  { kind: "leads", label: "Leads", formats: ["csv"] },
];
const IMPORTS: Array<{ kind: ImportKind; label: string; accept: string; hint: string }> = [
  { kind: "pages", label: "Pages — JSON", accept: ".json,application/json", hint: 'A file shaped like the pages export: { "pages": [ … ] }. Pages are always created as drafts.' },
  { kind: "portfolio", label: "Portfolio projects — CSV", accept: ".csv,text/csv", hint: "Columns: title, slug, summary, category, content (JSON). Created as drafts." },
  { kind: "leads", label: "Leads — CSV", accept: ".csv,text/csv", hint: "Columns: name, email, phone, company, service, message, status, priority, tags, estimatedValue." },
];

export default function ImportExportPage() {
  const { addToast } = useToast();
  const [exp, setExp] = useState<ExportKind>("pages");
  const [fmt, setFmt] = useState<"json" | "csv">("json");
  const [exporting, setExporting] = useState(false);
  const [kind, setKind] = useState<ImportKind>("leads");
  const [file, setFile] = useState<{ name: string; data: unknown } | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [skipRejected, setSkipRejected] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [done, setDone] = useState<{ created: number; skipped: number } | null>(null);

  const cfg = EXPORTS.find((e) => e.kind === exp)!;
  const icfg = IMPORTS.find((i) => i.kind === kind)!;

  const doExport = async () => {
    setExporting(true);
    try {
      const { blob, filename, count } = await adminClient.exportData(exp, cfg.formats.includes(fmt) ? fmt : cfg.formats[0]);
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: filename });
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      addToast({ title: "Export ready", message: `${count} record${count === 1 ? "" : "s"} downloaded as ${filename}.`, type: "success" });
    } catch (e) { addToast({ title: "Export failed", message: errorMessage(e), type: "error" }); } finally { setExporting(false); }
  };

  const reset = () => { setFile(null); setReport(null); setDone(null); };
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    reset();
    try {
      const text = await f.text();
      setFile({ name: f.name, data: kind === "pages" ? JSON.parse(text) : text });
    } catch { addToast({ title: "Could not read file", message: kind === "pages" ? "That file is not valid JSON." : "That file could not be read.", type: "error" }); }
  };
  const opts = () => ({ data: file!.data, allowDuplicates: kind === "leads" ? allowDuplicates : undefined });
  const dryRun = async () => {
    if (!file) return;
    setBusy(true); setDone(null);
    try { setReport(await adminClient.importData(kind, { mode: "dry-run", ...opts() })); } catch (e) { setReport(null); addToast({ title: "Validation failed", message: errorMessage(e), type: "error" }); } finally { setBusy(false); }
  };
  const execute = async () => {
    if (!file || !report) return;
    setBusy(true);
    try {
      const r = await adminClient.importData(kind, { mode: "execute", digest: report.digest, skipRejected, ...opts() });
      setDone(r.executed ?? null); setReport(null);
      addToast({ title: "Import complete", message: `${r.executed?.created ?? 0} created, ${r.executed?.skipped ?? 0} skipped.`, type: "success" });
    } catch (e) { addToast({ title: "Import not run", message: errorMessage(e), type: "error" }); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Import & Export" subtitle="Back up content, or bring in pages, projects and leads. Imports are validated first; nothing is written until you confirm." breadcrumbs={[{ label: "Tools" }, { label: "Import & Export" }]} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-xs">
        <section className="bg-white rounded-xl border border-[#E8E5E2] p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Download className="w-4 h-4 text-[#FF5A00]" />Export</h3>
          <label className="block"><span className="block font-semibold mb-1">What to export</span>
            <select value={exp} onChange={(e) => { const k = e.target.value as ExportKind; setExp(k); setFmt(EXPORTS.find((x) => x.kind === k)!.formats[0]); }} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white">{EXPORTS.map((e) => <option key={e.kind} value={e.kind}>{e.label}</option>)}</select></label>
          {cfg.formats.length > 1 && <div className="flex gap-2">{cfg.formats.map((f) => <button key={f} onClick={() => setFmt(f)} className={`px-3 py-1.5 rounded-lg font-semibold ${fmt === f ? "bg-[#FF5A00] text-white" : "border border-[#E8E5E2]"}`}>{f.toUpperCase()}</button>)}</div>}
          <p className="flex items-start gap-2 text-stone-600"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />Exports never include passwords, sessions, two-factor secrets, recovery codes or API keys. CSV cells that spreadsheets could run as formulas are neutralised.</p>
          <button onClick={doExport} disabled={exporting} className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-bold disabled:opacity-60">{exporting ? "Preparing…" : "Download export"}</button>
        </section>

        <section className="bg-white rounded-xl border border-[#E8E5E2] p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Upload className="w-4 h-4 text-[#FF5A00]" />Import</h3>
          <label className="block"><span className="block font-semibold mb-1">What to import</span>
            <select value={kind} onChange={(e) => { setKind(e.target.value as ImportKind); reset(); }} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white">{IMPORTS.map((i) => <option key={i.kind} value={i.kind}>{i.label}</option>)}</select></label>
          <p className="text-stone-500">{icfg.hint}</p>
          <input type="file" accept={icfg.accept} onChange={onFile} className="block w-full text-xs" aria-label="File to import" />
          {file && <p className="font-semibold">Selected: {file.name}</p>}
          {kind === "leads" && <label className="flex items-center gap-2"><input type="checkbox" checked={allowDuplicates} onChange={(e) => { setAllowDuplicates(e.target.checked); setReport(null); }} />Allow leads whose email already exists</label>}
          <button onClick={dryRun} disabled={!file || busy} className="px-4 py-2 border border-[#E8E5E2] rounded-lg font-bold hover:bg-stone-50 disabled:opacity-50">{busy && !report ? "Checking…" : "1 · Validate (dry run)"}</button>

          {report && (
            <div className="space-y-3 pt-3 border-t border-[#E8E5E2]">
              <p className="font-bold flex flex-wrap gap-3"><span className="text-emerald-700 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />{report.counts.accepted} ready</span><span className="text-red-700 inline-flex items-center gap-1"><XCircle className="w-4 h-4" />{report.counts.rejected} rejected</span><span className="text-amber-700 inline-flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{report.counts.warnings} warnings</span></p>
              {report.rejected.length > 0 && <ul className="max-h-40 overflow-y-auto divide-y divide-red-100 border border-red-200 rounded-lg bg-red-50">{report.rejected.map((r) => <li key={r.row} className="p-2"><b>Row {r.row}</b> · {r.summary}<br /><span className="text-red-700">{r.errors.join("; ")}</span></li>)}</ul>}
              {report.warnings.length > 0 && <ul className="max-h-32 overflow-y-auto divide-y divide-amber-100 border border-amber-200 rounded-lg bg-amber-50">{report.warnings.map((w, i) => <li key={i} className="p-2">Row {w.row}: {w.message}</li>)}</ul>}
              {report.counts.rejected > 0 && report.counts.accepted > 0 && <label className="flex items-center gap-2"><input type="checkbox" checked={skipRejected} onChange={(e) => setSkipRejected(e.target.checked)} />Import the {report.counts.accepted} accepted rows and skip the rejected ones</label>}
              <button onClick={execute} disabled={busy || report.counts.accepted === 0 || (report.counts.rejected > 0 && !skipRejected)} className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-bold disabled:opacity-50">{busy ? "Importing…" : `2 · Import ${report.counts.accepted} row${report.counts.accepted === 1 ? "" : "s"}`}</button>
            </div>
          )}
          {done && <p className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">Imported {done.created} row{done.created === 1 ? "" : "s"}; {done.skipped} skipped.</p>}
        </section>
      </div>
    </div>
  );
}
