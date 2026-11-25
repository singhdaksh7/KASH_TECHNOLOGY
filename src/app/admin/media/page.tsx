"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Folder, FolderPlus, Grid, Image as ImageIcon, List as ListIcon, Pencil, Search, Sparkles, Trash2, Upload, X, Zap } from "lucide-react";
import type { MediaFolder, MediaItem } from "@/lib/admin-client/types";
import { adminClient, AdminApiError, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,application/pdf,video/mp4,video/webm";
const OPT_OFF = "Image optimization is not enabled on this server yet.";

export default function MediaLibraryPage() {
  const { addToast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folder, setFolder] = useState<string>("all"); // "all" | "none" | folder id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [optNote, setOptNote] = useState("");
  const [optBusy, setOptBusy] = useState(false);
  const [canOptimize, setCanOptimize] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    try {
      const [m, f] = await Promise.all([adminClient.getMedia(), adminClient.getMediaFolders()]);
      setMedia(m); setFolders(f); setSelected((cur) => (cur ? m.find((x) => x.id === cur.id) ?? null : null)); setError("");
    } catch (e) { setError(errorMessage(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    Promise.all([adminClient.getMedia(), adminClient.getMediaFolders()]).then(([m, f]) => { setMedia(m); setFolders(f); }).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
    adminClient.getMediaCapabilities().then((c) => setCanOptimize(c.optimization.supported)).catch(() => setCanOptimize(false));
  }, []);

  const fail = (title: string, e: unknown) => addToast({ title, message: errorMessage(e), type: "error" });
  const folderName = (id?: string) => (id ? folders.find((f) => f.id === id)?.path ?? "Folder" : "Unfiled");

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const item = await adminClient.uploadMedia(file, { altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ") });
      if (folder !== "all" && folder !== "none") await adminClient.moveMediaToFolder([item.id], folder);
      await load(); addToast({ title: "Uploaded", message: `"${file.name}" saved to the library.`, type: "success" });
    } catch (err) { fail("Upload failed", err); }
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.filename}"?`)) return;
    try {
      await adminClient.deleteMedia(item.id);
    } catch (err) {
      if (err instanceof AdminApiError && err.code === "MEDIA_IN_USE") {
        if (!confirm(`${err.message}\n\nForce delete anyway? Pages using it will show a missing image. This is recorded in the audit log.`)) return;
        try { await adminClient.deleteMedia(item.id, true); } catch (e2) { return fail("Force delete not allowed", e2); }
      } else return fail("Delete failed", err);
    }
    setChecked((c) => c.filter((x) => x !== item.id)); if (selected?.id === item.id) setSelected(null);
    await load(); addToast({ title: "Deleted", message: `"${item.filename}" removed.`, type: "info" });
  };

  const saveMeta = async (item: MediaItem) => {
    try { await adminClient.updateMedia(item.id, { altText: item.altText, title: item.title, caption: item.caption }); await load(); addToast({ title: "Saved", message: "Media details updated.", type: "success" }); }
    catch (err) { fail("Save failed", err); }
  };
  const replace = async (item: MediaItem, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try { await adminClient.replaceMedia(item.id, file); await load(); addToast({ title: "File replaced", message: "References were updated automatically.", type: "success" }); }
    catch (err) { fail("Replace failed", err); }
  };

  const move = async (ids: string[], folderId: string | null) => {
    try { await adminClient.moveMediaToFolder(ids, folderId); setChecked([]); await load(); addToast({ title: "Moved", message: `${ids.length} asset${ids.length === 1 ? "" : "s"} moved to ${folderName(folderId ?? undefined)}.`, type: "success" }); }
    catch (err) { fail("Move failed", err); }
  };
  const newFolder = async () => {
    const name = window.prompt(folder !== "all" && folder !== "none" ? `New folder inside "${folderName(folder)}"` : "New folder name");
    if (!name?.trim()) return;
    try { await adminClient.createMediaFolder(name.trim(), folder !== "all" && folder !== "none" ? folder : null); await load(); }
    catch (err) { fail("Could not create folder", err); }
  };
  const renameFolder = async (f: MediaFolder) => {
    const name = window.prompt("Rename folder", f.name);
    if (!name?.trim() || name === f.name) return;
    try { await adminClient.renameMediaFolder(f.id, name.trim()); await load(); } catch (err) { fail("Could not rename", err); }
  };
  const deleteFolder = async (f: MediaFolder) => {
    if (!confirm(`Delete empty folder "${f.name}"?`)) return;
    try { await adminClient.deleteMediaFolder(f.id); if (folder === f.id) setFolder("all"); await load(); }
    catch (err) { fail(err instanceof AdminApiError && err.code === "FOLDER_NOT_EMPTY" ? "Folder is not empty" : "Could not delete folder", err); }
  };

  const optimize = async (item: MediaItem) => {
    setOptBusy(true); setOptNote("");
    try { await adminClient.optimizeMediaItem(item.id); await load(); }
    catch (err) { if (err instanceof AdminApiError && err.code === "UNSUPPORTED_CAPABILITY") setOptNote(OPT_OFF); else fail("Optimization failed", err); }
    finally { setOptBusy(false); }
  };

  const shown = media.filter((m) => {
    const q = search.trim().toLowerCase();
    const inFolder = folder === "all" || (folder === "none" ? !m.folder : m.folder === folder);
    return inFolder && (!q || m.filename.toLowerCase().includes(q) || m.altText.toLowerCase().includes(q) || (m.tags ?? []).some((t) => t.includes(q)));
  });
  const unfiled = media.filter((m) => !m.folder).length;
  const activeFolder = folders.find((f) => f.id === folder);
  const thumb = (m: MediaItem, cls: string) => (m.type === "image" && m.url.startsWith("/") ? <Image src={m.url} alt={m.altText} fill className={cls} /> : <ImageIcon className="w-8 h-8 text-stone-400" />);

  return (
    <div className="space-y-6">
      <AdminHeader title="Media Library" subtitle="Upload, organise into folders, and see where each asset is used" breadcrumbs={[{ label: "Content" }, { label: "Media Library" }]}
        actions={<label className="flex items-center gap-2 px-4 py-2 bg-[#FF5A00] text-white rounded-lg text-xs font-semibold cursor-pointer"><Upload className="w-4 h-4" /><span>Upload asset</span><input type="file" onChange={upload} className="hidden" accept={ACCEPT} /></label>} />
      {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}

      <div className="flex gap-2 overflow-x-auto pb-1 items-center">
        {([["all", "All media", media.length], ["none", "Unfiled", unfiled]] as const).map(([id, label, n]) => (
          <button key={id} onClick={() => setFolder(id)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border ${folder === id ? "bg-[#FF5A00] text-white border-[#FF5A00]" : "bg-white text-stone-700 border-[#E8E5E2] hover:bg-stone-50"}`}>{label}<span className="px-1.5 rounded-full text-[10px] bg-black/10">{n}</span></button>
        ))}
        {folders.map((f) => (
          <button key={f.id} onClick={() => setFolder(f.id)} style={{ marginLeft: (f.depth ?? 1) > 1 ? 8 : 0 }} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border ${folder === f.id ? "bg-[#FF5A00] text-white border-[#FF5A00]" : "bg-white text-stone-700 border-[#E8E5E2] hover:bg-stone-50"}`}>
            <Folder className="w-3.5 h-3.5" />{f.path ?? f.name}<span className="px-1.5 rounded-full text-[10px] bg-black/10">{f.count}</span>
          </button>
        ))}
        <button onClick={newFolder} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-stone-300 text-stone-600 hover:border-[#FF5A00] whitespace-nowrap"><FolderPlus className="w-3.5 h-3.5" />New folder</button>
        {activeFolder && <>
          <button onClick={() => renameFolder(activeFolder)} aria-label="Rename folder" className="p-2 text-stone-500 hover:text-[#FF5A00]"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={() => deleteFolder(activeFolder)} aria-label="Delete folder" className="p-2 text-stone-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
        </>}
      </div>

      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" /><input type="text" placeholder="Search by filename, alt text or tag…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5E2] rounded-lg" /></div>
        {checked.length > 0 && (
          <div className="flex items-center gap-2 bg-[#FFF3E9] p-1.5 px-3 rounded-lg border border-[#FF5A00]/30 text-xs">
            <span className="font-bold text-[#FF5A00]">{checked.length} selected</span>
            <select defaultValue="" onChange={(e) => { if (e.target.value) void move(checked, e.target.value === "__none" ? null : e.target.value); e.target.value = ""; }} className="px-2 py-1 bg-white border border-[#E8E5E2] rounded text-xs">
              <option value="" disabled>Move to…</option><option value="__none">Unfiled</option>{folders.map((f) => <option key={f.id} value={f.id}>{f.path ?? f.name}</option>)}
            </select>
            <button onClick={() => setChecked([])} className="text-stone-500 hover:underline">Clear</button>
          </div>
        )}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-[#E8E5E2]">
          <button onClick={() => setView("grid")} aria-label="Grid view" className={`p-1.5 rounded-md ${view === "grid" ? "bg-white text-[#FF5A00]" : "text-[#4B5563]"}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setView("list")} aria-label="List view" className={`p-1.5 rounded-md ${view === "list" ? "bg-white text-[#FF5A00]" : "text-[#4B5563]"}`}><ListIcon className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 bg-white rounded-xl border border-[#E8E5E2] p-6 min-w-0">
          {loading ? <div className="py-16 text-center text-stone-400">Loading assets…</div> : shown.length === 0 ? <div className="py-16 text-center text-stone-400">No assets in this view.</div>
            : view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {shown.map((m) => (
                  <div key={m.id} onClick={() => setSelected(m)} className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer bg-white flex flex-col ${selected?.id === m.id ? "border-[#FF5A00] ring-2 ring-[#FF5A00]/20" : "border-[#E8E5E2] hover:border-stone-400"}`}>
                    <div className="aspect-[4/3] bg-stone-100 relative flex items-center justify-center overflow-hidden">
                      {thumb(m, "object-cover")}
                      <input type="checkbox" aria-label={`Select ${m.filename}`} checked={checked.includes(m.id)} onClick={(e) => e.stopPropagation()} onChange={(e) => setChecked(e.target.checked ? [...checked, m.id] : checked.filter((i) => i !== m.id))} className="absolute top-2 left-2" />
                      {m.usageCount > 0 && <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-blue-600/90 text-white text-[9px] font-bold">In use · {m.usageCount}</span>}
                    </div>
                    <div className="p-2.5"><p className="text-xs font-semibold truncate" title={m.filename}>{m.filename}</p><p className="text-[11px] text-stone-400 flex justify-between mt-1"><span>{m.fileSize}</span><span>{m.dimensions || m.type}</span></p></div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold border-b border-[#E8E5E2]"><tr><th className="py-2.5 px-3 w-8" /><th className="py-2.5 px-3">Filename</th><th className="py-2.5 px-3">Folder</th><th className="py-2.5 px-3">Size</th><th className="py-2.5 px-3">Used</th><th className="py-2.5 px-3 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-[#E8E5E2]">
                  {shown.map((m) => (
                    <tr key={m.id} onClick={() => setSelected(m)} className={`cursor-pointer ${selected?.id === m.id ? "bg-[#FFF9F4]" : "hover:bg-stone-50"}`}>
                      <td className="py-2 px-3"><input type="checkbox" aria-label={`Select ${m.filename}`} checked={checked.includes(m.id)} onClick={(e) => e.stopPropagation()} onChange={(e) => setChecked(e.target.checked ? [...checked, m.id] : checked.filter((i) => i !== m.id))} /></td>
                      <td className="py-2 px-3 font-semibold">{m.filename}</td><td className="py-2 px-3 text-stone-500 text-[11px]">{folderName(m.folder)}</td><td className="py-2 px-3 text-stone-500">{m.fileSize}</td>
                      <td className="py-2 px-3">{m.usageCount > 0 ? <span className="text-blue-700 font-bold">{m.usageCount}×</span> : <span className="text-stone-400">—</span>}</td>
                      <td className="py-2 px-3 text-right"><button aria-label={`Delete ${m.filename}`} onClick={(e) => { e.stopPropagation(); void remove(m); }} className="p-1 text-stone-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        {selected && (
          <aside className="w-80 bg-white rounded-xl border border-[#E8E5E2] p-5 shrink-0 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]"><h4 className="text-xs font-bold uppercase tracking-wider">Asset details</h4><button onClick={() => setSelected(null)} aria-label="Close details" className="text-stone-400 hover:text-stone-700"><X className="w-4 h-4" /></button></div>
            <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden relative border border-[#E8E5E2] flex items-center justify-center">{thumb(selected, "object-contain")}</div>
            <div className="flex gap-2 text-[11px] items-center"><code className="flex-1 truncate bg-stone-50 border border-[#E8E5E2] rounded px-2 py-1">{selected.url}</code><button onClick={() => { void navigator.clipboard?.writeText(selected.url); addToast({ title: "Copied", message: "URL copied." }); }} aria-label="Copy URL" className="p-1.5 border border-[#E8E5E2] rounded hover:bg-stone-50"><Copy className="w-3.5 h-3.5" /></button></div>

            <div className="p-3 bg-stone-50 rounded-xl border border-[#E8E5E2] space-y-2 text-xs">
              <span className="font-bold flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#FF5A00]" />WebP / AVIF</span>
              {canOptimize === false || optNote ? <p className="text-[11px] text-stone-600">{OPT_OFF}</p> : <p className="text-[11px] text-stone-500">Convert this image to a next-generation format.</p>}
              {canOptimize !== false && selected.type === "image" && (
                <button onClick={() => optimize(selected)} disabled={optBusy} className="w-full py-1.5 bg-[#FFF3E9] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white rounded-lg font-semibold flex items-center justify-center gap-1 disabled:opacity-60"><Sparkles className="w-3 h-3" />{optBusy ? "Working…" : "Optimize"}</button>
              )}
            </div>

            {selected.usageCount > 0
              ? <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900"><span className="font-bold block">In use</span>Referenced in {selected.usageCount} place{selected.usageCount === 1 ? "" : "s"}. Deleting needs confirmation and a permission that is recorded in the audit log.</div>
              : <div className="p-2 rounded-lg bg-stone-100 text-stone-500 text-[11px]">Not used anywhere. Safe to delete.</div>}

            <div className="space-y-2 text-xs">
              <label className="block"><span className="block text-[10px] font-bold uppercase text-stone-400">Folder</span>
                <select value={selected.folder ?? ""} onChange={(e) => void move([selected.id], e.target.value || null)} className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white"><option value="">Unfiled</option>{folders.map((f) => <option key={f.id} value={f.id}>{f.path ?? f.name}</option>)}</select></label>
              <label className="block"><span className="block text-[10px] font-bold uppercase text-stone-400">Alt text (SEO)</span><input value={selected.altText} onChange={(e) => setSelected({ ...selected, altText: e.target.value })} className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg" /></label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block"><span className="block text-[10px] font-bold uppercase text-stone-400">Title</span><input value={selected.title} onChange={(e) => setSelected({ ...selected, title: e.target.value })} className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg" /></label>
                <label className="block"><span className="block text-[10px] font-bold uppercase text-stone-400">Caption</span><input value={selected.caption} onChange={(e) => setSelected({ ...selected, caption: e.target.value })} className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg" /></label>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => saveMeta(selected)} className="flex-1 py-2 font-semibold bg-[#FF5A00] text-white rounded-lg">Save details</button>
                <label className="flex-1 py-2 font-semibold border border-[#E8E5E2] rounded-lg text-center cursor-pointer hover:bg-stone-50">Replace file<input type="file" className="hidden" accept={ACCEPT} onChange={(e) => void replace(selected, e)} /></label>
              </div>
              <button onClick={() => remove(selected)} className="w-full py-2 font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1.5"><Trash2 className="w-3.5 h-3.5" />Delete asset</button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
