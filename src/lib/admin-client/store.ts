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
}

// Export singleton instance for client-side CMS UI
export const adminClient = new AdminStore();
