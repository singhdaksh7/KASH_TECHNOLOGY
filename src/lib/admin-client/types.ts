export type PageStatus = "Draft" | "Published" | "Scheduled";

export type SectionType =
  | "Hero"
  | "Rich Text"
  | "Image + Text"
  | "Text + Image"
  | "Services Grid"
  | "Portfolio Grid"
  | "Featured Project"
  | "CTA"
  | "FAQ"
  | "Stats"
  | "Trust Strip"
  | "Logo Strip"
  | "Founder"
  | "Team"
  | "Process"
  | "Video"
  | "Gallery"
  | "Contact Form"
  | "Pricing"
  | "Testimonials"
  | "Insights Feed"
  | "Spacer"
  | "Custom Embed";

export interface SectionStyle {
  background: "White" | "Ivory" | "Peach" | "Black" | "Orange" | "Gradient" | "Custom";
  customColor?: string;
  paddingTop: number; // in rem or px
  paddingBottom: number;
  container: "Full" | "Wide" | "Normal" | "Narrow";
  alignment: "Left" | "Center" | "Right";
  borderRadius?: number;
  border?: boolean;
  shadow?: "None" | "Small" | "Medium" | "Large";
  customCssClass?: string;
}

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  enabled: boolean;
  content: Record<string, unknown>;
  style: SectionStyle;
}

export interface PageSeo {
  title: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  focusKeyword: string;
  secondaryKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  index: boolean;
  follow: boolean;
}

export interface AdminPageItem {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  lastUpdated: string;
  updatedBy: string;
  seoScore: number; // 0-100
  seo: PageSeo;
  sections: PageSection[];
}

export type ProjectStatus = "Draft" | "Published";
export type ProjectKind = "REAL PROJECT" | "PROTOTYPE" | "CONCEPT";

export interface PortfolioItem {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  projectType: ProjectKind;
  category: string;
  industry: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  heroImage: string;
  gallery: string[];
  videoUrl?: string;
  technologies: string[];
  services: string[];
  problem: string[];
  solution: string[];
  features: Array<{ title: string; description: string }>;
  architecture: Array<{ label: string; description: string }>;
  developmentProcess?: string[];
  externalUrl?: string;
  caseStudyUrl?: string;
  clickBehaviour: "Open Case Study" | "External Website" | "Modal" | "Custom URL" | "No Link";
  seo: PageSeo;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: "image" | "video" | "pdf";
  altText: string;
  title: string;
  caption: string;
  dimensions?: string;
  fileSize: string;
  uploadedAt: string;
  usageCount: number;
}

export interface SeoIssue {
  id: string;
  pageTitle: string;
  slug: string;
  type: "Missing Title" | "Missing Meta Description" | "Missing H1" | "Missing ALT text" | "Noindex" | "Redirect Issue";
  severity: "high" | "medium" | "low";
  recommendation: string;
}

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "WON" | "LOST";

export interface LeadItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  source: string;
  landingPage: string;
  campaign?: string;
  date: string;
  status: LeadStatus;
  notes: Array<{ id: string; author: string; text: string; date: string }>;
}

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: "Text" | "Email" | "Phone" | "Textarea" | "Dropdown" | "Checkbox" | "Radio" | "Date" | "File" | "Hidden";
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
}

export interface FormItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
  submissionsCount: number;
  updatedAt: string;
}

export type AdminRole = "Super Admin" | "Administrator" | "SEO Manager" | "Content Editor" | "Marketing Manager" | "Viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "Active" | "Disabled" | "Invited";
  lastActive: string;
  twoFactorEnabled: boolean;
}

export interface NavigationLink {
  id: string;
  label: string;
  url: string;
  openNewTab: boolean;
  visible: boolean;
  children?: NavigationLink[];
}

export interface HeaderConfig {
  logoUrl: string;
  sticky: boolean;
  showAnnouncement: boolean;
  announcementText: string;
  announcementLink: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  mobileMenuType: "Drawer" | "Dropdown";
}

export interface FooterConfig {
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  showNewsletter: boolean;
  newsletterHeadline: string;
  copyrightText: string;
  quickLinks: Array<{ label: string; url: string }>;
  servicesLinks: Array<{ label: string; url: string }>;
  legalLinks: Array<{ label: string; url: string }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface ThemeConfig {
  primaryOrange: string;
  secondaryOrange: string;
  ivory: string;
  white: string;
  black: string;
  bodyText: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  buttonRadius: number; // in px
  cardRadius: number;
  containerWidth: number; // in px
  sectionSpacing: "Compact" | "Normal" | "Spacious";
}
