"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, FileText, Image as ImageIcon, Layers, Plus, Search, Settings, Users, X, type LucideIcon } from "lucide-react";
import { adminClient, type SessionInfo } from "@/lib/admin-client";

interface Item { id: string; title: string; hint: string; url: string; icon: LucideIcon; group: string }

/** Navigation shortcuts. `perm` is advisory only (hides what the user could not open); the API enforces permissions regardless. */
const COMMANDS: Array<Item & { perm?: string }> = [
  { id: "c-page", title: "Create page from a template", hint: "Page Templates", url: "/admin/templates/pages", icon: Plus, group: "Actions", perm: "pages.create" },
  { id: "c-proj", title: "Create portfolio project", hint: "Portfolio Templates", url: "/admin/portfolio/templates", icon: Plus, group: "Actions", perm: "portfolio.edit" },
  { id: "c-media", title: "Open Media Library", hint: "Upload and organise assets", url: "/admin/media", icon: ImageIcon, group: "Go to", perm: "media.view" },
  { id: "c-leads", title: "Leads", hint: "Pipeline, assignment, follow-ups", url: "/admin/leads", icon: Users, group: "Go to", perm: "leads.view" },
  { id: "c-seo", title: "SEO Audit", hint: "Critical, warnings, recommendations", url: "/admin/seo", icon: Search, group: "Go to", perm: "seo.audit" },
  { id: "c-blocks", title: "Global Blocks", hint: "Reusable sections", url: "/admin/design/global-blocks", icon: Layers, group: "Go to", perm: "global_blocks.view" },
  { id: "c-pages", title: "Pages", hint: "All pages and the page builder", url: "/admin/pages", icon: FileText, group: "Go to", perm: "pages.view" },
  { id: "c-tasks", title: "Tasks", hint: "Assigned work", url: "/admin/tasks", icon: FileText, group: "Go to", perm: "tasks.view" },
  { id: "c-notif", title: "Notifications", hint: "Reviews, approvals, leads", url: "/admin/notifications", icon: FileText, group: "Go to", perm: "notifications.view" },
  { id: "c-theme", title: "Theme settings", hint: "Brand tokens", url: "/admin/design/theme", icon: Settings, group: "Go to", perm: "settings.view" },
];
const TYPE_ICON: Record<string, LucideIcon> = { page: FileText, portfolio: Briefcase, article: FileText, media: ImageIcon, lead: Users };
const GROUP_LABEL: Record<string, string> = { pages: "Pages", portfolio: "Portfolio", articles: "Articles", media: "Media", leads: "Leads" };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [found, setFound] = useState<Item[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState(0);
  const seq = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && !session) adminClient.getSession().then(setSession).catch(() => undefined);
  }, [open, session]);

  const allowed = (perm?: string) => !perm || !session || session.user.roles.includes("SUPER_ADMIN") || session.user.permissions.includes(perm);
  const canSearch = !session || session.user.roles.includes("SUPER_ADMIN") || session.user.permissions.includes("search.use");

  // Debounced real search. The server returns only the groups this user is permitted to see.
  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2 || !canSearch) { seq.current++; return; }
    const mine = ++seq.current;
    const t = setTimeout(() => {
      setSearching(true);
      adminClient.search(q).then((r) => {
        if (mine !== seq.current) return;
        setFound(Object.entries(r.results).flatMap(([group, hits]) => hits.map((h) => ({ id: `${h.type}-${h.id}`, title: h.title, hint: [h.subtitle, h.status].filter(Boolean).join(" · "), url: h.url, icon: TYPE_ICON[h.type] ?? FileText, group: GROUP_LABEL[group] ?? group }))));
        setError("");
      }).catch((e: unknown) => { if (mine === seq.current) { setFound([]); setError(e instanceof Error ? e.message : "Search failed"); } })
        .finally(() => { if (mine === seq.current) setSearching(false); });
    }, 200);
    return () => clearTimeout(t);
  }, [query, open, canSearch]);

  const commands = useMemo(() => COMMANDS.filter((c) => allowed(c.perm) && (!query.trim() || `${c.title} ${c.hint}`.toLowerCase().includes(query.trim().toLowerCase()))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, session]);
  const searchActive = query.trim().length >= 2 && canSearch;
  const items = [...(searchActive ? found : []), ...commands];

  if (!open) return null;
  const go = (url: string) => { setOpen(false); setQuery(""); setCursor(0); router.push(url); };
  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && items[cursor]) go(items[cursor].url);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-20" onClick={() => setOpen(false)} role="dialog" aria-label="Command palette">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E8E5E2] overflow-hidden flex flex-col max-h-[70vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-[#E8E5E2] flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input type="text" autoFocus placeholder="Search pages, portfolio, media, leads — or jump to a screen…" value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }} onKeyDown={onInputKey} className="flex-1 text-sm bg-transparent border-none outline-none text-[#0B0B0F]" />
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-stone-400 hover:text-stone-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {items.map((it, i) => {
            const Icon = it.icon;
            const showGroup = i === 0 || items[i - 1].group !== it.group;
            return (
              <React.Fragment key={it.id}>
                {showGroup && <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">{it.group}</div>}
                <div onClick={() => go(it.url)} onMouseEnter={() => setCursor(i)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs ${i === cursor ? "bg-[#FFF9F4] text-[#FF5A00]" : ""}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 shrink-0"><Icon className="w-3.5 h-3.5" /></div>
                    <div className="min-w-0"><span className="font-bold text-[#0B0B0F] block truncate">{it.title}</span>{it.hint && <span className="text-[10px] text-stone-400 block truncate">{it.hint}</span>}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#FF5A00] opacity-0 group-hover:opacity-100" />
                </div>
              </React.Fragment>
            );
          })}
          {searchActive && searching && <div className="p-3 text-center text-stone-400 text-xs">Searching…</div>}
          {searchActive && error && <div className="p-3 text-center text-red-600 text-xs">{error}</div>}
          {!(searchActive && searching) && !(searchActive && error) && items.length === 0 && <div className="p-8 text-center text-stone-400 text-xs">{query.trim().length < 2 ? "Type at least 2 characters to search." : `Nothing found for “${query}”.`}</div>}
        </div>
        <div className="p-3 bg-stone-50 border-t border-[#E8E5E2] flex items-center justify-between text-[11px] text-stone-400">
          <span>↑ ↓ to move · Enter to open · Esc to close</span><span>Only items you can access are shown</span>
        </div>
      </div>
    </div>
  );
}
