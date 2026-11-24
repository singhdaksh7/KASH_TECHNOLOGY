import type { TemplateCategory } from "@prisma/client";

/** Section types the public renderer understands (mirrors the V1 section registry). */
export const SECTION_TYPES = [
  "hero", "richText", "imageText", "textImage", "servicesGrid", "portfolioGrid", "featuredProject", "cta", "faq", "stats", "trustStrip", "logoStrip",
  "founder", "team", "process", "video", "gallery", "contactForm", "pricing", "testimonials", "insightsFeed", "spacer", "customEmbed", "serviceShowcase", "agencyPillars", "builtIn",
] as const;

export interface TemplateSection { type: string; enabled?: boolean; content: Record<string, unknown>; style?: Record<string, unknown> | null }
export interface PageTemplateDefinition {
  pageType?: string;
  seo?: { title?: string; description?: string; robots?: string };
  sections: TemplateSection[];
}
export interface BuiltinPageTemplate { slug: string; name: string; description: string; category: TemplateCategory; definition: PageTemplateDefinition }

const hero = (heading: string, sub: string, cta = "Get in touch", href = "/contact"): TemplateSection => ({
  type: "hero", content: { heading, subheading: sub, primaryCta: cta, primaryCtaUrl: href },
});
const cta = (heading: string, label = "Talk to our team", href = "/contact"): TemplateSection => ({ type: "cta", content: { heading, body: "Tell us about your project and we'll reply within one working day.", primaryCta: label, primaryCtaUrl: href } });
const rich = (heading: string, body: string): TemplateSection => ({ type: "richText", content: { heading, body } });

export const BUILTIN_PAGE_TEMPLATES: BuiltinPageTemplate[] = [
  { slug: "blank-page", name: "Blank Page", category: "BLANK", description: "An empty page. Start from scratch in the page builder.", definition: { pageType: "STANDARD", sections: [] } },
  {
    slug: "service-page", name: "Service Page", category: "SERVICE", description: "Explains one service: overview, offering, process, proof and a call to action.",
    definition: { pageType: "SERVICE", seo: { title: "Service name | KASH Technology", description: "Describe the service and who it is for in one or two sentences." }, sections: [
      hero("Service headline", "One sentence on the outcome this service delivers."),
      rich("What we do", "Explain the service, who it is for, and the problem it solves."),
      { type: "serviceShowcase", content: { heading: "What's included", items: [] } },
      { type: "process", content: { heading: "How we work", steps: [] } },
      { type: "portfolioGrid", content: { heading: "Related work" } },
      { type: "faq", content: { heading: "Questions we hear often", items: [] } },
      cta("Ready to get started?"),
    ] },
  },
  {
    slug: "landing-page", name: "Landing Page", category: "LANDING_PAGE", description: "A focused conversion page: one message, proof, and an enquiry form.",
    definition: { pageType: "LANDING", seo: { title: "Offer headline | KASH Technology", description: "State the offer and the next step." }, sections: [
      hero("Offer headline", "The single promise of this page.", "Claim your free audit"),
      { type: "trustStrip", content: { items: [] } },
      { type: "stats", content: { items: [] } },
      { type: "testimonials", content: { heading: "What clients say", items: [] } },
      { type: "contactForm", content: { heading: "Get started", formSlug: "contact" } },
    ] },
  },
  {
    slug: "portfolio-case-study", name: "Portfolio Case Study", category: "PORTFOLIO", description: "Problem → solution → result layout for a client project.",
    definition: { pageType: "CASE_STUDY", seo: { title: "Project name — case study | KASH Technology", description: "How we helped a client achieve a measurable result." }, sections: [
      hero("Project name", "A one-line summary of the project and result.", "Start a similar project"),
      rich("The challenge", "Describe the client's problem."),
      { type: "imageText", content: { heading: "Our solution", body: "Describe what was built and why.", image: "", imageAlt: "" } },
      { type: "gallery", content: { heading: "Screens & visuals", images: [] } },
      { type: "stats", content: { heading: "Results", items: [] } },
      cta("Want results like these?"),
    ] },
  },
  {
    slug: "location-seo-page", name: "Location SEO Page", category: "LOCATION", description: "A local-intent page for a city or region you serve.",
    definition: { pageType: "LOCATION", seo: { title: "Digital agency in City | KASH Technology", description: "Websites, software and marketing for businesses in City." }, sections: [
      hero("Digital agency in City", "Local expertise for businesses in City and the surrounding area."),
      rich("Why businesses in City choose us", "Explain your local presence and relevant experience."),
      { type: "servicesGrid", content: { heading: "Services in City" } },
      { type: "faq", content: { heading: "Local questions", items: [] } },
      cta("Talk to a local expert"),
    ] },
  },
  {
    slug: "campaign-page", name: "Campaign Page", category: "CAMPAIGN", description: "A time-limited campaign page. Pair it with scheduled publish/unpublish dates.",
    definition: { pageType: "CAMPAIGN", seo: { title: "Campaign name | KASH Technology", description: "Campaign summary and offer.", robots: "index,follow" }, sections: [
      hero("Campaign headline", "What the offer is and when it ends.", "Claim the offer"),
      { type: "pricing", content: { heading: "The offer", plans: [] } },
      { type: "faq", content: { heading: "Offer details", items: [] } },
      { type: "contactForm", content: { heading: "Claim this offer", formSlug: "contact" } },
    ] },
  },
  {
    slug: "about-page", name: "About Page", category: "ABOUT", description: "Company story, founder, team and values.",
    definition: { pageType: "ABOUT", seo: { title: "About KASH Technology", description: "Who we are and how we work." }, sections: [
      hero("About us", "The story behind the company.", "Meet the team", "/contact"),
      rich("Our story", "Tell the story of the company."),
      { type: "founder", content: { heading: "Founder", name: "", role: "", bio: "" } },
      { type: "team", content: { heading: "The team", members: [] } },
      { type: "agencyPillars", content: { heading: "How we work", items: [] } },
      cta("Work with us"),
    ] },
  },
  {
    slug: "contact-page", name: "Contact Page", category: "CONTACT", description: "Contact details and an enquiry form.",
    definition: { pageType: "CONTACT", seo: { title: "Contact KASH Technology", description: "Talk to us about your project." }, sections: [
      hero("Contact us", "Tell us about your project.", "Send an enquiry", "#enquiry"),
      { type: "contactForm", content: { heading: "Send us a message", formSlug: "contact" } },
      { type: "faq", content: { heading: "Before you write", items: [] } },
    ] },
  },
];

// ── Form templates ──────────────────────────────────────────────────────────
export interface TemplateField {
  name: string; label: string; type: "TEXT" | "EMAIL" | "PHONE" | "TEXTAREA" | "SELECT" | "CHECKBOX" | "RADIO" | "DATE" | "FILE" | "HIDDEN";
  required?: boolean; options?: string[]; step?: number; section?: string; description?: string; conditionalRules?: unknown;
}
export interface FormTemplateDefinition { slug: string; settings?: Record<string, unknown>; successMessage?: string; successRedirectUrl?: string | null; createLead?: boolean; sendNotification?: boolean; fields: TemplateField[] }
export interface BuiltinFormTemplate { key: string; name: string; definition: FormTemplateDefinition }

const SERVICES = ["Website Development", "Custom Software", "Mobile App", "ERP / CRM", "Branding", "Digital Marketing", "Other"];
export const BUILTIN_FORM_TEMPLATES: BuiltinFormTemplate[] = [
  { key: "contact-form", name: "Contact Form", definition: { slug: "contact-form", successMessage: "Thank you — we'll be in touch shortly.", fields: [
    { name: "name", label: "Full name", type: "TEXT", required: true }, { name: "email", label: "Email", type: "EMAIL", required: true },
    { name: "phone", label: "Phone", type: "PHONE" }, { name: "message", label: "Message", type: "TEXTAREA", required: true } ] } },
  { key: "project-enquiry", name: "Project Enquiry", definition: { slug: "project-enquiry", successMessage: "Thanks! We'll review your project and reply within one working day.", settings: { multiStep: true, steps: ["About you", "Your project"] }, fields: [
    { name: "name", label: "Full name", type: "TEXT", required: true, step: 1, section: "About you" },
    { name: "email", label: "Email", type: "EMAIL", required: true, step: 1, section: "About you" },
    { name: "company", label: "Company", type: "TEXT", step: 1, section: "About you" },
    { name: "service", label: "What do you need?", type: "SELECT", required: true, options: SERVICES, step: 2, section: "Your project" },
    { name: "otherService", label: "Tell us more", type: "TEXT", step: 2, section: "Your project", conditionalRules: { action: "show", match: "all", conditions: [{ field: "service", operator: "equals", value: "Other" }] } },
    { name: "budget", label: "Budget range", type: "SELECT", options: ["Under ₹1 lakh", "₹1–5 lakh", "₹5–15 lakh", "₹15 lakh+"], step: 2, section: "Your project" },
    { name: "message", label: "Project details", type: "TEXTAREA", required: true, step: 2, section: "Your project" } ] } },
  { key: "free-digital-audit", name: "Free Digital Audit", definition: { slug: "free-digital-audit", successMessage: "We'll send your audit within 3 working days.", fields: [
    { name: "name", label: "Name", type: "TEXT", required: true }, { name: "email", label: "Email", type: "EMAIL", required: true },
    { name: "company", label: "Website / company", type: "TEXT", required: true }, { name: "message", label: "What should we look at?", type: "TEXTAREA" } ] } },
  { key: "request-quote", name: "Request Quote", definition: { slug: "request-quote", successMessage: "Thanks — a quote is on its way.", fields: [
    { name: "name", label: "Full name", type: "TEXT", required: true }, { name: "email", label: "Email", type: "EMAIL", required: true }, { name: "phone", label: "Phone", type: "PHONE", required: true },
    { name: "service", label: "Service", type: "SELECT", required: true, options: SERVICES }, { name: "timeline", label: "Timeline", type: "SELECT", options: ["ASAP", "1–3 months", "3–6 months", "Flexible"] },
    { name: "message", label: "Requirements", type: "TEXTAREA", required: true } ] } },
  { key: "newsletter", name: "Newsletter", definition: { slug: "newsletter", successMessage: "You're subscribed — thank you!", createLead: false, fields: [ { name: "email", label: "Email", type: "EMAIL", required: true } ] } },
  { key: "callback-request", name: "Callback Request", definition: { slug: "callback-request", successMessage: "We'll call you back soon.", fields: [
    { name: "name", label: "Name", type: "TEXT", required: true }, { name: "phone", label: "Phone", type: "PHONE", required: true },
    { name: "preferredTime", label: "Preferred time", type: "SELECT", options: ["Morning", "Afternoon", "Evening"] }, { name: "message", label: "Anything we should know?", type: "TEXTAREA" } ] } },
];

// ── Portfolio templates ─────────────────────────────────────────────────────
export interface PortfolioTemplateDefinition { summary?: string; content: Record<string, unknown> }
export interface BuiltinPortfolioTemplate { key: string; name: string; category: string; description: string; definition: PortfolioTemplateDefinition }
const caseStudy = (projectType: string, extra: Record<string, unknown> = {}) => ({
  projectType, industry: "", shortDescription: "", fullDescription: "", thumbnail: "", heroImage: "", gallery: [], technologies: [], services: [],
  problem: [], solution: [], features: [], architecture: [], results: [], caseStudyUrl: "", clickBehaviour: "Open Case Study", ...extra,
});
export const BUILTIN_PORTFOLIO_TEMPLATES: BuiltinPortfolioTemplate[] = [
  { key: "technology-project", name: "Technology Project", category: "Technology", description: "Custom software / platform build.", definition: { summary: "", content: caseStudy("Technology", { technologies: ["Next.js", "PostgreSQL"], architecture: [{ label: "Frontend", description: "" }, { label: "Backend", description: "" }, { label: "Data", description: "" }] }) } },
  { key: "mobile-app", name: "Mobile App", category: "Mobile App", description: "iOS / Android application.", definition: { summary: "", content: caseStudy("Mobile App", { platforms: ["iOS", "Android"], technologies: [] }) } },
  { key: "erp-crm", name: "ERP / CRM", category: "ERP / CRM", description: "Business-management system.", definition: { summary: "", content: caseStudy("ERP / CRM", { modules: [], integrations: [] }) } },
  { key: "website", name: "Website", category: "Website", description: "Marketing or e-commerce website.", definition: { summary: "", content: caseStudy("Website", { liveUrl: "", technologies: [] }) } },
  { key: "branding", name: "Branding", category: "Branding", description: "Identity and brand-system work.", definition: { summary: "", content: caseStudy("Branding", { deliverables: [] }) } },
  { key: "marketing-campaign", name: "Marketing Campaign", category: "Marketing", description: "Paid / organic campaign with measurable results.", definition: { summary: "", content: caseStudy("Marketing Campaign", { channels: [], kpis: [] }) } },
];
