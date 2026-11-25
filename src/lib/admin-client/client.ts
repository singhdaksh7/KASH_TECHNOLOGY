import { AdminApiError, api } from "./http";
import { DEFAULT_FOOTER, DEFAULT_HEADER, DEFAULT_NAVIGATION, DEFAULT_THEME_CONFIG } from "./defaults";
import * as ui from "./adapters";
import type {
  AdminNotification, AdminTask, AdvancedSeoIssue, EmailTemplateItem, FormTemplateItem, GlobalBlock, LeadPriority, MediaFolder, PageTemplate, PageVersion, PortfolioTemplateItem,
  SchedulePublishConfig, VersionDiff,
  AdminPageItem, ArticleItem, AuditItem, FooterConfig, FormItem, HeaderConfig, LeadItem, MediaItem, NavigationLink,   PortfolioItem, RedirectItem, RoleItem, SeoIssue, SessionInfo, TeamMember, ThemeConfig,
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
  login: (email: string, password: string) => api<{ requiresTwoFactor: boolean; setupTwoFactor?: boolean; mustChangePassword?: boolean }>("/auth/login", { json: { email, password } }),
  verifyTwoFactor: (code: string) => api<{ authenticated: boolean }>("/auth/verify-2fa", { json: { code } }),
  useRecoveryCode: (code: string) => api<{ authenticated: boolean }>("/auth/recovery", { json: { code } }),
  setupTwoFactor: () => api<{ provisioningUri: string; qrDataUrl: string; manualKey: string }>("/auth/2fa/setup", { method: "POST", json: {} }),
  confirmTwoFactor: (code: string) => api<{ recoveryCodes: string[] }>("/auth/2fa/confirm", { json: { code } }),
  logout: () => api("/auth/logout", { method: "POST", json: {} }).then(() => true),
  changePassword: (currentPassword: string, newPassword: string) => api<{ changed: boolean; twoFactorEnabled?: boolean }>("/auth/password", { json: { currentPassword, newPassword } }),
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
  getPageVersions: async (id: string): Promise<PageVersion[]> => (await api<ui.VersionRow[]>(`/pages/${id}/versions`)).map((v) => ui.toUiVersion(id, v)),
  compareVersions: async (id: string, a: string, b: string): Promise<VersionDiff[]> => ui.toUiDiffs((await api<{ diff: never }>(`/pages/${id}/versions/${a}/compare/${b}`)).diff),
  restorePageVersion: (id: string, version: number) => api<AdminPageItem>(`/pages/${id}/restore`, { json: { version } }),


  /* ───── Phase 2: approval workflow & scheduling (pages) ───── */
  submitForReview: (id: string, note = "") => api<AdminPageItem>(`/pages/${id}/submit-review`, { json: { note: note || undefined } }),
  requestChanges: (id: string, note: string) => api<AdminPageItem>(`/pages/${id}/request-changes`, { json: { note } }),
  approvePage: (id: string, note?: string) => api<AdminPageItem>(`/pages/${id}/approve`, { json: { note } }),
  archivePage: (id: string) => api<AdminPageItem>(`/pages/${id}/archive`, { json: {} }),
  unarchivePage: (id: string) => api<AdminPageItem>(`/pages/${id}/unarchive`, { json: {} }),
  /** Wall-clock date/time + IANA timezone in; the server normalises to UTC. */
  schedulePublish: (id: string, c: SchedulePublishConfig) =>
    api<AdminPageItem>(`/pages/${id}/schedule`, { json: { publishDate: c.publishDate, publishTime: c.publishTime, timezone: c.timezone, unpublishDate: c.unpublishDate || undefined, unpublishTime: c.unpublishDate ? c.unpublishTime || "00:00" : undefined } }),
  cancelSchedule: (id: string) => api<AdminPageItem>(`/pages/${id}/cancel-schedule`, { json: {} }),

  /* ───── Phase 2: page templates ───── */
  getPageTemplates: async (): Promise<PageTemplate[]> => (await api<ui.PageTemplateRow[]>("/page-templates")).map(ui.toUiPageTemplate),
  createPageFromTemplate: async (templateId: string, title: string, slug: string): Promise<AdminPageItem> => {
    const created = await api<{ id: string }>(`/page-templates/${templateId}/create-page`, { json: { title, slug: slug.startsWith("/") ? slug : `/${slug}` } });
    return api<AdminPageItem>(`/pages/${created.id}`);
  },
  duplicatePageTemplate: async (id: string): Promise<PageTemplate | null> => {
    const src = await api<ui.PageTemplateRow & { category: string }>(`/page-templates/${id}`);
    const row = await api<ui.PageTemplateRow>("/page-templates", { json: { name: `${src.name} (Copy)`, description: src.description ?? undefined, category: src.category === "BLANK" ? "CUSTOM" : src.category, definition: src.definition } });
    return ui.toUiPageTemplate(row);
  },
  deletePageTemplate: (id: string) => api(`/page-templates/${id}`, { method: "DELETE" }).then(() => true),

  /* ───── Phase 2: global blocks ───── */
  getGlobalBlocks: async (): Promise<GlobalBlock[]> => {
    const rows = await api<ui.GlobalBlockRow[]>("/global-blocks");
    return Promise.all(rows.map(async (r) => ui.toUiGlobalBlock({ ...r, usage: r.usageCount ? await api<ui.GlobalBlockRow["usage"]>(`/global-blocks/${r.id}/usage`) : [] })));
  },
  saveGlobalBlock: async (b: GlobalBlock): Promise<GlobalBlock> => {
    const body = ui.fromUiGlobalBlock(b);
    const row = isPersisted(b.id) ? await api<ui.GlobalBlockRow>(`/global-blocks/${b.id}`, { method: "PATCH", json: body }) : await api<ui.GlobalBlockRow>("/global-blocks", { json: body });
    return ui.toUiGlobalBlock({ ...row, usage: await api<ui.GlobalBlockRow["usage"]>(`/global-blocks/${row.id}/usage`) });
  },
  duplicateGlobalBlock: async (id: string): Promise<GlobalBlock | null> => {
    const src = await api<ui.GlobalBlockRow>(`/global-blocks/${id}`);
    const row = await api<ui.GlobalBlockRow>("/global-blocks", { json: { name: `${src.name} (Copy)`, type: src.type, description: src.description ?? undefined, content: src.content, style: src.style } });
    return ui.toUiGlobalBlock({ ...row, usage: [] });
  },
  deleteGlobalBlock: (id: string) => api(`/global-blocks/${id}`, { method: "DELETE" }).then(() => true),
  detachGlobalBlock: (id: string, pageId?: string) => api<{ detachedLive: number; detachedDraft: number }>(`/global-blocks/${id}/detach`, { json: { pageId } }),
  linkGlobalBlock: (id: string, pageId: string, position?: number) => api<{ sectionId: string }>(`/global-blocks/${id}/link`, { json: { pageId, position } }),

  /* ───── Phase 2: SEO audit (real pages only; no traffic / ranking data exists) ───── */
  getSeoAudit: async () => {
    const r = await api<{ generatedAt: string; summary: { critical: number; warning: number; recommendation: number; passed: number; pagesAudited: number }; issues: ui.ApiSeoIssue[]; passed: Array<{ type: string; message: string }>; notes: string[] }>("/seo/audit");
    return { generatedAt: r.generatedAt, summary: r.summary, notes: r.notes, issues: [...r.issues.map(ui.toUiSeoIssue), ...r.passed.map(ui.toUiPassed)] as AdvancedSeoIssue[] };
  },
  getAdvancedSeoIssues: async (): Promise<AdvancedSeoIssue[]> => (await adminClient.getSeoAudit()).issues,

  /* ───── Phase 2: media folders / optimisation ───── */
  getMediaFolders: async (): Promise<MediaFolder[]> => (await api<{ folders: ui.FolderRow[] }>("/media/folders")).folders.map(ui.toUiFolder),
  createMediaFolder: async (name: string, parentId?: string | null): Promise<MediaFolder> => {
    const f = await api<{ id: string; name: string; parentId: string | null }>("/media/folders", { json: { name, parentId: parentId ?? null } });
    return ui.toUiFolder({ ...f, path: f.name, depth: 1, assetCount: 0, childCount: 0 });
  },
  renameMediaFolder: (id: string, name: string) => api(`/media/folders/${id}`, { method: "PATCH", json: { name } }).then(() => true),
  deleteMediaFolder: (id: string) => api(`/media/folders/${id}`, { method: "DELETE" }).then(() => true),
  /** `folderId` null = move to "Unfiled". Runs as one all-or-nothing batch. */
  moveMediaToFolder: (ids: string[], folderId: string | null) => api<{ changed: number }>("/media/bulk", { json: { action: "move", ids, folderId } }).then(() => true),
  getMediaCapabilities: () => api<{ optimization: { supported: boolean; formats: Record<string, { supported: boolean; reason?: string }> } }>("/media/capabilities"),
  /** Rejects with AdminApiError code UNSUPPORTED_CAPABILITY while the server cannot convert images. Never fabricates results. */
  optimizeMediaItem: (id: string, format: "WEBP" | "AVIF" = "WEBP") => api<MediaItem>(`/media/${id}/optimize`, { json: { format } }),

  /* ───── Phase 2: lead CRM ───── */
  getLead: (id: string) => api<LeadItem>(`/leads/${id}`),
  getAssignees: () => api<Array<{ id: string; name: string; email: string; roles: string[] }>>("/assignees"),
  assignLead: (id: string, assignedToId: string | null) => api(`/leads/${id}/assign`, { method: "PATCH", json: { assignedToId } }).then(() => true),
  setLeadPriority: (id: string, priority: LeadPriority) => api(`/leads/${id}/priority`, { method: "PATCH", json: { priority } }).then(() => true),
  updateLeadDetails: (id: string, d: { estimatedValue?: number | null; tags?: string[] }) => api(`/leads/${id}/priority`, { method: "PATCH", json: d }).then(() => true),
  setLeadFollowUp: (id: string, nextFollowUpAt: string | null, note?: string) => api(`/leads/${id}/follow-up`, { method: "PATCH", json: { nextFollowUpAt, note } }).then(() => true),

  /* ───── Phase 2: tasks ───── */
  getTasks: async (): Promise<AdminTask[]> => (await api<ui.TaskRow[]>("/tasks")).map(ui.toUiTask),
  saveTask: async (t: AdminTask): Promise<AdminTask> => {
    const body = { title: t.title, description: t.description || null, priority: t.priority, status: t.status, dueAt: t.dueDate ? new Date(`${t.dueDate}T09:00:00+05:30`).toISOString() : null, assignedToId: t.assigneeId ?? null, relatedType: ui.REL_TO_DB[t.relatedEntity], relatedId: t.relatedId ?? null };
    const row = isPersisted(t.id) ? await api<ui.TaskRow>(`/tasks/${t.id}`, { method: "PATCH", json: body }) : await api<ui.TaskRow>("/tasks", { json: body });
    return (await api<ui.TaskRow[]>(`/tasks?q=${encodeURIComponent(row.title)}`)).map(ui.toUiTask).find((x) => x.id === row.id) ?? ui.toUiTask(row);
  },
  updateTaskStatus: (id: string, status: AdminTask["status"]) => api(`/tasks/${id}`, { method: "PATCH", json: { status } }).then(() => true),
  deleteTask: (id: string) => api(`/tasks/${id}`, { method: "DELETE" }).then(() => true),

  /* ───── Phase 2: notifications ───── */
  getNotifications: async (): Promise<AdminNotification[]> => (await api<{ items: ui.NotificationRow[] }>("/notifications?limit=100")).items.map(ui.toUiNotification),
  getUnreadNotificationCount: async () => (await api<{ unreadCount: number }>("/notifications?limit=1")).unreadCount,
  markNotificationRead: (id: string) => api(`/notifications/${id}/read`, { method: "POST", json: {} }).then(() => true),
  markAllNotificationsRead: () => api("/notifications/read-all", { method: "POST", json: {} }).then(() => true),

  /* ───── Phase 2: email templates ───── */
  getEmailTemplates: async (): Promise<EmailTemplateItem[]> => (await api<ui.EmailTemplateRow[]>("/email-templates")).map(ui.toUiEmailTemplate),
  saveEmailTemplate: async (t: Pick<EmailTemplateItem, "slug" | "subject" | "body" | "enabled">): Promise<EmailTemplateItem> =>
    ui.toUiEmailTemplate(await api<ui.EmailTemplateRow>(`/email-templates/${t.slug}`, { method: "PATCH", json: { subject: t.subject, body: t.body, enabled: t.enabled } })),
  getEmailStatus: () => api<{ configured: boolean }>("/email-status"),
  previewEmailTemplate: (slug: string, draft: { subject: string; body: string }, variables?: Record<string, string>) => api<{ subject: string; text: string }>(`/email-templates/${slug}/preview`, { json: { ...draft, variables } }),

  /* ───── Phase 2: form & portfolio templates ───── */
  getFormTemplates: async (): Promise<FormTemplateItem[]> => (await api<ui.FormTemplateRow[]>("/form-templates")).map(ui.toUiFormTemplate),
  createFormFromTemplate: (templateId: string, opts: { name?: string; slug?: string } = {}) => api<{ id: string; slug: string }>(`/form-templates/${templateId}/create`, { json: opts }),
  getPortfolioTemplates: async (): Promise<PortfolioTemplateItem[]> => (await api<ui.PortfolioTemplateRow[]>("/portfolio-templates")).map(ui.toUiPortfolioTemplate),
  createProjectFromTemplate: (templateId: string, title: string) => api<{ id: string; slug: string }>(`/portfolio-templates/${templateId}/create`, { json: { title } }),

  /* ───── Phase 2: search, bulk, import / export ───── */
  search: (q: string) => api<{ query: string; total: number; results: Record<string, Array<{ type: string; id: string; title: string; subtitle: string | null; status?: string; url: string }>> }>(`/search?q=${encodeURIComponent(q)}&limit=5`),
  bulkPages: (action: "publish" | "archive" | "unarchive", ids: string[]) => api<{ changed: number; skipped: number }>("/pages/bulk", { json: { action, ids } }),
  bulkPortfolio: (action: "publish" | "archive", ids: string[]) => api<{ changed: number; skipped: number }>("/portfolio/bulk", { json: { action, ids } }),
  bulkLeads: (payload: { action: "assign"; ids: string[]; assignedToId: string | null } | { action: "tag"; ids: string[]; add: string[]; remove: string[] } | { action: "status"; ids: string[]; status: LeadItem["status"] } | { action: "priority"; ids: string[]; priority: LeadPriority }) => api<{ changed: number; skipped: number }>("/leads/bulk", { json: payload }),
  bulkMedia: (payload: { action: "move"; ids: string[]; folderId: string | null } | { action: "tag"; ids: string[]; add: string[]; remove: string[] }) => api<{ changed: number; skipped: number }>("/media/bulk", { json: payload }),
  /** Downloads an export as a file (never contains passwords, sessions, 2FA secrets or recovery codes). */
  exportData: async (kind: "pages" | "portfolio" | "articles" | "forms" | "leads", format: "json" | "csv") => {
    const res = await fetch(`/api/admin/export/${kind}?format=${format}`, { credentials: "same-origin", cache: "no-store" });
    if (!res.ok) { const p = await res.json().catch(() => null); throw new AdminApiError(res.status, p?.error?.code ?? "EXPORT_FAILED", p?.error?.message ?? `Export failed (${res.status})`); }
    const name = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? `${kind}.${format}`;
    return { blob: await res.blob(), filename: name, count: Number(res.headers.get("X-Export-Count") ?? 0) };
  },
  importData: (kind: "pages" | "portfolio" | "leads", p: { mode: "dry-run" | "execute"; data: unknown; digest?: string; skipRejected?: boolean; allowDuplicates?: boolean }) =>
    api<{ digest: string; counts: { total: number; accepted: number; rejected: number; warnings: number }; accepted: Array<{ row: number; summary: string }>; rejected: Array<{ row: number; summary: string; errors: string[] }>; warnings: Array<{ row: number; message: string }>; executed?: { created: number; skipped: number } }>(`/import/${kind}`, { json: p }),

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

