"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminClient, type SessionInfo } from "@/lib/admin-client";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Image as ImageIcon, 
  Layers, 
  Compass, 
  PanelTop, 
  PanelBottom, 
  Palette, 
  Search, 
  CheckSquare, 
  Users, 
  CornerUpRight, 
  UserCheck, 
  ShieldAlert, 
  History, 
  Settings, 
  LogOut,
} from "lucide-react";

interface NavGroup {
  title: string;
  items: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    /** Advisory only: the API enforces permissions regardless. */
    perm?: string;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "CONTENT",
    items: [
      { label: "Pages", perm: "pages.view", href: "/admin/pages", icon: FileText },
      { label: "Page Templates", perm: "templates.view", href: "/admin/templates/pages", icon: Layers },
      { label: "Portfolio", perm: "portfolio.view", href: "/admin/portfolio", icon: Briefcase },
      { label: "Portfolio Templates", perm: "portfolio.view", href: "/admin/portfolio/templates", icon: Layers },
      { label: "Insights", perm: "articles.view", href: "/admin/insights", icon: BookOpen },
      { label: "Media Library", perm: "media.view", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "DESIGN & THEME",
    items: [
      { label: "Page Builder", perm: "pages.view", href: "/admin/pages", icon: Layers },
      { label: "Global Blocks", perm: "global_blocks.view", href: "/admin/design/global-blocks", icon: Layers },
      { label: "Navigation", perm: "settings.view", href: "/admin/design/navigation", icon: Compass },
      { label: "Header Editor", perm: "settings.view", href: "/admin/design/header", icon: PanelTop },
      { label: "Footer Editor", perm: "settings.view", href: "/admin/design/footer", icon: PanelBottom },
      { label: "Theme Settings", perm: "settings.view", href: "/admin/design/theme", icon: Palette },
    ],
  },
  {
    title: "MARKETING",
    items: [
      { label: "SEO Dashboard", perm: "seo.view", href: "/admin/seo", icon: Search },
      { label: "Forms", perm: "forms.view", href: "/admin/forms", icon: CheckSquare },
      { label: "Form Templates", perm: "forms.view", href: "/admin/forms/templates", icon: CheckSquare },
      { label: "Leads", perm: "leads.view", href: "/admin/leads", icon: Users },
      { label: "Redirects", perm: "seo.view", href: "/admin/redirects", icon: CornerUpRight },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Tasks", perm: "tasks.view", href: "/admin/tasks", icon: CheckSquare },
      { label: "Notifications", perm: "notifications.view", href: "/admin/notifications", icon: History },
      { label: "Email & Resend", perm: "email_settings.view", href: "/admin/settings/email", icon: Settings },
      { label: "Email Logs", perm: "email_logs.view", href: "/admin/settings/email/logs", icon: History },
      { label: "Email Templates", perm: "email_templates.view", href: "/admin/settings/email-templates", icon: FileText },
      { label: "Import / Export", perm: "import_export.use", href: "/admin/tools/import-export", icon: CornerUpRight },
      { label: "Team", perm: "users.view", href: "/admin/team", icon: UserCheck },
      { label: "Roles & Permissions", perm: "users.view", href: "/admin/roles", icon: ShieldAlert },
      { label: "Audit Log", perm: "audit.view", href: "/admin/audit-log", icon: History },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  useEffect(() => {
    adminClient.getSession().then(setSession).catch(() => undefined);
  }, []);
  const can = (perm?: string) => !perm || !session || session.user.roles.includes("SUPER_ADMIN") || session.user.permissions.includes(perm);
  const name = session?.user.name || session?.user.email || "…";
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
  const logout = async () => {
    await adminClient.logout().catch(() => undefined);
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0B0F] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5A00] to-[#FF8A3D] flex items-center justify-center font-extrabold text-white text-xs shadow-md">
              K
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                KASH CMS
              </span>
              <span className="text-[10px] text-[#FF5A00] font-mono font-semibold pt-0.5">
                Admin Console
              </span>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[10px] font-mono text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10"
          >
            Live Site &nearr;
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs font-medium">
          {/* Main Dashboard item */}
          <Link
            href="/admin"
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
              pathname === "/admin"
                ? "bg-[#FF5A00] text-white font-bold shadow-md shadow-[#FF5A00]/25"
                : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </Link>

          {/* Group sections */}
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold tracking-wider text-white/40 uppercase block mb-1">
                {group.title}
              </span>
              {group.items.filter((i) => can(i.perm)).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#FF5A00]/15 text-[#FF5A00] font-bold border border-[#FF5A00]/30"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#FF5A00] text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Current User & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#08080B] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FF5A00] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-bold text-white truncate">{name}</div>
              <div className="text-[10px] text-white/50 truncate">{session?.user.roles.map((r) => r.replace(/_/g, " ").toLowerCase()).join(", ")}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            className="p-1.5 text-white/50 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
