/** Phase 2 permission keys and the default role mapping (pure data: used by the seed, the docs and the tests). */
export const PHASE2_PERMISSIONS: Record<string, string> = {
  "templates.view": "View page templates",
  "templates.manage": "Create, edit and delete page templates",
  "global_blocks.view": "View global blocks",
  "global_blocks.manage": "Create, edit, detach and delete global blocks",
  "content.submit_review": "Submit content for review",
  "content.review": "Review content and request changes",
  "content.approve": "Approve content (and fast-track publish)",
  "content.publish": "Publish and unpublish approved content",
  "content.schedule": "Schedule and cancel scheduled publishing",
  "seo.audit": "Run and view the SEO audit",
  "media.folders": "Manage media folders and move assets",
  "media.force_delete": "Delete media that is still in use",
  "leads.assign": "Assign leads to team members",
  "leads.manage_followup": "Set lead follow-up dates",
  "tasks.view": "View own tasks",
  "tasks.manage": "Create, edit and delete any task",
  "notifications.view": "View own notifications",
  "email_templates.view": "View email templates",
  "email_templates.manage": "Edit email templates",
  "email_settings.view": "View email delivery settings and status (never the API key)",
  "email_settings.manage": "Configure Resend, replace/remove the API key, send test emails",
  "email_logs.view": "View the email delivery log",
  "email.retry": "Retry failed transactional emails",
  "import_export.use": "Use CSV/JSON import and export",
  "search.use": "Use admin search",
};
export const PHASE2_KEYS = Object.keys(PHASE2_PERMISSIONS);

const everything = PHASE2_KEYS;
/** Grants are ADDED to existing roles (never removed). SUPER_ADMIN always receives everything. */
export const PHASE2_ROLE_GRANTS: Record<string, string[]> = {
  SUPER_ADMIN: everything,
  ADMINISTRATOR: everything,
  SEO_MANAGER: ["templates.view", "global_blocks.view", "content.submit_review", "content.review", "seo.audit", "notifications.view", "tasks.view", "search.use"],
  CONTENT_EDITOR: ["templates.view", "global_blocks.view", "content.submit_review", "media.folders", "notifications.view", "tasks.view", "search.use"],
  MARKETING_MANAGER: [
    "templates.view", "global_blocks.view", "content.submit_review", "content.review", "content.approve", "content.schedule", "media.folders",
    "leads.assign", "leads.manage_followup", "tasks.view", "tasks.manage", "notifications.view", "email_templates.view", "import_export.use", "search.use",
  ],
  VIEWER: ["templates.view", "global_blocks.view", "notifications.view", "search.use"],
};
