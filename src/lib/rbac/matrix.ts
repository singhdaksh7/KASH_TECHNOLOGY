export interface PermissionGroup {
  name: string;
  key: string;
  permissions: {
    key: string;
    description: string;
  }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: "Content",
    key: "content",
    permissions: [
      { key: "pages.view", description: "View pages and layouts" },
      { key: "pages.create", description: "Create new page drafts" },
      { key: "pages.edit", description: "Edit page content and sections" },
      { key: "pages.publish", description: "Publish or unpublish pages" },
      { key: "pages.delete", description: "Delete pages" },
      { key: "content.submit_review", description: "Submit content for review" },
      { key: "content.review", description: "Review and request changes" },
      { key: "content.approve", description: "Approve content for publishing" },
      { key: "content.publish", description: "Execute publishing workflow" },
      { key: "content.schedule", description: "Schedule and manage future publishing" },
      { key: "templates.view", description: "View page templates" },
      { key: "templates.manage", description: "Create, edit and delete templates" },
      { key: "global_blocks.view", description: "View global blocks" },
      { key: "global_blocks.manage", description: "Create, edit and link global blocks" },
      { key: "portfolio.view", description: "View portfolio projects" },
      { key: "portfolio.edit", description: "Edit portfolio projects" },
      { key: "portfolio.publish", description: "Publish portfolio projects" },
      { key: "articles.view", description: "View insights and articles" },
      { key: "articles.edit", description: "Edit insights and articles" },
      { key: "articles.publish", description: "Publish insights and articles" },
      { key: "showcase.view", description: "View client showcase, reviews and logos" },
      { key: "showcase.manage", description: "Manage clients, reviews, logos and showcase settings" },
    ],
  },
  {
    name: "Design & Theme",
    key: "design",
    permissions: [
      { key: "settings.view", description: "View design, navigation and site settings" },
      { key: "settings.manage", description: "Update navigation, theme, and site configurations" },
    ],
  },
  {
    name: "SEO",
    key: "seo",
    permissions: [
      { key: "seo.view", description: "View SEO scores and issues" },
      { key: "seo.edit", description: "Update meta tags, canonicals and social cards" },
      { key: "seo.audit", description: "Run and view full-site SEO audits" },
    ],
  },
  {
    name: "Leads & CRM",
    key: "leads",
    permissions: [
      { key: "leads.view", description: "View inbound project leads" },
      { key: "leads.edit", description: "Update lead status and add notes" },
      { key: "leads.assign", description: "Assign leads to team members" },
      { key: "leads.manage_followup", description: "Schedule follow-up dates and tasks" },
    ],
  },
  {
    name: "Forms",
    key: "forms",
    permissions: [
      { key: "forms.view", description: "View contact forms and submissions" },
      { key: "forms.edit", description: "Edit form fields, rules and workflows" },
    ],
  },
  {
    name: "Media",
    key: "media",
    permissions: [
      { key: "media.view", description: "Browse assets in the media library" },
      { key: "media.upload", description: "Upload new media assets" },
      { key: "media.folders", description: "Create and organise folders" },
      { key: "media.delete", description: "Delete unused media assets" },
      { key: "media.force_delete", description: "Force delete media currently in use (privileged)" },
    ],
  },
  {
    name: "Email",
    key: "email",
    permissions: [
      { key: "email_templates.view", description: "View transactional email templates" },
      { key: "email_templates.manage", description: "Edit email subjects, bodies and variables" },
    ],
  },
  {
    name: "Users & Team",
    key: "users",
    permissions: [
      { key: "users.view", description: "View team members and role assignments" },
      { key: "users.manage", description: "Invite, update roles and toggle member access" },
    ],
  },
  {
    name: "Audit & Security",
    key: "audit",
    permissions: [
      { key: "audit.view", description: "Inspect administrative audit logs" },
    ],
  },
  {
    name: "Operations & Tools",
    key: "tools",
    permissions: [
      { key: "tasks.view", description: "View assigned operational tasks" },
      { key: "tasks.manage", description: "Create, assign and update any task" },
      { key: "notifications.view", description: "Receive and manage administrative alerts" },
      { key: "import_export.use", description: "Export/import CMS content and leads" },
      { key: "search.use", description: "Search across admin entities" },
    ],
  },
];
