export interface NavItemConfig {
  label: string;
  href: string;
  iconName: string;
  permission?: string;
  badge?: string;
  children?: NavItemConfig[];
}

export interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export const ADMIN_NAVIGATION: NavGroupConfig[] = [
  {
    title: "CONTENT",
    items: [
      { label: "Pages", permission: "pages.view", href: "/admin/pages", iconName: "FileText" },
      { label: "Page Templates", permission: "templates.view", href: "/admin/templates/pages", iconName: "Layers" },
      { label: "Portfolio", permission: "portfolio.view", href: "/admin/portfolio", iconName: "Briefcase" },
      { label: "Portfolio Templates", permission: "portfolio.view", href: "/admin/portfolio/templates", iconName: "Layers" },
      { label: "Insights", permission: "articles.view", href: "/admin/insights", iconName: "BookOpen" },
      { label: "Media Library", permission: "media.view", href: "/admin/media", iconName: "ImageIcon" },
    ],
  },
  {
    title: "DESIGN & THEME",
    items: [
      { label: "Navigation Editor", permission: "settings.view", href: "/admin/design/navigation", iconName: "Compass" },
      { label: "Header Editor", permission: "settings.view", href: "/admin/design/header", iconName: "PanelTop" },
      { label: "Footer Editor", permission: "settings.view", href: "/admin/design/footer", iconName: "PanelBottom" },
      { label: "Global Blocks", permission: "global_blocks.view", href: "/admin/design/global-blocks", iconName: "Layers" },
      { label: "Theme Settings", permission: "settings.view", href: "/admin/design/theme", iconName: "Palette" },
    ],
  },
  {
    title: "MARKETING",
    items: [
      { label: "SEO Dashboard", permission: "seo.view", href: "/admin/seo", iconName: "Search" },
      { label: "Forms", permission: "forms.view", href: "/admin/forms", iconName: "CheckSquare" },
      { label: "Form Templates", permission: "forms.view", href: "/admin/forms/templates", iconName: "CheckSquare" },
      { label: "Leads", permission: "leads.view", href: "/admin/leads", iconName: "Users" },
      { label: "Redirects", permission: "seo.view", href: "/admin/redirects", iconName: "CornerUpRight" },
    ],
  },
  {
    title: "OPERATIONS & SYSTEM",
    items: [
      { label: "Tasks", permission: "tasks.view", href: "/admin/tasks", iconName: "CheckSquare" },
      { label: "Notifications", permission: "notifications.view", href: "/admin/notifications", iconName: "Bell" },
      { label: "Email & Resend", permission: "email_settings.view", href: "/admin/settings/email", iconName: "Mail" },
      { label: "Email Logs", permission: "email_logs.view", href: "/admin/settings/email/logs", iconName: "History" },
      { label: "Email Templates", permission: "email_templates.view", href: "/admin/settings/email-templates", iconName: "FileText" },
      { label: "Integrations", permission: "settings.view", href: "/admin/integrations", iconName: "Cable" },
      { label: "System Health", permission: "settings.view", href: "/admin/system/health", iconName: "Activity" },
      { label: "Backups", permission: "settings.view", href: "/admin/system/backups", iconName: "Database" },
      { label: "Business Profile", permission: "settings.view", href: "/admin/settings/business", iconName: "Building2" },
      { label: "Import / Export", permission: "import_export.use", href: "/admin/tools/import-export", iconName: "CornerUpRight" },
      { label: "Team", permission: "users.view", href: "/admin/team", iconName: "UserCheck" },
      { label: "Roles & Permissions", permission: "users.view", href: "/admin/roles", iconName: "ShieldAlert" },
      { label: "Audit Log", permission: "audit.view", href: "/admin/audit-log", iconName: "History" },
      { label: "Account Settings", href: "/admin/settings", iconName: "Settings" },
    ],
  },
];

export function filterNavigation(
  groups: NavGroupConfig[],
  can: (perm?: string) => boolean
): NavGroupConfig[] {
  return groups
    .map((g) => {
      const items = g.items
        .filter((it) => !it.permission || can(it.permission))
        .map((it) => {
          if (!it.children) return it;
          const kids = it.children.filter((c) => !c.permission || can(c.permission));
          return { ...it, children: kids };
        });
      return { ...g, items };
    })
    .filter((g) => g.items.length > 0);
}
