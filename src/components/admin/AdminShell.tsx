"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { ToastProvider } from "@/components/admin/ToastContext";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const toggle = () => setSidebarOpen((o) => !o);
    window.addEventListener("kash:toggle-sidebar", toggle);
    return () => window.removeEventListener("kash:toggle-sidebar", toggle);
  }, []);

  // If on login / 2FA routes, render standalone view without sidebar
  const isAuthRoute =
    pathname === "/admin/login" ||
    pathname === "/admin/setup-2fa" ||
    pathname === "/admin/verify-2fa";

  if (isAuthRoute) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <CommandPalette />
      <div className="min-h-screen bg-[#FFF9F4] text-[#0B0B0F] flex flex-col font-sans">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
          <main className="flex-1 flex flex-col min-w-0">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
