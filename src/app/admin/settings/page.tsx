"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Palette, 
  Mail, 
  FileText, 
  Users, 
  ShieldAlert, 
  Cable, 
  Activity, 
  Database, 
  CornerUpRight, 
  History, 
  Search, 
  ChevronRight,
  Shield,
} from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";

interface SettingsCategory {
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    title: "GENERAL",
    description: "Core organization identity, brand, and website defaults.",
    items: [
      {
        title: "Business Profile",
        description: "Organization name, contacts, logos, social links, and SEO identity.",
        href: "/admin/settings/business",
        icon: Building2,
      },
      {
        title: "Appearance & Theme",
        description: "Brand colors, dark/light theme defaults, typography, and styling.",
        href: "/admin/design/theme",
        icon: Palette,
      },
    ],
  },
  {
    title: "COMMUNICATION",
    description: "Outbound transactional email delivery, templates, and delivery status.",
    items: [
      {
        title: "Email & Resend",
        description: "Provider credentials, sender addresses, test email, and delivery settings.",
        href: "/admin/settings/email",
        icon: Mail,
      },
      {
        title: "Email Templates",
        description: "Branded email content for lead confirmations and internal notifications.",
        href: "/admin/settings/email-templates",
        icon: FileText,
      },
      {
        title: "Delivery Logs",
        description: "Detailed record of all sent, failed, or skipped transactional emails.",
        href: "/admin/settings/email/logs",
        icon: History,
      },
    ],
  },
  {
    title: "TEAM & ACCESS",
    description: "Manage users, custom roles, and security authentication protocols.",
    items: [
      {
        title: "Team Members",
        description: "Invite, manage, activate, or deactivate administrators and editors.",
        href: "/admin/team",
        icon: Users,
      },
      {
        title: "Roles & Permissions",
        description: "Fine-grained permission matrices and access control management.",
        href: "/admin/roles",
        icon: ShieldAlert,
      },
      {
        title: "Security & 2FA",
        description: "Founder credentials, two-factor authentication, and password policies.",
        href: "/admin/setup-2fa",
        icon: Shield,
      },
    ],
  },
  {
    title: "INTEGRATIONS",
    description: "Third-party services, analytics, spam protection, and media storage.",
    items: [
      {
        title: "Connected Services",
        description: "Resend, Google Analytics 4, Search Console, Turnstile, and Cloud storage.",
        href: "/admin/integrations",
        icon: Cable,
      },
    ],
  },
  {
    title: "SYSTEM & OPERATIONS",
    description: "Operational telemetry, automated backups, tools, and audit security records.",
    items: [
      {
        title: "System Health",
        description: "Real-time status of PostgreSQL, outbound email, and content schedulers.",
        href: "/admin/system/health",
        icon: Activity,
      },
      {
        title: "Database Backups",
        description: "Nightly automated dump snapshots, retention policies, and storage verification.",
        href: "/admin/system/backups",
        icon: Database,
      },
      {
        title: "Import / Export",
        description: "Export and import database snapshots, pages, and media metadata.",
        href: "/admin/tools/import-export",
        icon: CornerUpRight,
      },
      {
        title: "Audit Log",
        description: "Cryptographically safe audit trail of administrative changes and logins.",
        href: "/admin/audit-log",
        icon: History,
      },
    ],
  },
];

export default function SettingsHubPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = SETTINGS_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (it) =>
        it.title.toLowerCase().includes(search.toLowerCase()) ||
        it.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <AdminPage maxWidth="default">
      <PageHeader
        title="Settings"
        description="Manage your business identity, communications, integrations, security, and system configuration."
      />

      {/* Settings Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search settings (e.g., email, backups, analytics, roles)..."
          className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00] shadow-2xs"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Groups */}
      <div className="space-y-8 pt-2">
        {filteredCategories.map((cat) => (
          <div key={cat.title} className="space-y-3">
            <div>
              <h2 className="text-xs font-semibold text-stone-400 tracking-wider uppercase font-mono">
                {cat.title}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-white rounded-xl border border-stone-200/80 p-4 hover:border-stone-300 hover:shadow-xs transition-all flex items-start gap-3.5 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-600 group-hover:text-[#FF5A00] group-hover:bg-[#FF5A00]/10 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-stone-900 group-hover:text-[#FF5A00] transition-colors">
                          {item.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200/80 p-6">
            <p className="text-sm font-medium text-stone-800">No settings found</p>
            <p className="text-xs text-stone-500 mt-1">
              No matching settings found for &quot;{search}&quot;. Try a different query.
            </p>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
