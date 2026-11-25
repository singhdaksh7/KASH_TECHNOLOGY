/** Built-in email templates (pure data; also used as the runtime fallback and by the seed). */
export interface TemplateDef { key: string; name: string; subject: string; body: string; variables: string[] }

export const EMAIL_TEMPLATE_DEFS: TemplateDef[] = [
  {
    // For the two lead emails the body is the editable MESSAGE copy; the branded layout (header, summary card, attribution, CTA, footer) is rendered around it.
    key: "lead_internal", name: "New enquiry (internal notification)",
    variables: ["name", "email", "phone", "company", "service", "budget", "message", "source", "utmSource", "utmMedium", "utmCampaign", "landingPage", "referrer", "submittedAt", "leadId", "adminUrl", "siteName"],
    subject: "New Project Enquiry — {{name}} | {{service}}",
    body: "A new enquiry just came in through kash-technology.com. Hit reply to respond to {{name}} directly.",
  },
  {
    key: "lead_confirmation", name: "Enquiry confirmation (to the visitor)", variables: ["name", "service", "serviceClause", "company", "siteName"],
    subject: "We Received Your Project Enquiry — {{siteName}}",
    body: "Thank you for reaching out to {{siteName}}.\n\nWe've received your enquiry{{serviceClause}}. A member of our team will review the details and get back to you as soon as possible.",
  },
  {
    key: "team_invite", name: "Team invitation", variables: ["inviteeName", "inviterName", "inviteUrl", "siteName"],
    subject: "{{inviterName}} invited you to the {{siteName}} admin",
    body: "Hi {{inviteeName}},\n\n{{inviterName}} has invited you to the {{siteName}} admin. Set up your account here:\n{{inviteUrl}}\n\nIf you were not expecting this, you can ignore this email.",
  },
  {
    key: "security_notice", name: "Security notice", variables: ["userName", "event", "time", "siteName"],
    subject: "Security notice for your {{siteName}} account",
    body: "Hi {{userName}},\n\n{{event}} at {{time}}.\n\nIf this was not you, change your password and contact an administrator immediately.",
  },
  {
    key: "page_approval", name: "Page approved", variables: ["pageTitle", "pageSlug", "reviewerNote", "adminUrl"],
    subject: "Approved: {{pageTitle}}",
    body: "Your page \"{{pageTitle}}\" ({{pageSlug}}) has been approved and is ready to publish.\n\nReviewer note: {{reviewerNote}}\n\nOpen in admin: {{adminUrl}}",
  },
  {
    key: "newsletter_confirmation", name: "Newsletter confirmation", variables: ["email", "siteName"],
    subject: "You're subscribed to {{siteName}} updates",
    body: "Thanks for subscribing with {{email}}.\n\nYou'll hear from {{siteName}} soon.",
  },
];
export const TEMPLATE_DEF_BY_KEY = new Map(EMAIL_TEMPLATE_DEFS.map((d) => [d.key, d]));


/** Pre-v2.2 default copy. A stored row still identical to this is treated as "never customised" and upgraded to the new default. */
export const LEGACY_DEFAULTS: Record<string, { subject: string; body: string }> = {
  lead_internal: {
    subject: "New website lead: {{name}}",
    body: "Name: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nCompany: {{company}}\nService: {{service}}\nSource: {{source}}\nLanding page: {{landingPage}}\n\n{{message}}\n\nView in admin: {{adminUrl}}",
  },
  lead_confirmation: { subject: "We received your enquiry", body: "Hi {{name}},\n\nThanks for contacting {{siteName}}. Our team will be in touch shortly.\n\n— {{siteName}}" },
};
export const isLegacyDefault = (key: string, row: { subject: string; body: string } | null | undefined) =>
  !!row && !!LEGACY_DEFAULTS[key] && row.subject === LEGACY_DEFAULTS[key].subject && row.body === LEGACY_DEFAULTS[key].body;
