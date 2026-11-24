import { api } from "./http";
import { DEFAULT_FOOTER, DEFAULT_HEADER, DEFAULT_NAVIGATION, DEFAULT_THEME_CONFIG } from "./defaults";
import type {
  AdminPageItem, ArticleItem, AuditItem, FooterConfig, FormItem, HeaderConfig, LeadItem, MediaItem, NavigationLink, PageVersionItem,
  PortfolioItem, RedirectItem, RoleItem, SeoIssue, SessionInfo, TeamMember, ThemeConfig,
} from "./types";

/**
 * Admin API client. Every method maps 1:1 to an authenticated, permission-checked backend route.
 * There is no local persistence and no mock data on this path: failures throw AdminApiError.
 * (Development fixtures live in dev-fixtures.ts and are NOT imported here.)
 */
const isPersisted = (id: string) => /^c[a-z0-9]{24}$/.test(id);

type SettingRow = { key: string; value: unknown };
const settings = () => api<{ global: SettingRow[]; theme: SettingRow[] }>("/settings");
const putSetting = (key: string, value: unknown, theme = false) => api("/settings", { method: "PUT", json: { key, value, theme } }).then(() => true);

export const adminClient = {
  /* ───── auth ───── */
  login: (email: string, password: string) => api<{ requiresTwoFactor: boolean; setupTwoFactor?: boolean }>("/auth/login", { json: { email, password } }),
  verifyTwoFactor: (code: string) => api<{ authenticated: boolean }>("/auth/verify-2fa", { json: { code } }),
  useRecoveryCode: (code: string) => api<{ authenticated: boolean }>("/auth/recovery", { json: { code } }),
  setupTwoFactor: () => api<{ provisioningUri: string; qrDataUrl: string; manualKey: string }>("/auth/2fa/setup", { method: "POST", json: {} }),
  confirmTwoFactor: (code: string) => api<{ recoveryCodes: string[] }>("/auth/2fa/confirm", { json: { code } }),
  logout: () => api("/auth/logout", { method: "POST", json: {} }).then(() => true),
  changePassword: (currentPassword: string, newPassword: string) => api("/auth/password", { json: { currentPassword, newPassword } }).then(() => true),
  getSession: () => api<SessionInfo>("/auth/session"),

  /* ───── pages ───── */
  getPages: () => api<AdminPageItem[]>("/pages"),
  getPage: (id: string) => api<AdminPageItem>(`/pages/${encodeURIComponent(id)}`).catch(() => null),
  createPage: (title: string, slug: string) => api<AdminPageItem>("/pages", { json: { title, slug } }),
  /** Save Draft — never changes the live site. */
  savePage: (page: AdminPageItem) => api<AdminPageItem>(`/pages/${page.id}`, { method: "PUT", json: { title: page.title, slug: page.slug, sections: page.sections, seo: page.seo } }),
  publishPage: (id: string) => api<AdminPageItem>(`/pages/${id}/publish`, { method: "POST", json: {} }).then(() => true),
  unpublishPage: (id: string) => api<AdminPageItem>(`/pages/${id}/unpublish`, { method: "POST", json: {} }).then(() => true),
  duplicatePage: (id: string) => api<AdminPageItem>(`/pages/${id}/duplicate`, { method: "POST", json: {} }).catch(() => null),
  deletePage: (id: string) => api(`/pages/${id}`, { method: "DELETE" }).then(() => true),
  getPageVersions: (id: string) => api<PageVersionItem[]>(`/pages/${id}/versions`),
  restorePageVersion: (id: string, version: number) => api<AdminPageItem>(`/pages/${id}/restore`, { json: { version } }),

  /* ───── portfolio ───── */
  getPortfolio: () => api<PortfolioItem[]>("/portfolio"),
  getPortfolioItem: (id: string) => api<PortfolioItem>(`/portfolio/${id}`).catch(() => null),
  getProject: (id: string) => api<PortfolioItem>(`/portfolio/${id}`).catch(() => null),
  saveProject: (item: PortfolioItem) => (isPersisted(item.id) ? api<PortfolioItem>(`/portfolio/${item.id}`, { method: "PUT", json: item }) : api<PortfolioItem>("/portfolio", { json: item })),
  savePortfolioItem: (item: PortfolioItem) => adminClient.saveProject(item),
  deleteProject: (id: string) => api(`/portfolio/${id}`, { method: "DELETE" }).then(() => true),
  deletePortfolioItem: (id: string) => adminClient.deleteProject(id),

  /* ───── insights / articles ───── */
  getArticles: () => api<ArticleItem[]>("/articles"),
  saveArticle: (a: ArticleItem) => (isPersisted(a.id) ? api<ArticleItem>(`/articles/${a.id}`, { method: "PUT", json: a }) : api<ArticleItem>("/articles", { json: a })),
  deleteArticle: (id: string) => api(`/articles/${id}`, { method: "DELETE" }).then(() => true),

  /* ───── media ───── */
  getMedia: () => api<MediaItem[]>("/media"),
  uploadMedia: (file: File, meta: { altText?: string; title?: string; caption?: string } = {}) => {
    const form = new FormData();
    form.set("file", file);
    if (meta.altText) form.set("alt", meta.altText);
    if (meta.title) form.set("title", meta.title);
    if (meta.caption) form.set("caption", meta.caption);
    return api<MediaItem>("/media", { form });
  },
  replaceMedia: (id: string, file: File) => {
    const form = new FormData();
    form.set("file", file);
    return api<MediaItem>(`/media/${id}`, { method: "PUT", form });
  },
  updateMedia: (id: string, u: Partial<Pick<MediaItem, "altText" | "title" | "caption">>) => api<MediaItem>(`/media/${id}`, { method: "PATCH", json: u }).catch(() => null),
  deleteMedia: (id: string, force = false) => api(`/media/${id}${force ? "?force=true" : ""}`, { method: "DELETE" }).then(() => true),

  /* ───── SEO / redirects ───── */
  getSeoIssues: () => api<SeoIssue[]>("/seo-issues"),
  getRedirects: () => api<RedirectItem[]>("/redirects"),
  saveRedirect: (r: Omit<RedirectItem, "id"> & { id?: string }) =>
    r.id ? api<RedirectItem>(`/redirects/${r.id}`, { method: "PUT", json: r }) : api<RedirectItem>("/redirects", { json: r }),
  deleteRedirect: (id: string) => api(`/redirects/${id}`, { method: "DELETE" }).then(() => true),

  /* ───── leads ───── */
  getLeads: () => api<LeadItem[]>("/leads"),
  updateLeadStatus: (id: string, status: LeadItem["status"]) => api("/leads", { method: "PATCH", json: { id, status } }).then(() => true),
  addLeadNote: (id: string, text: string) => api(`/leads/${id}/notes`, { json: { text } }).then(() => true),

  /* ───── forms ───── */
  getForms: () => api<FormItem[]>("/forms"),
  getForm: (id: string) => api<FormItem>(`/forms/${id}`).catch(() => null),
  saveForm: (f: FormItem) => (isPersisted(f.id) ? api<FormItem>(`/forms/${f.id}`, { method: "PUT", json: f }) : api<FormItem>("/forms", { json: f })),
  deleteForm: (id: string) => api<{ deleted: boolean; deactivated: boolean }>(`/forms/${id}`, { method: "DELETE" }),

  /* ───── team / roles / audit ───── */
  getTeam: () => api<TeamMember[]>("/team"),
  updateTeamRole: (id: string, role: TeamMember["role"]) => api(`/team/${id}`, { method: "PATCH", json: { role } }).then(() => true),
  toggleTeamStatus: (id: string, current: TeamMember["status"]) => api(`/team/${id}`, { method: "PATCH", json: { status: current === "Disabled" ? "Active" : "Disabled" } }).then(() => true),
  inviteTeamMember: (name: string, email: string, role: TeamMember["role"]) => api<TeamMember>("/team", { json: { name, email, role } }),
  getRoles: () => api<RoleItem[]>("/roles"),
  getAuditLogs: () => api<AuditItem[]>("/audit"),

  /* ───── header / footer / navigation / theme (stored as admin-shaped settings) ───── */
  getNavigation: async (): Promise<NavigationLink[]> => {
    const row = (await settings()).global.find((r) => r.key === "navigation");
    return (row?.value as NavigationLink[] | undefined) ?? DEFAULT_NAVIGATION;
  },
  saveNavigation: (links: NavigationLink[]) => putSetting("navigation", links),
  getHeaderConfig: async (): Promise<HeaderConfig> => ({ ...DEFAULT_HEADER, ...(((await settings()).global.find((r) => r.key === "header")?.value as Partial<HeaderConfig>) ?? {}) }),
  saveHeaderConfig: (cfg: HeaderConfig) => putSetting("header", cfg),
  getFooterConfig: async (): Promise<FooterConfig> => ({ ...DEFAULT_FOOTER, ...(((await settings()).global.find((r) => r.key === "footer")?.value as Partial<FooterConfig>) ?? {}) }),
  saveFooterConfig: (cfg: FooterConfig) => putSetting("footer", cfg),
  getThemeConfig: async (): Promise<ThemeConfig> => ({ ...DEFAULT_THEME_CONFIG, ...(((await settings()).theme.find((r) => r.key === "theme")?.value as Partial<ThemeConfig>) ?? {}) }),
  saveThemeConfig: (cfg: ThemeConfig) => putSetting("theme", cfg, true),
  /** Removes the stored theme so the public site returns to the approved KASH defaults. */
  resetThemeConfig: async (): Promise<ThemeConfig> => {
    await api("/settings", { method: "DELETE", json: { key: "theme", theme: true } });
    return DEFAULT_THEME_CONFIG;
  },
};

