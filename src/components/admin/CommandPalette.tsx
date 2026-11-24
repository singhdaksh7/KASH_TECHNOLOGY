/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  FileText,
  Briefcase,
  Users,
  Settings,
  Image as ImageIcon,
  HelpCircle,
  X,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Content";
  url: string;
  icon: any;
  shortcut?: string;
}

const COMMANDS: CommandItem[] = [
  { id: "c1", title: "Create New Page", category: "Actions", url: "/admin/templates/pages", icon: Plus, shortcut: "P" },
  { id: "c2", title: "Create Portfolio Project", category: "Actions", url: "/admin/portfolio/new", icon: Plus, shortcut: "C" },
  { id: "c3", title: "Upload Media Asset", category: "Actions", url: "/admin/media", icon: ImageIcon, shortcut: "U" },
  { id: "c4", title: "View Inbound Leads & Deals", category: "Navigation", url: "/admin/leads", icon: Users, shortcut: "L" },
  { id: "c5", title: "Open Advanced SEO Dashboard", category: "Navigation", url: "/admin/seo", icon: Search, shortcut: "S" },
  { id: "c6", title: "Global Reusable Blocks", category: "Navigation", url: "/admin/design/global-blocks", icon: Layers },
  { id: "c7", title: "Page Templates Library", category: "Navigation", url: "/admin/templates/pages", icon: FileText },
  { id: "c8", title: "Admin Tasks & Action Items", category: "Navigation", url: "/admin/tasks", icon: CheckCircleIcon },
  { id: "c9", title: "System & Brand Tokens", category: "Navigation", url: "/admin/design/theme", icon: Settings },
  { id: "c10", title: "Notification Center", category: "Navigation", url: "/admin/notifications", icon: HelpCircle },
];

function CheckCircleIcon(props: any) {
  return <Layers {...props} />;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  const filtered = COMMANDS.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E8E5E2] overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in-0 zoom-in-95">
        {/* INPUT */}
        <div className="p-4 border-b border-[#E8E5E2] flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search pages, leads, settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none text-[#0B0B0F]"
          />
          <kbd className="px-2 py-0.5 rounded bg-stone-100 text-stone-500 text-[10px] font-mono border border-stone-200">
            ESC
          </kbd>
        </div>

        {/* RESULTS */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <div
                key={cmd.id}
                onClick={() => handleSelect(cmd.url)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF9F4] hover:text-[#FF5A00] cursor-pointer group transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-[#FFF3E9] flex items-center justify-center text-stone-500 group-hover:text-[#FF5A00]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B0B0F] group-hover:text-[#FF5A00]">
                      {cmd.title}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {cmd.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-400 text-[9px] font-mono border">
                      {cmd.shortcut}
                    </kbd>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#FF5A00]" />
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-stone-400 text-xs">
              No admin actions matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-stone-50 border-t border-[#E8E5E2] flex items-center justify-between text-[11px] text-stone-400">
          <span>Navigate with mouse or arrow keys</span>
          <span className="font-mono">KASH CMS Command Palette</span>
        </div>
      </div>
    </div>
  );
}
