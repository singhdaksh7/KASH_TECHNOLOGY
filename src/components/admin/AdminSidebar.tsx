"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminClient, type SessionInfo } from "@/lib/admin-client";
import { ADMIN_NAVIGATION, filterNavigation, type NavItemConfig } from "@/lib/rbac/navigation";
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
  Bell,
  Activity,
  Database,
  Cable,
  Building2,
  Mail,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Briefcase,
  BookOpen,
  ImageIcon,
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
  Bell,
  Activity,
  Database,
  Cable,
  Building2,
  Mail,
};

export function AdminSidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    adminClient.getSession().then(setSession).catch(() => undefined);
  }, []);

  const can = (perm?: string) =>
    !perm ||
    !session ||
    session.user.roles.includes("SUPER_ADMIN") ||
    session.user.permissions.includes(perm);

  const name = session?.user.name || session?.user.email || "…";
  const initials =
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  const logout = async () => {
    await adminClient.logout().catch(() => undefined);
    router.push("/admin/login");
  };

  const visibleGroups = filterNavigation(ADMIN_NAVIGATION, can);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E5E2] flex flex-col
        transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-0 max-lg:-translate-x-full"}
      `}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-[#E8E5E2] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF5A00] flex items-center justify-center text-white font-extrabold text-sm tracking-wider">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-[#0B0B0F] tracking-tight">KASH</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF5A00] -mt-1">
              Admin Platform
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-stone-400 hover:text-stone-700 p-1"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <Link
            href="/admin"
            onClick={onClose}
            className={`
              flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors
              ${
                pathname === "/admin"
                  ? "bg-[#FFF3E9] text-[#FF5A00]"
                  : "text-[#4B5563] hover:bg-[#FFF9F4] hover:text-[#0B0B0F]"
              }
            `}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </Link>
        </div>

        {visibleGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              {group.title}
            </div>
            {group.items.map((item: NavItemConfig) => {
              const Icon = ICON_MAP[item.iconName] || FileText;
              const active = pathname === item.href || (item.href !== "/admin/settings" && pathname.startsWith(item.href + "/"));
              return (
                <div key={item.href} className="space-y-0.5">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${
                        active
                          ? "bg-[#FFF3E9] text-[#FF5A00] font-semibold"
                          : "text-[#4B5563] hover:bg-[#FFF9F4] hover:text-[#0B0B0F]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  {item.children?.map((sub) => {
                    const SubIcon = ICON_MAP[sub.iconName] || FileText;
                    const subActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-2 pl-9 pr-3 py-1 rounded-lg text-xs font-medium transition-colors
                          ${
                            subActive
                              ? "text-[#FF5A00] font-semibold"
                              : "text-stone-500 hover:text-stone-900"
                          }
                        `}
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-4 border-t border-[#E8E5E2] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#0B0B0F] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#0B0B0F] truncate">{name}</span>
            <span className="text-[10px] text-[#4B5563] truncate">
              {session?.user.roles.map((r) => r.replace(/_/g, " ")).join(", ") || "…"}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-stone-50"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
