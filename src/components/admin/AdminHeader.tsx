"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ExternalLink, Menu, Search } from "lucide-react";
import { adminClient } from "@/lib/admin-client";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export function AdminHeader({
  onToggleSidebar,
  title,
  subtitle,
  breadcrumbs,
  actions,
}: AdminHeaderProps) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () =>
      adminClient
        .getUnreadNotificationCount()
        .then((n) => alive && setUnread(n))
        .catch(() => undefined);
    load();
    const t = setInterval(load, 60_000);
    window.addEventListener("kash:notifications-changed", load);
    return () => {
      alive = false;
      clearInterval(t);
      window.removeEventListener("kash:notifications-changed", load);
    };
  }, []);

  const toggle =
    onToggleSidebar ??
    (() => window.dispatchEvent(new Event("kash:toggle-sidebar")));

  const openSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F4]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggle}
          aria-label="Toggle Navigation"
          className="p-1.5 rounded-lg border border-stone-200 bg-white text-[#0B0B0F] hover:border-stone-400 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-0.5">
              {breadcrumbs.map((b, i) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  {b.href ? (
                    <Link
                      href={b.href}
                      className="hover:text-stone-900 transition-colors"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-stone-700 font-medium">{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span className="text-stone-300">/</span>}
                </span>
              ))}
            </div>
          )}
          {title && (
            <h1 className="text-base sm:text-lg font-semibold text-[#0B0B0F] tracking-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-stone-500 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions, Global Search & Quick Links */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {actions}

        {/* Global Quick Search Button */}
        <button
          onClick={openSearch}
          aria-label="Search or run command"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200/80 text-stone-500 hover:text-stone-900 hover:border-stone-300 transition-all text-xs cursor-pointer shadow-2xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-stone-400">Search…</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-stone-400 font-mono bg-stone-100 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon Link */}
        <Link
          href="/admin/notifications"
          aria-label="Notifications"
          className="relative p-2 rounded-lg bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors shadow-2xs"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#FF5A00] text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>

        {/* View Public Website */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          title="View public website"
          className="p-2 rounded-lg bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors shadow-2xs hidden sm:flex items-center"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
