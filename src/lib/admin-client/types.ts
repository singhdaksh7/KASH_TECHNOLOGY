export type PageStatus =
  | "Draft"
  | "In_Review"
  | "Changes_Requested"
  | "Approved"
  | "Scheduled"
  | "Published"
  | "Archived";

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
  paddingTop: number;
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
  isGlobalBlock?: boolean;
  globalBlockId?: string;
}

export type SchemaType =
  | "WebPage"
  | "Service"
  | "Article"
  | "FAQ"
  | "LocalBusiness"
  | "Organization";

export interface PageSeo {
  title: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  focusKeyword: string;
  secondaryKeywords: string;
  searchIntent?: "Informational" | "Commercial" | "Transactional" | "Navigational";
  targetLocation?: string;
  schemaType?: SchemaType;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  index: boolean;
  follow: boolean;
}

export interface ReviewActivityItem {
  id: string;
  actor: string;
  role: string;
  action: "SUBMITTED" | "REQUESTED_CHANGES" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "NOTE";
  note: string;
  timestamp: string;
}

export interface SchedulePublishConfig {
  publishDate: string; // YYYY-MM-DD
  publishTime: string; // HH:mm
  timezone: string; // e.g. "Asia/Kolkata"
  unpublishDate?: string;
  unpublishTime?: string;
}

export interface AdminPageItem {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  lastUpdated: string;
  updatedBy: string;
  seoScore: number;
  seo: PageSeo;
  sections: PageSection[];
  // Approval & Workflow
  assignedReviewer?: string;
  submittedBy?: string;
  submittedAt?: string;
  reviewNotes?: string;
  reviewHistory?: ReviewActivityItem[];
  // Scheduling
  schedule?: SchedulePublishConfig;
  versionNumber?: number;
}

// --- PAGE TEMPLATES ---
export interface PageTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail?: string;
  sections: Array<{ type: SectionType; label: string; description: string }>;
  recommendedUse: string;
  isSystem: boolean;
  createdAt: string;
}

// --- GLOBAL REUSABLE BLOCKS ---
export interface GlobalBlock {
  id: string;
  name: string;
  description: string;
  category: "CTA" | "Trust & Social Proof" | "Services & Process" | "Brand & Team" | "Forms & Subscriptions";
  section: PageSection;
  usageCount: number;
  pagesUsing: Array<{ id: string; title: string; slug: string }>;
  updatedAt: string;
  isArchived?: boolean;
}

// --- REVISION COMPARISON ---
export interface PageVersion {
  versionId: string;
  versionNumber: number;
  pageId: string;
  createdAt: string;
  createdBy: string;
  changeSummary: string;
  snapshot: AdminPageItem;
}

export interface VersionDiff {
  category: "Added" | "Removed" | "Changed";
  entity: string; // e.g. "Page Title", "Section 2 (Hero)", "SEO Meta"
  field?: string;
  oldValue: unknown;
  newValue: unknown;
}

// --- ADVANCED SEO & ISSUES ---
export type SeoIssueSeverity = "Critical" | "Warning" | "Recommendation" | "Passed";
export type SeoIssueType =
  | "Missing Title"
  | "Duplicate Title"
  | "Missing Meta Description"
  | "Missing H1"
  | "Missing ALT Text"
  | "Noindex Page"
  | "Broken Internal Link"
  | "Orphan Page"
  | "Redirect Chain"
  | "Canonical Issue"
  | "Schema Issue";

export interface SeoIssue {
  id: string;
  pageTitle: string;
  slug: string;
  type: string;
  severity: string;
  recommendation: string;
}

export interface AdvancedSeoIssue {
  id: string;
  pageTitle: string;
  slug: string;
  pageType: "Page" | "Portfolio" | "Article" | "Location";
  type: SeoIssueType;
  severity: SeoIssueSeverity;
  status: "Open" | "Resolved" | "Ignored";
  recommendation: string;
  impactScore: number;
  targetUrl: string;
}

// --- MEDIA LIBRARY PHASE 2 ---
export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: "image" | "video" | "pdf";
  folder?: string; // "Brand", "Portfolio", "Services", "Team", etc.
  tags?: string[];
  altText: string;
  title: string;
  caption: string;
  dimensions?: string;
  fileSize: string;
  sizeBytes?: number;
  uploadedAt: string;
  createdBy?: string;
  usageCount: number;
  usedOnPages?: Array<{ title: string; url: string }>;
  optimization?: {
    webpUrl?: string;
    avifUrl?: string;
    originalSize: string;
    optimizedSize: string;
    savingsPercent: number;
  };
}

// --- LEAD CRM PHASE 2 ---
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "WON" | "LOST";
export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface LeadTask {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
}

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
  priority?: LeadPriority;
  assignedTo?: string;
  leadValue?: number;
  nextFollowUp?: string;
  tags?: string[];
  lastActivity?: string;
  notes: Array<{ id: string; author: string; text: string; date: string }>;
  tasks?: LeadTask[];
  attribution?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    landingPage?: string;
    referrer?: string;
    formName?: string;
  };
}

// --- ADMIN TASKS ---
export type AdminTaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type AdminTaskEntity = "Lead" | "Page" | "Portfolio" | "Article" | "System";

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  relatedEntity: AdminTaskEntity;
  entityTitle?: string;
  entityUrl?: string;
  assignee: string;
  dueDate: string;
  priority: LeadPriority;
  status: AdminTaskStatus;
  createdAt: string;
}

// --- NOTIFICATION CENTER ---
export type NotificationType =
  | "NEW_LEAD"
  | "PAGE_REVIEW"
  | "PAGE_APPROVED"
  | "PAGE_PUBLISHED"
  | "FORM_SUBMISSION"
  | "SYSTEM"
  | "SEO_WARNING";

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  timestamp: string;
  read: boolean;
  priority?: "low" | "medium" | "high";
  isDemo?: boolean;
}

// --- EMAIL TEMPLATES ---
export interface EmailTemplateItem {
  id: string;
  slug: string;
  name: string;
  subject: string;
  previewText: string;
  logoUrl?: string;
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText: string;
  variables: string[];
  updatedAt: string;
}

// --- FORM TEMPLATES & UX ---
export interface FormField {
  id: string;
  label: string;
  name: string;
  type: "Text" | "Email" | "Phone" | "Textarea" | "Dropdown" | "Checkbox" | "Radio" | "Date" | "File" | "Hidden";
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
  validation?: string;
  conditionalOn?: {
    field: string;
    equals: string;
  };
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormTemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "Lead Capture" | "Audit" | "Subscription" | "Support";
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
  isMultiStep?: boolean;
}

export interface FormItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  fields: FormField[];
  steps?: FormStep[];
  isMultiStep?: boolean;
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  sendEmailNotification?: boolean;
  createCrmLead?: boolean;
  submissionsCount: number;
  updatedAt: string;
}

// --- PORTFOLIO & PORTFOLIO TEMPLATES ---
export type ProjectStatus = "Draft" | "Published";
export type ProjectKind = "REAL PROJECT" | "PROTOTYPE" | "CONCEPT";

export interface PortfolioTemplateItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  recommendedSections: string[];
  sampleTechStack: string[];
}

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
  schedule?: SchedulePublishConfig;
}

// --- TEAM & ROLES ---
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

// --- NAVIGATION & HEADER / FOOTER ---
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
  buttonRadius: number;
  cardRadius: number;
  containerWidth: number;
  sectionSpacing: "Compact" | "Normal" | "Spacious";
}
