/* eslint-disable */
import {
  AdminPageItem,
  PortfolioItem,
  MediaItem,
  SeoIssue,
  LeadItem,
  FormItem,
  TeamMember,
  NavigationLink,
  HeaderConfig,
  FooterConfig,
  ThemeConfig,
  PageSection,
  PageTemplate,
  GlobalBlock,
  AdvancedSeoIssue,
  MediaFolder,
  AdminTask,
  AdminNotification,
  EmailTemplateItem,
  FormTemplateItem,
  PortfolioTemplateItem,
  PageVersion,
  VersionDiff,
  ReviewActivityItem,
  SchedulePublishConfig,
  LeadStatus,
} from "./types";
import {
  MOCK_PAGES,
  MOCK_PORTFOLIO,
  MOCK_MEDIA,
  MOCK_SEO_ISSUES,
  MOCK_LEADS,
  MOCK_FORMS,
  MOCK_TEAM,
  MOCK_NAVIGATION,
  MOCK_HEADER_CONFIG,
  MOCK_FOOTER_CONFIG,
  MOCK_THEME_CONFIG,
  MOCK_PAGE_TEMPLATES,
  MOCK_GLOBAL_BLOCKS,
  MOCK_ADVANCED_SEO_ISSUES,
  MOCK_MEDIA_FOLDERS,
  MOCK_ADMIN_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_EMAIL_TEMPLATES,
  MOCK_FORM_TEMPLATES,
  MOCK_PORTFOLIO_TEMPLATES,
  MOCK_PAGE_VERSIONS,
} from "./mock-data";

/**
 * CLIENT-SIDE CMS STORE (MOCK / BOUNDARY IMPLEMENTATION)
 * Keeps state in-memory and local storage during development/preview
 * until the backend API endpoints provided by Claude/Codex are connected.
 */

class AdminStore {
  private pages: AdminPageItem[] = [...MOCK_PAGES];
  private portfolio: PortfolioItem[] = [...MOCK_PORTFOLIO];
  private media: MediaItem[] = [...MOCK_MEDIA];
  private seoIssues: SeoIssue[] = [...MOCK_SEO_ISSUES];
  private leads: LeadItem[] = [...MOCK_LEADS];
  private forms: FormItem[] = [...MOCK_FORMS];
  private team: TeamMember[] = [...MOCK_TEAM];
  private navigation: NavigationLink[] = [...MOCK_NAVIGATION];
  private header: HeaderConfig = { ...MOCK_HEADER_CONFIG };
  private footer: FooterConfig = { ...MOCK_FOOTER_CONFIG };
  private theme: ThemeConfig = { ...MOCK_THEME_CONFIG };

  // --- PAGES ---
  async getPages(): Promise<AdminPageItem[]> {
    return [...this.pages];
  }

  async getPage(id: string): Promise<AdminPageItem | null> {
    const page = this.pages.find((p) => p.id === id || p.slug === id);
    return page ? JSON.parse(JSON.stringify(page)) : null;
  }

  async savePage(page: AdminPageItem): Promise<AdminPageItem> {
    const idx = this.pages.findIndex((p) => p.id === page.id);
    const updated = {
      ...page,
      lastUpdated: new Date().toISOString().replace("T", " ").slice(0, 16),
      updatedBy: "Daksh Singh",
    };
    if (idx >= 0) {
      this.pages[idx] = updated;
    } else {
      this.pages.unshift(updated);
    }
    return updated;
  }

  async publishPage(id: string): Promise<boolean> {
    const page = this.pages.find((p) => p.id === id);
    if (page) {
      page.status = "Published";
      page.lastUpdated = new Date().toISOString().replace("T", " ").slice(0, 16);
      return true;
    }
    return false;
  }

  async unpublishPage(id: string): Promise<boolean> {
    const page = this.pages.find((p) => p.id === id);
    if (page) {
      page.status = "Draft";
      page.lastUpdated = new Date().toISOString().replace("T", " ").slice(0, 16);
      return true;
    }
    return false;
  }

  async duplicatePage(id: string): Promise<AdminPageItem | null> {
    const original = this.pages.find((p) => p.id === id);
    if (!original) return null;
    const duplicated: AdminPageItem = {
      ...JSON.parse(JSON.stringify(original)),
      id: `page-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: "Draft",
      lastUpdated: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    this.pages.push(duplicated);
    return duplicated;
  }

  async deletePage(id: string): Promise<boolean> {
    const idx = this.pages.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.pages.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- PORTFOLIO ---
  async getPortfolio(): Promise<PortfolioItem[]> {
    return [...this.portfolio];
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    const item = this.portfolio.find((p) => p.id === id || p.slug === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async getProject(id: string): Promise<PortfolioItem | null> {
    return this.getPortfolioItem(id);
  }

  async saveProject(item: PortfolioItem): Promise<PortfolioItem> {
    return this.savePortfolioItem(item);
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.deletePortfolioItem(id);
  }

  async savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem> {
    const idx = this.portfolio.findIndex((p) => p.id === item.id);
    const updated = {
      ...item,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    if (idx >= 0) {
      this.portfolio[idx] = updated;
    } else {
      this.portfolio.unshift(updated);
    }
    return updated;
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    const idx = this.portfolio.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.portfolio.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- MEDIA ---
  async getMedia(): Promise<MediaItem[]> {
    return [...this.media];
  }

  async uploadMedia(file: { name?: string; filename?: string; size?: number; type?: string; url?: string; altText?: string; title?: string; caption?: string; fileSize?: string; dimensions?: string }): Promise<MediaItem> {
    const filename = file.filename || file.name || "uploaded-asset.png";
    const typeStr = file.type || "image";
    const sizeStr = file.fileSize || (file.size ? `${Math.round(file.size / 1024)} KB` : "150 KB");
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      filename,
      url: file.url || "/images/hero/hero-laptop-composition.png",
      type: typeStr.startsWith("video") ? "video" : typeStr.includes("pdf") ? "pdf" : "image",
      altText: file.altText || filename.replace(/\.[^/.]+$/, ""),
      title: file.title || filename,
      caption: file.caption || "",
      dimensions: file.dimensions || "1200x800",
      fileSize: sizeStr,
      uploadedAt: new Date().toISOString().slice(0, 10),
      usageCount: 0,
    };
    this.media.unshift(newItem);
    return newItem;
  }

  async updateMedia(id: string, updates: Partial<MediaItem>): Promise<MediaItem | null> {
    const item = this.media.find((m) => m.id === id);
    if (item) {
      Object.assign(item, updates);
      return { ...item };
    }
    return null;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const idx = this.media.findIndex((m) => m.id === id);
    if (idx >= 0) {
      this.media.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- SEO ---
  async getSeoIssues(): Promise<SeoIssue[]> {
    return [...this.seoIssues];
  }

  // --- LEADS ---
  async getLeads(): Promise<LeadItem[]> {
    return [...this.leads];
  }

  async updateLeadStatus(id: string, status: LeadItem["status"]): Promise<boolean> {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      return true;
    }
    return false;
  }

  async addLeadNote(id: string, text: string): Promise<boolean> {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.notes.push({
        id: `note-${Date.now()}`,
        author: "Daksh Singh",
        text,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
      });
      return true;
    }
    return false;
  }

  // --- FORMS ---
  async getForms(): Promise<FormItem[]> {
    return [...this.forms];
  }

  async getForm(id: string): Promise<FormItem | null> {
    const form = this.forms.find((f) => f.id === id);
    return form ? JSON.parse(JSON.stringify(form)) : null;
  }

  async saveForm(form: FormItem): Promise<FormItem> {
    const idx = this.forms.findIndex((f) => f.id === form.id);
    const updated = { ...form, updatedAt: new Date().toISOString().slice(0, 10) };
    if (idx >= 0) {
      this.forms[idx] = updated;
    } else {
      this.forms.unshift(updated);
    }
    return updated;
  }

  // --- TEAM ---
  async getTeam(): Promise<TeamMember[]> {
    return [...this.team];
  }

  async updateTeamRole(id: string, role: TeamMember["role"]): Promise<boolean> {
    const user = this.team.find((u) => u.id === id);
    if (user) {
      user.role = role;
      return true;
    }
    return false;
  }

  async toggleTeamStatus(id: string): Promise<boolean> {
    const user = this.team.find((u) => u.id === id);
    if (user) {
      user.status = user.status === "Active" ? "Disabled" : "Active";
      return true;
    }
    return false;
  }

  async inviteTeamMember(name: string, email: string, role: TeamMember["role"]): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      status: "Invited",
      lastActive: "Never",
      twoFactorEnabled: false,
    };
    this.team.push(newMember);
    return newMember;
  }

  // --- NAVIGATION ---
  async getNavigation(): Promise<NavigationLink[]> {
    return JSON.parse(JSON.stringify(this.navigation));
  }

  async saveNavigation(links: NavigationLink[]): Promise<boolean> {
    this.navigation = JSON.parse(JSON.stringify(links));
    return true;
  }

  // --- HEADER & FOOTER & THEME ---
  async getHeaderConfig(): Promise<HeaderConfig> {
    return { ...this.header };
  }

  async saveHeaderConfig(cfg: HeaderConfig): Promise<boolean> {
    this.header = { ...cfg };
    return true;
  }

  async getFooterConfig(): Promise<FooterConfig> {
    return { ...this.footer };
  }

  async saveFooterConfig(cfg: FooterConfig): Promise<boolean> {
    this.footer = { ...cfg };
    return true;
  }

  async getThemeConfig(): Promise<ThemeConfig> {
    return { ...this.theme };
  }

  async saveThemeConfig(cfg: ThemeConfig): Promise<boolean> {
    this.theme = { ...cfg };
    return true;
  }

  async resetThemeConfig(): Promise<ThemeConfig> {
    this.theme = { ...MOCK_THEME_CONFIG };
    return { ...this.theme };
  }

  // ==========================================
  // PHASE 2 API CONTRACTS & WORKFLOW ABSTRACTIONS
  // ==========================================

  private pageTemplates: PageTemplate[] = [...MOCK_PAGE_TEMPLATES];
  private globalBlocks: GlobalBlock[] = [...MOCK_GLOBAL_BLOCKS];
  private advancedSeoIssues: AdvancedSeoIssue[] = [...MOCK_ADVANCED_SEO_ISSUES];
  private mediaFolders: MediaFolder[] = [...MOCK_MEDIA_FOLDERS];
  private adminTasks: AdminTask[] = [...MOCK_ADMIN_TASKS];
  private notifications: AdminNotification[] = [...MOCK_NOTIFICATIONS];
  private emailTemplates: EmailTemplateItem[] = [...MOCK_EMAIL_TEMPLATES];
  private formTemplates: FormTemplateItem[] = [...MOCK_FORM_TEMPLATES];
  private portfolioTemplates: PortfolioTemplateItem[] = [...MOCK_PORTFOLIO_TEMPLATES];
  private pageVersions: Record<string, PageVersion[]> = { ...MOCK_PAGE_VERSIONS };

  // --- PAGE TEMPLATES ---
  async getPageTemplates(): Promise<PageTemplate[]> {
    return [...this.pageTemplates];
  }

  async getPageTemplate(id: string): Promise<PageTemplate | null> {
    const t = this.pageTemplates.find((tpl) => tpl.id === id || tpl.slug === id);
    return t ? JSON.parse(JSON.stringify(t)) : null;
  }

  async createPageFromTemplate(templateId: string, title: string, slug: string): Promise<AdminPageItem> {
    const tpl = await this.getPageTemplate(templateId);
    const sections: PageSection[] = (tpl?.sections || []).map((sec, idx) => ({
      id: `sec-${Date.now()}-${idx}`,
      type: sec.type,
      order: idx + 1,
      enabled: true,
      content: { heading: sec.label, description: sec.description },
      style: {
        background: sec.type === "CTA" ? "Orange" : "White",
        paddingTop: 4,
        paddingBottom: 4,
        container: "Normal",
        alignment: "Left",
      },
    }));

    const newPage: AdminPageItem = {
      id: `page-${Date.now()}`,
      title,
      slug: slug.startsWith("/") ? slug : `/${slug}`,
      status: "Draft",
      lastUpdated: new Date().toISOString().replace("T", " ").slice(0, 16),
      updatedBy: "Daksh Singh",
      seoScore: 80,
      seo: {
        title: `${title} | KASH Technology`,
        metaDescription: `${title} - KASH Technology`,
        slug: slug.replace(/^\//, ""),
        canonicalUrl: `https://www.kash-technology.com/${slug.replace(/^\//, "")}`,
        focusKeyword: title,
        secondaryKeywords: "",
        ogTitle: title,
        ogDescription: "",
        ogImage: "/images/hero/hero-laptop-composition.png",
        index: true,
        follow: true,
      },
      sections,
    };

    return this.savePage(newPage);
  }

  async duplicatePageTemplate(id: string): Promise<PageTemplate | null> {
    const original = this.pageTemplates.find((t) => t.id === id);
    if (!original) return null;
    const duplicated: PageTemplate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `tpl-${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy`,
      isSystem: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.pageTemplates.push(duplicated);
    return duplicated;
  }

  async deletePageTemplate(id: string): Promise<boolean> {
    const idx = this.pageTemplates.findIndex((t) => t.id === id);
    if (idx >= 0) {
      if (this.pageTemplates[idx].isSystem) return false; // Protected system template
      this.pageTemplates.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- GLOBAL REUSABLE BLOCKS ---
  async getGlobalBlocks(): Promise<GlobalBlock[]> {
    return [...this.globalBlocks];
  }

  async getGlobalBlock(id: string): Promise<GlobalBlock | null> {
    const gb = this.globalBlocks.find((b) => b.id === id);
    return gb ? JSON.parse(JSON.stringify(gb)) : null;
  }

  async saveGlobalBlock(block: GlobalBlock): Promise<GlobalBlock> {
    const idx = this.globalBlocks.findIndex((b) => b.id === block.id);
    const updated = {
      ...block,
      updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    if (idx >= 0) {
      this.globalBlocks[idx] = updated;
    } else {
      this.globalBlocks.unshift(updated);
    }
    return updated;
  }

  async duplicateGlobalBlock(id: string): Promise<GlobalBlock | null> {
    const original = this.globalBlocks.find((b) => b.id === id);
    if (!original) return null;
    const duplicated: GlobalBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: `gb-${Date.now()}`,
      name: `${original.name} (Copy)`,
      usageCount: 0,
      pagesUsing: [],
      updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    this.globalBlocks.push(duplicated);
    return duplicated;
  }

  async archiveGlobalBlock(id: string): Promise<boolean> {
    const block = this.globalBlocks.find((b) => b.id === id);
    if (block) {
      block.isArchived = !block.isArchived;
      return true;
    }
    return false;
  }

  // --- CONTENT APPROVAL WORKFLOW ---
  async submitForReview(pageId: string, notes: string): Promise<AdminPageItem | null> {
    const page = await this.getPage(pageId);
    if (!page) return null;
    page.status = "In_Review";
    page.submittedBy = "Daksh Singh";
    page.submittedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    page.reviewNotes = notes;
    if (!page.reviewHistory) page.reviewHistory = [];
    page.reviewHistory.unshift({
      id: `act-${Date.now()}`,
      actor: "Daksh Singh",
      role: "Founder & Tech Lead",
      action: "SUBMITTED",
      note: notes || "Submitted page draft for editorial review.",
      timestamp: "Just now",
    });
    return this.savePage(page);
  }

  async requestChanges(pageId: string, notes: string): Promise<AdminPageItem | null> {
    const page = await this.getPage(pageId);
    if (!page) return null;
    page.status = "Changes_Requested";
    page.reviewNotes = notes;
    if (!page.reviewHistory) page.reviewHistory = [];
    page.reviewHistory.unshift({
      id: `act-${Date.now()}`,
      actor: "Editorial Reviewer",
      role: "SEO Manager",
      action: "REQUESTED_CHANGES",
      note: notes,
      timestamp: "Just now",
    });
    return this.savePage(page);
  }

  async approvePage(pageId: string, notes?: string): Promise<AdminPageItem | null> {
    const page = await this.getPage(pageId);
    if (!page) return null;
    page.status = "Approved";
    if (!page.reviewHistory) page.reviewHistory = [];
    page.reviewHistory.unshift({
      id: `act-${Date.now()}`,
      actor: "Admin Reviewer",
      role: "Super Admin",
      action: "APPROVED",
      note: notes || "Page approved for scheduling and deployment.",
      timestamp: "Just now",
    });
    return this.savePage(page);
  }

  async schedulePublish(pageId: string, schedule: SchedulePublishConfig): Promise<AdminPageItem | null> {
    const page = await this.getPage(pageId);
    if (!page) return null;
    page.status = "Scheduled";
    page.schedule = schedule;
    if (!page.reviewHistory) page.reviewHistory = [];
    page.reviewHistory.unshift({
      id: `act-${Date.now()}`,
      actor: "Daksh Singh",
      role: "Super Admin",
      action: "SCHEDULED",
      note: `Scheduled publication for ${schedule.publishDate} at ${schedule.publishTime} (${schedule.timezone}).`,
      timestamp: "Just now",
    });
    return this.savePage(page);
  }

  async cancelSchedule(pageId: string): Promise<AdminPageItem | null> {
    const page = await this.getPage(pageId);
    if (!page) return null;
    page.status = "Draft";
    delete page.schedule;
    return this.savePage(page);
  }

  // --- REVISION COMPARISON ---
  async getPageVersions(pageId: string): Promise<PageVersion[]> {
    return this.pageVersions[pageId] || [];
  }

  async compareVersions(pageId: string, vOldId: string, vNewId: string): Promise<VersionDiff[]> {
    const versions = await this.getPageVersions(pageId);
    const vOld = versions.find((v) => v.versionId === vOldId);
    const vNew = versions.find((v) => v.versionId === vNewId);
    if (!vOld || !vNew) return [];

    const diffs: VersionDiff[] = [];

    // Title diff
    if (vOld.snapshot.title !== vNew.snapshot.title) {
      diffs.push({
        category: "Changed",
        entity: "Page Title",
        oldValue: vOld.snapshot.title,
        newValue: vNew.snapshot.title,
      });
    }

    // SEO Title diff
    if (vOld.snapshot.seo?.title !== vNew.snapshot.seo?.title) {
      diffs.push({
        category: "Changed",
        entity: "SEO Title Tag",
        oldValue: vOld.snapshot.seo?.title,
        newValue: vNew.snapshot.seo?.title,
      });
    }

    // SEO Meta description diff
    if (vOld.snapshot.seo?.metaDescription !== vNew.snapshot.seo?.metaDescription) {
      diffs.push({
        category: "Changed",
        entity: "Meta Description",
        oldValue: vOld.snapshot.seo?.metaDescription,
        newValue: vNew.snapshot.seo?.metaDescription,
      });
    }

    // Sections diff
    const oldSecs = vOld.snapshot.sections || [];
    const newSecs = vNew.snapshot.sections || [];
    if (oldSecs.length !== newSecs.length) {
      diffs.push({
        category: newSecs.length > oldSecs.length ? "Added" : "Removed",
        entity: "Sections Count",
        oldValue: `${oldSecs.length} sections`,
        newValue: `${newSecs.length} sections`,
      });
    }

    return diffs;
  }

  // --- ADVANCED SEO AUDIT ---
  async getAdvancedSeoIssues(): Promise<AdvancedSeoIssue[]> {
    return [...this.advancedSeoIssues];
  }

  async resolveSeoIssue(id: string): Promise<boolean> {
    const issue = this.advancedSeoIssues.find((i) => i.id === id);
    if (issue) {
      issue.status = "Resolved";
      return true;
    }
    return false;
  }

  // --- MEDIA FOLDERS & OPTIMIZATION ---
  async getMediaFolders(): Promise<MediaFolder[]> {
    return [...this.mediaFolders];
  }

  async moveMediaToFolder(mediaIds: string[], folderSlug: string): Promise<boolean> {
    this.media.forEach((m) => {
      if (mediaIds.includes(m.id)) {
        m.folder = folderSlug;
      }
    });
    return true;
  }

  async optimizeMediaItem(mediaId: string): Promise<MediaItem | null> {
    const m = this.media.find((item) => item.id === mediaId);
    if (!m) return null;
    m.optimization = {
      webpUrl: m.url.replace(/\.(png|jpg|jpeg)$/, ".webp"),
      avifUrl: m.url.replace(/\.(png|jpg|jpeg)$/, ".avif"),
      originalSize: m.fileSize,
      optimizedSize: "42 KB",
      savingsPercent: 68,
    };
    return { ...m };
  }

  // --- LEAD CRM PHASE 2 ---
  async assignLead(leadId: string, assignedTo: string): Promise<boolean> {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.assignedTo = assignedTo;
      return true;
    }
    return false;
  }

  async setLeadPriority(leadId: string, priority: any): Promise<boolean> {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.priority = priority;
      return true;
    }
    return false;
  }

  async setLeadFollowUp(leadId: string, date: string): Promise<boolean> {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.nextFollowUp = date;
      return true;
    }
    return false;
  }

  // --- TASKS ---
  async getTasks(): Promise<AdminTask[]> {
    return [...this.adminTasks];
  }

  async saveTask(task: AdminTask): Promise<AdminTask> {
    const idx = this.adminTasks.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      this.adminTasks[idx] = task;
    } else {
      this.adminTasks.unshift(task);
    }
    return task;
  }

  async updateTaskStatus(id: string, status: any): Promise<boolean> {
    const task = this.adminTasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      return true;
    }
    return false;
  }

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<AdminNotification[]> {
    return [...this.notifications];
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  async markAllNotificationsRead(): Promise<boolean> {
    this.notifications.forEach((n) => (n.read = true));
    return true;
  }

  // --- EMAIL TEMPLATES ---
  async getEmailTemplates(): Promise<EmailTemplateItem[]> {
    return [...this.emailTemplates];
  }

  async getEmailTemplate(id: string): Promise<EmailTemplateItem | null> {
    const t = this.emailTemplates.find((tpl) => tpl.id === id || tpl.slug === id);
    return t ? JSON.parse(JSON.stringify(t)) : null;
  }

  async saveEmailTemplate(tpl: EmailTemplateItem): Promise<EmailTemplateItem> {
    const idx = this.emailTemplates.findIndex((t) => t.id === tpl.id);
    const updated = {
      ...tpl,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    if (idx >= 0) {
      this.emailTemplates[idx] = updated;
    } else {
      this.emailTemplates.push(updated);
    }
    return updated;
  }

  // --- FORM TEMPLATES ---
  async getFormTemplates(): Promise<FormTemplateItem[]> {
    return [...this.formTemplates];
  }

  // --- PORTFOLIO TEMPLATES ---
  async getPortfolioTemplates(): Promise<PortfolioTemplateItem[]> {
    return [...this.portfolioTemplates];
  }
}

// Export singleton instance for client-side CMS UI
export const adminClient = new AdminStore();
