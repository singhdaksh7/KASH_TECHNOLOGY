"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MediaItem } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { X, Search, Upload, Check, ImageIcon } from "lucide-react";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  selectedUrl?: string;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedUrl,
  title = "Select Media Asset",
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      adminClient.getMedia().then((items) => {
        setMediaList(items);
        if (selectedUrl) {
          const found = items.find((m) => m.url === selectedUrl);
          if (found) setActiveMedia(found);
        }
      });
    }
  }, [isOpen, selectedUrl]);

  if (!isOpen) return null;

  const filtered = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploaded = await adminClient.uploadMedia({
      filename: file.name,
      url: `/images/hero/${file.name}`,
      type: file.type.startsWith("image/") ? "image" : "pdf",
      altText: file.name.replace(/\.[^/.]+$/, ""),
      title: file.name,
      caption: "",
      fileSize: `${Math.round(file.size / 1024)} KB`,
    });
    setMediaList((prev) => [uploaded, ...prev]);
    setActiveMedia(uploaded);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-[#E8E5E2]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E5E2] flex items-center justify-between bg-[#FFF9F4]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A00]/10 flex items-center justify-center text-[#FF5A00]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0B0B0F]">{title}</h3>
              <p className="text-xs text-[#4B5563]">Choose from uploaded media or upload a new asset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-[#E8E5E2] flex items-center justify-between gap-4 bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search images by name or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <label className="flex items-center gap-2 px-3.5 py-2 bg-[#FFF3E9] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload New</span>
            <input type="file" onChange={handleUpload} className="hidden" accept="image/*,application/pdf" />
          </label>
        </div>

        {/* Media Grid & Preview */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-stone-50/50">
          {filtered.map((item) => {
            const isSelected = activeMedia?.id === item.id || (!activeMedia && selectedUrl === item.url);
            return (
              <div
                key={item.id}
                onClick={() => setActiveMedia(item)}
                className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-white flex flex-col ${
                  isSelected
                    ? "border-[#FF5A00] ring-2 ring-[#FF5A00]/20 shadow-md"
                    : "border-[#E8E5E2] hover:border-stone-400"
                }`}
              >
                <div className="aspect-video relative bg-stone-100 flex items-center justify-center overflow-hidden">
                  {item.url.startsWith("/") ? (
                    <Image
                      src={item.url}
                      alt={item.altText || item.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-stone-300" />
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF5A00] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-[#0B0B0F] truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[11px] text-stone-400 flex justify-between mt-1">
                    <span>{item.fileSize}</span>
                    <span>{item.dimensions || "Vector/PNG"}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E8E5E2] flex items-center justify-between bg-white">
          <div className="text-xs text-[#4B5563] truncate max-w-sm">
            {activeMedia ? (
              <span>Selected: <strong className="text-[#0B0B0F]">{activeMedia.filename}</strong> ({activeMedia.url})</span>
            ) : (
              <span>No asset selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E5E2] text-xs font-semibold rounded-lg text-[#4B5563] hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!activeMedia}
              onClick={() => {
                if (activeMedia) {
                  onSelect(activeMedia);
                  onClose();
                }
              }}
              className="px-5 py-2 bg-[#FF5A00] disabled:opacity-50 text-white text-xs font-semibold rounded-lg hover:bg-[#e04f00] shadow-sm transition-colors"
            >
              Use Selected Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
