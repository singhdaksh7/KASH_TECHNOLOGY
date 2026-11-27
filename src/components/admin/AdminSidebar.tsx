"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { adminClient, type SessionInfo } from "@/lib/admin-client";
import { ADMIN_NAVIGATION, filterNavigation } from "@/lib/rbac/navigation";
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
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Shield,
  KeyRound,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
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

export function AdminSidebar({
  mobileOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("kash_admin_nav_groups");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adminClient.getSession().then(setSession).catch(() => undefined);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [title]: !prev[title] };
      try {
        localStorage.setItem("kash_admin_nav_groups", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const can = (perm?: string) =>
    !perm ||
    !session ||
    session.user.roles.includes("SUPER_ADMIN") ||
    session.user.permissions.includes(perm);

  const groups = filterNavigation(ADMIN_NAVIGATION, can);

  const handleLogout = async () => {
    try {
      await adminClient.logout();
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const name = session?.user.name || session?.user.email || "Administrator";
  const initials =
    name
      .split(/[\s@._]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "AD";

  const isSuperAdmin = session?.user.roles.includes("SUPER_ADMIN");

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-stone-200/80 flex flex-col transition-all duration-200 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand / Workspace Header */}
        <div className="h-14 border-b border-stone-100 flex items-center justify-between px-3 shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 min-w-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-center p-1 shrink-0 overflow-hidden group-hover:border-[#FF5A00] transition-colors relative">
              <Image
                src="/images/logo/kash-emblem-transparent.png"
                alt="KASH"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-semibold text-sm text-[#0B0B0F] tracking-tight block truncate">
                  KASH Technology
                </span>
                <span className="text-[10px] text-stone-400 block -mt-0.5 tracking-wider font-mono uppercase">
                  CMS Admin
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && !mobileOpen && (
            <button
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors hidden lg:block ${
                collapsed ? "mx-auto" : ""
              }`}
            >
              {collapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((group) => {
            const isGroupActive = group.items.some((it) =>
              it.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(it.href)
            );
            // If current route is in this group, do not collapse it
            const isCollapsed = !isGroupActive && !!collapsedGroups[group.title];

            return (
              <div key={group.title} className="space-y-1">
                {/* Group Title (hidden if collapsed or no title) */}
                {!collapsed && group.title !== "HOME" && group.title !== "SETTINGS" && (
                  <div
                    onClick={() => group.collapsible && toggleGroup(group.title)}
                    className={`flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider select-none ${
                      group.collapsible ? "cursor-pointer hover:text-stone-600" : ""
                    }`}
                  >
                    <span>{group.title}</span>
                    {group.collapsible && (
                      <span className="text-stone-400">
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                )}

                {/* Items */}
                {(!isCollapsed || collapsed) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = ICON_MAP[item.iconName] || FileText;
                      const active =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onClose && onClose()}
                          title={collapsed ? item.label : undefined}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors relative group ${
                            active
                              ? "bg-[#FF5A00]/10 text-[#FF5A00] font-semibold"
                              : "text-stone-600 hover:text-[#0B0B0F] hover:bg-stone-50"
                          } ${collapsed ? "justify-center px-0" : ""}`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              active
                                ? "text-[#FF5A00]"
                                : "text-stone-400 group-hover:text-stone-700"
                            }`}
                          />
                          {!collapsed && (
                            <span className="truncate flex-1">{item.label}</span>
                          )}
                          {!collapsed && item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Account / Profile Footer */}
        <div className="p-3 border-t border-stone-100 relative" ref={userMenuRef}>
          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl border border-stone-200 shadow-xl overflow-hidden py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3.5 py-2.5 border-b border-stone-100">
                <p className="text-xs font-semibold text-[#0B0B0F] truncate">{name}</p>
                <p className="text-[11px] text-stone-500 truncate">{session?.user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 font-medium">
                  {isSuperAdmin ? "SUPER ADMIN" : session?.user.roles[0] || "ADMIN"}
                </span>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  <span>Account &amp; Settings</span>
                </Link>

                <Link
                  href="/admin/change-password"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-stone-400" />
                  <span>Change Password</span>
                </Link>

                <Link
                  href="/admin/setup-2fa"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span>Two-Factor Security</span>
                </Link>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors border-t border-stone-100 mt-1 pt-1"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    <span>View Public Website</span>
                  </span>
                </a>
              </div>

              <div className="border-t border-stone-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* User Button */}
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-stone-50 text-left transition-colors cursor-pointer ${
              collapsed ? "justify-center p-1" : ""
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 text-[#0B0B0F] flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="truncate flex-1 min-w-0">
                <p className="text-xs font-medium text-[#0B0B0F] truncate">{name}</p>
                <p className="text-[10px] text-stone-400 truncate">
                  {isSuperAdmin ? "Super Admin" : "Team Member"}
                </p>
              </div>
            )}
            {!collapsed && (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
