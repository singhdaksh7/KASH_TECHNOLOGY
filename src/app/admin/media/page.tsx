/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MediaItem, MediaFolder } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Upload,
  Search,
  Grid,
  List as ListIcon,
  Trash2,
  Copy,
  ExternalLink,
  ImageIcon,
  X,
  Folder,
  FolderPlus,
  Sparkles,
  Zap,
  Check,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function MediaLibraryPhase2() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([adminClient.getMedia(), adminClient.getMediaFolders()]).then(([m, f]) => {
      setMediaList(m);
      setFolders(f);
      if (m.length > 0) setSelectedItem(m[0]);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newMedia = await adminClient.uploadMedia({
      filename: file.name,
      url: `/images/hero/${file.name}`,
      type: file.type.startsWith("image/") ? "image" : "pdf",
      altText: file.name.replace(/\.[^/.]+$/, ""),
      title: file.name,
      caption: "",
      fileSize: `${Math.round(file.size / 1024)} KB`,
    });
    setMediaList((prev) => [newMedia, ...prev]);
    setSelectedItem(newMedia);
    addToast({ title: "Media uploaded", message: `"${file.name}" saved to library.`, type: "success" });
  };

  const handleDelete = async (id: string, filename: string, usageCount: number) => {
    if (usageCount > 0) {
      if (!confirm(`Warning: "${filename}" is currently in use across ${usageCount} sections. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete asset "${filename}"?`)) return;
    }

    await adminClient.deleteMedia(id);
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    setBulkSelected((prev) => prev.filter((i) => i !== id));
    addToast({ title: "Asset deleted", message: `"${filename}" removed.`, type: "info" });
  };

  const handleOptimize = async (id: string) => {
    setOptimizing(true);
    const updated = await adminClient.optimizeMediaItem(id);
    if (updated) {
      setMediaList((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setSelectedItem(updated);
      addToast({
        title: "Image Optimized",
        message: `Generated WebP and AVIF. Saved ${updated.optimization?.savingsPercent}% in asset weight.`,
        type: "success",
      });
    }
    setOptimizing(false);
  };

  const handleMoveBulk = async (folderSlug: string) => {
    if (bulkSelected.length === 0) return;
    await adminClient.moveMediaToFolder(bulkSelected, folderSlug);
    setMediaList((prev) =>
      prev.map((m) => (bulkSelected.includes(m.id) ? { ...m, folder: folderSlug } : m))
    );
    addToast({ title: "Assets Moved", message: `Moved ${bulkSelected.length} assets to ${folderSlug}.` });
    setBulkSelected([]);
  };

  const handleBulkDelete = async () => {
    if (bulkSelected.length === 0) return;
    if (confirm(`Are you sure you want to delete ${bulkSelected.length} selected assets?`)) {
      for (const id of bulkSelected) {
        await adminClient.deleteMedia(id);
      }
      setMediaList((prev) => prev.filter((m) => !bulkSelected.includes(m.id)));
      setBulkSelected([]);
      addToast({ title: "Bulk Delete Complete", message: "Selected assets removed." });
    }
  };

  const filtered = mediaList.filter((m) => {
    const matchSearch =
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase());
    const matchFolder = activeFolder === "all" || m.folder === activeFolder;
    return matchSearch && matchFolder;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Media Library & Asset Optimizer"
        subtitle="Manage brand logos, case study screenshots, folder taxonomy, and next-gen WebP/AVIF compressions"
        breadcrumbs={[{ label: "Content" }, { label: "Media Library" }]}
        actions={
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Asset</span>
            <input type="file" onChange={handleUpload} className="hidden" accept="image/*,application/pdf" />
          </label>
        }
      />

      {/* FOLDERS ROW */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.slug)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFolder === f.slug
                ? "bg-[#FF5A00] text-white border-[#FF5A00] shadow-xs"
                : "bg-white text-stone-700 border-[#E8E5E2] hover:bg-stone-50"
            }`}
          >
            <Folder className={`w-3.5 h-3.5 ${activeFolder === f.slug ? "text-white" : "text-[#FF5A00]"}`} />
            <span>{f.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeFolder === f.slug ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search media by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        {bulkSelected.length > 0 && (
          <div className="flex items-center gap-2 bg-[#FFF3E9] p-1.5 px-3 rounded-lg border border-[#FF5A00]/30 text-xs">
            <span className="font-bold text-[#FF5A00]">{bulkSelected.length} selected</span>
            <select
              onChange={(e) => handleMoveBulk(e.target.value)}
              className="px-2 py-1 bg-white border border-[#E8E5E2] rounded text-xs"
              defaultValue=""
            >
              <option value="" disabled>Move to Folder...</option>
              {folders.filter((f) => f.slug !== "all").map((f) => (
                <option key={f.id} value={f.slug}>{f.name}</option>
              ))}
            </select>
            <button
              onClick={handleBulkDelete}
              className="text-red-600 font-semibold hover:underline px-1 text-xs"
            >
              Delete
            </button>
          </div>
        )}

        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-[#E8E5E2]">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md ${
              viewMode === "grid" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563]"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md ${
              viewMode === "list" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563]"
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ASSET CONTAINER WITH SIDE INSPECTOR */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs">
          {loading ? (
            <div className="py-16 text-center text-stone-400">Loading assets...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-stone-400">No assets in this view.</div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isChecked = bulkSelected.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all bg-white flex flex-col ${
                      isSelected
                        ? "border-[#FF5A00] ring-2 ring-[#FF5A00]/20 shadow-md"
                        : "border-[#E8E5E2] hover:border-stone-400"
                    }`}
                  >
                    <div className="aspect-[4/3] bg-stone-100 relative flex items-center justify-center overflow-hidden">
                      {item.url.startsWith("/") ? (
                        <Image
                          src={item.url}
                          alt={item.altText}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-stone-400" />
                      )}

                      {/* Bulk checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelected([...bulkSelected, item.id]);
                          } else {
                            setBulkSelected(bulkSelected.filter((i) => i !== item.id));
                          }
                        }}
                        className="absolute top-2 left-2 rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                      />

                      {item.optimization && (
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-bold">
                          WebP/AVIF
                        </span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-[#0B0B0F] truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <p className="text-[11px] text-stone-400 flex justify-between mt-1">
                        <span>{item.fileSize}</span>
                        <span>{item.dimensions || "Vector"}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold border-b border-[#E8E5E2]">
                <tr>
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Folder</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Optimization</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5E2]">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer ${
                      selectedItem?.id === item.id ? "bg-[#FFF9F4]" : "hover:bg-stone-50"
                    }`}
                  >
                    <td className="py-2 px-3">
                      <div className="w-10 h-8 rounded relative overflow-hidden bg-stone-100 border border-[#E8E5E2]">
                        {item.url.startsWith("/") ? (
                          <Image src={item.url} alt={item.altText} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-stone-400 m-auto" />
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#0B0B0F]">{item.filename}</td>
                    <td className="py-2 px-3 text-stone-500 font-mono text-[11px]">{item.folder || "Unsorted"}</td>
                    <td className="py-2 px-3 text-stone-500">{item.fileSize}</td>
                    <td className="py-2 px-3">
                      {item.optimization ? (
                        <span className="text-emerald-600 font-bold text-[10px]">-{item.optimization.savingsPercent}% WebP</span>
                      ) : (
                        <span className="text-stone-400 text-[10px]">Original</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, item.filename, item.usageCount);
                        }}
                        className="p-1 text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ASSET DETAIL DRAWER WITH IMAGE OPTIMIZER UI */}
        {selectedItem && (
          <aside className="w-80 bg-white rounded-xl border border-[#E8E5E2] p-5 shrink-0 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]">
              <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Asset Details</h4>
              <button onClick={() => setSelectedItem(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden relative border border-[#E8E5E2]">
              {selectedItem.url.startsWith("/") ? (
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.altText}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* NEXT-GEN OPTIMIZATION SECTION */}
            <div className="p-3 bg-stone-50 rounded-xl border border-[#E8E5E2] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B0B0F] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Compression & WebP</span>
                </span>
                {selectedItem.optimization && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Optimized
                  </span>
                )}
              </div>

              {selectedItem.optimization ? (
                <div className="text-[11px] space-y-1 text-stone-600">
                  <div className="flex justify-between">
                    <span>Original Size:</span>
                    <span className="font-mono">{selectedItem.optimization.originalSize}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>WebP Size:</span>
                    <span className="font-mono">{selectedItem.optimization.optimizedSize}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 pt-1">
                    Delivered automatically to modern browsers supporting WebP & AVIF.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[11px] text-stone-500 mb-2">
                    Compress original PNG/JPG into next-gen WebP/AVIF formats.
                  </p>
                  <button
                    onClick={() => handleOptimize(selectedItem.id)}
                    disabled={optimizing}
                    className="w-full py-1.5 bg-[#FFF3E9] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{optimizing ? "Compressing..." : "Optimize Asset Now"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* USAGE WARNING */}
            {selectedItem.usageCount > 0 ? (
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold block">Asset Protected</span>
                Currently placed on <strong>{selectedItem.usageCount} sections</strong> across live pages. Deleting will affect live display.
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-stone-100 text-stone-500 text-[11px]">
                Not currently placed on any live page. Safe to delete.
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-400">Alt Text (SEO)</label>
                <input
                  type="text"
                  value={selectedItem.altText}
                  onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleDelete(selectedItem.id, selectedItem.filename, selectedItem.usageCount)}
                  className="w-full py-2 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
