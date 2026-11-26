"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { ToastProvider } from "@/components/admin/ToastContext";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("kash_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const pathname = usePathname();

  useEffect(() => {
    const toggle = () => setMobileSidebarOpen((o) => !o);
    window.addEventListener("kash:toggle-sidebar", toggle);
    return () => window.removeEventListener("kash:toggle-sidebar", toggle);
  }, []);

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kash_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // If on login / 2FA routes, render standalone view without sidebar
  const isAuthRoute =
    pathname === "/admin/login" ||
    pathname === "/admin/setup-2fa" ||
    pathname === "/admin/verify-2fa" ||
    pathname === "/admin/change-password";

  // Dedicated full-screen workspace routes (e.g. Page Builder) bypass the admin sidebar completely
  const isDedicatedWorkspace =
    /^\/admin\/pages\/[^/]+\/edit(\/|$)/.test(pathname || "");

  if (isAuthRoute || isDedicatedWorkspace) {
    return (
      <ToastProvider>
        <CommandPalette />
        <div className="h-screen w-screen overflow-hidden bg-[#FFF9F4] text-[#0B0B0F] flex flex-col font-sans">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <CommandPalette />
      <div className="min-h-screen bg-[#FFF9F4] text-[#0B0B0F] flex flex-col font-sans">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
            sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
        >
          <main className="flex-1 flex flex-col min-w-0">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
