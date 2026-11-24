/* eslint-disable */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Bell, Search, Plus, ExternalLink } from "lucide-react";

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
  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F4]/90 backdrop-blur-md border-b border-[#E8E5E2] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
            className="p-1.5 rounded-lg border border-[#E8E5E2] bg-white text-[#0B0B0F] hover:border-[#FF5A00] lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#4B5563] mb-0.5">
              {breadcrumbs.map((b, i) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-[#FF5A00]">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-[#0B0B0F] font-semibold">{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>
          )}
          {title && (
            <h1 className="text-base sm:text-lg font-extrabold text-[#0B0B0F] tracking-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[11px] text-[#4B5563] truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions, Global Search & Shortcuts */}
      <div className="flex items-center gap-2.5 shrink-0">
        {actions}

        {/* Global Quick Search / Command Palette shortcut trigger */}
        <button
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
          }}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E8E5E2] bg-white text-xs text-stone-500 hover:border-[#FF5A00] hover:text-[#0B0B0F] transition-colors"
          title="Command Palette (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[11px]">Search...</span>
          <kbd className="px-1.5 py-0.2 rounded bg-stone-100 text-[10px] font-mono text-stone-400 border">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon Button */}
        <Link
          href="/admin/notifications"
          className="relative p-2 rounded-lg border border-[#E8E5E2] bg-white text-stone-600 hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A00]" />
        </Link>

        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E5E2] bg-white text-xs font-semibold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
        >
          <span>Preview Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#4B5563]" />
        </Link>
      </div>
    </header>
  );
}
