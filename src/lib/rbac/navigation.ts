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
  collapsible?: boolean;
}

/**
 * Clean, consolidated primary admin navigation structure.
 * Follows the 5 primary pillars:
 * 1. HOME (Dashboard)
 * 2. CONTENT (Pages, Portfolio, Insights, Media)
 * 3. MARKETING (Leads, Forms, SEO)
 * 4. WEBSITE (Navigation, Global Blocks, Appearance)
 * 5. WORK (Tasks, Notifications)
 * + SETTINGS (Unified Settings Hub)
 */
export const ADMIN_NAVIGATION: NavGroupConfig[] = [
  {
    title: "HOME",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/admin", iconName: "LayoutDashboard" },
    ],
  },
  {
    title: "CONTENT",
    collapsible: true,
    items: [
      { label: "Pages", permission: "pages.view", href: "/admin/pages", iconName: "FileText" },
      { label: "Portfolio", permission: "portfolio.view", href: "/admin/portfolio", iconName: "Briefcase" },
      { label: "Insights", permission: "articles.view", href: "/admin/insights", iconName: "BookOpen" },
      { label: "Media", permission: "media.view", href: "/admin/media", iconName: "ImageIcon" },
    ],
  },
  {
    title: "MARKETING",
    collapsible: true,
    items: [
      { label: "Leads", permission: "leads.view", href: "/admin/leads", iconName: "Users" },
      { label: "Forms", permission: "forms.view", href: "/admin/forms", iconName: "CheckSquare" },
      { label: "SEO", permission: "seo.view", href: "/admin/seo", iconName: "Search" },
    ],
  },
  {
    title: "WEBSITE",
    collapsible: true,
    items: [
      { label: "Navigation", permission: "settings.view", href: "/admin/design/navigation", iconName: "Compass" },
      { label: "Global Blocks", permission: "global_blocks.view", href: "/admin/design/global-blocks", iconName: "Layers" },
      { label: "Appearance", permission: "settings.view", href: "/admin/design/theme", iconName: "Palette" },
    ],
  },
  {
    title: "WORK",
    collapsible: true,
    items: [
      { label: "Tasks", permission: "tasks.view", href: "/admin/tasks", iconName: "CheckSquare" },
      { label: "Notifications", permission: "notifications.view", href: "/admin/notifications", iconName: "Bell" },
    ],
  },
  {
    title: "SETTINGS",
    collapsible: false,
    items: [
      { label: "Settings", permission: "settings.view", href: "/admin/settings", iconName: "Settings" },
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
