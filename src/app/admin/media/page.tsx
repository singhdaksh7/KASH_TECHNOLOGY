/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MediaItem } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Upload,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Trash2,
  Copy,
  ExternalLink,
  Info,
  Check,
  ImageIcon,
  FileText,
  X,
} from "lucide-react";

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getMedia().then((data) => {
      setMediaList(data);
      if (data.length > 0) setSelectedItem(data[0]);
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

  const handleDelete = async (id: string, filename: string) => {
    if (confirm(`Are you sure you want to delete asset "${filename}"?`)) {
      await adminClient.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      addToast({ title: "Asset deleted", message: `"${filename}" removed.`, type: "info" });
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({ title: "URL Copied", message: `Copied ${url} to clipboard.` });
  };

  const filtered = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Media Library"
        subtitle="Manage brand logos, portfolio mocks, screenshots, and visual assets"
        breadcrumbs={[{ label: "Content" }, { label: "Media Library" }]}
        actions={
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Asset</span>
            <input type="file" onChange={handleUpload} className="hidden" accept="image/*,application/pdf" />
          </label>
        }
      />

      {/* TOOLBAR */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
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

        <div className="flex items-center gap-2">
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
      </div>

      {/* MAIN CONTAINER WITH SIDE DRAWER */}
      <div className="flex gap-6 items-start">
        {/* ASSET GRID / LIST */}
        <div className="flex-1 bg-white rounded-xl border border-[#E8E5E2] p-6 shadow-xs">
          {loading ? (
            <div className="py-16 text-center text-stone-400">Loading assets...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-stone-400">No assets match your search.</div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
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
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Uploaded</th>
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
                    <td className="py-2 px-3 uppercase text-[10px] text-stone-500 font-mono">{item.type}</td>
                    <td className="py-2 px-3 text-stone-500">{item.fileSize}</td>
                    <td className="py-2 px-3 text-stone-500">{item.uploadedAt}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, item.filename);
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

        {/* DETAILS DRAWER */}
        {selectedItem && (
          <aside className="w-80 bg-white rounded-xl border border-[#E8E5E2] p-5 shrink-0 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]">
              <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Asset Details</h4>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-700"
              >
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

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-0.5">Filename</label>
                <p className="font-semibold text-[#0B0B0F] break-all">{selectedItem.filename}</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-0.5">URL Path</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="flex-1 px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[10px] bg-stone-50"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedItem.url)}
                    className="p-1.5 border border-[#E8E5E2] rounded-lg hover:bg-stone-50 text-stone-600"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-stone-400">Dimensions:</span>
                  <p className="font-semibold text-[#0B0B0F]">{selectedItem.dimensions || "N/A"}</p>
                </div>
                <div>
                  <span className="text-stone-400">File Size:</span>
                  <p className="font-semibold text-[#0B0B0F]">{selectedItem.fileSize}</p>
                </div>
                <div>
                  <span className="text-stone-400">Uploaded:</span>
                  <p className="font-semibold text-[#0B0B0F]">{selectedItem.uploadedAt}</p>
                </div>
                <div>
                  <span className="text-stone-400">Used On:</span>
                  <p className="font-semibold text-[#0B0B0F]">{selectedItem.usageCount} sections</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E5E2]">
                <label className="block text-xs font-semibold text-[#0B0B0F] mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  value={selectedItem.altText}
                  onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => handleDelete(selectedItem.id, selectedItem.filename)}
                  className="flex-1 py-2 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
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
