/**
 * Idempotent platform seed.
 *  1. Permissions + the six roles (always).
 *  2. Bootstrap Super Admin from BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD (only when that user does not exist; password never overwritten).
 *  3. Approved content migration (create-if-missing; admin edits are NEVER overwritten): header/navigation/footer/theme settings,
 *     forms, portfolio, insights articles, and one "built-in" page per static route so every route appears in the Page Builder.
 * No secrets are hard-coded: credentials come from the environment only.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { APPROVED_PROJECTS } from "../src/data/approved-projects";
import { CASE_STUDIES } from "../src/data/case-studies";
import { INSIGHT_ARTICLES } from "../src/lib/insights-data";
import { PHASE2_KEYS, PHASE2_PERMISSIONS, PHASE2_ROLE_GRANTS } from "../src/lib/rbac/phase2-permissions";
import { seedPhase2 } from "./seed-phase2";
import { DEFAULT_FOOTER, DEFAULT_HEADER, DEFAULT_NAVIGATION, DEFAULT_THEME_CONFIG } from "../src/lib/admin-client/defaults";

const prisma = new PrismaClient();

const V1_ALL = [
  "pages.view", "pages.create", "pages.edit", "pages.publish", "pages.delete",
  "portfolio.view", "portfolio.edit", "portfolio.publish", "articles.view", "articles.edit", "articles.publish",
  "seo.view", "seo.edit", "media.view", "media.upload", "media.delete", "forms.view", "forms.edit", "leads.view", "leads.edit",
  "users.view", "users.manage", "settings.view", "settings.manage", "audit.view",
];
const ALL = [...V1_ALL, ...PHASE2_KEYS];
const VIEW = V1_ALL.filter((p) => p.endsWith(".view") && !["users.view", "audit.view"].includes(p));
const ROLES: Record<string, { description: string; permissions: string[] }> = {
  SUPER_ADMIN: { description: "Unrestricted platform administrator", permissions: ALL },
  ADMINISTRATOR: { description: "Manages content, SEO, media, forms, leads and settings; cannot manage users", permissions: ALL.filter((p) => p !== "users.manage") },
  SEO_MANAGER: { description: "Search metadata, redirects and indexing", permissions: ["pages.view", "pages.edit", "seo.view", "seo.edit", "media.view", "portfolio.view", "articles.view", "articles.edit", "settings.view"] },
  CONTENT_EDITOR: { description: "Drafts pages, portfolio and articles; uploads media; cannot publish", permissions: ["pages.view", "pages.create", "pages.edit", "portfolio.view", "portfolio.edit", "articles.view", "articles.edit", "media.view", "media.upload", "forms.view", "seo.view"] },
  MARKETING_MANAGER: { description: "Leads, forms and Insights content", permissions: ["leads.view", "leads.edit", "forms.view", "forms.edit", "pages.view", "articles.view", "articles.edit", "articles.publish", "seo.view", "media.view", "media.upload"] },
  VIEWER: { description: "Read-only access to content", permissions: VIEW },
};
// Phase 2: merge the default Phase 2 grants into each role (SUPER_ADMIN/ADMINISTRATOR already hold ALL).
for (const [name, grants] of Object.entries(PHASE2_ROLE_GRANTS)) if (ROLES[name]) ROLES[name].permissions = [...new Set([...ROLES[name].permissions, ...grants])];

async function seedAccess() {
  // Phase 2 keys are part of the permission catalogue; descriptions come from the Phase 2 definition.
  for (const key of ALL) await prisma.permission.upsert({ where: { key }, update: {}, create: { key, ...(PHASE2_PERMISSIONS[key] ? { description: PHASE2_PERMISSIONS[key] } : {}) } });
  const perms = await prisma.permission.findMany();
  for (const [name, def] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({ where: { name }, update: { description: def.description }, create: { name, description: def.description } });
    // Additive only: grants are added, never revoked, so permissions an administrator configured (and the Phase 2 grants) survive every re-seed.
    await prisma.rolePermission.createMany({ data: perms.filter((p) => def.permissions.includes(p.key)).map((p) => ({ roleId: role.id, permissionId: p.id })), skipDuplicates: true });
  }
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password) return console.log("Roles and permissions seeded. (No BOOTSTRAP_ADMIN_* set: no admin created.)");
  if (password.length < 12) throw new Error("BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return console.log("Bootstrap admin already exists; password left unchanged.");
  const sa = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  await prisma.user.create({ data: { email, name: process.env.BOOTSTRAP_ADMIN_NAME || "Super Admin", passwordHash: await bcrypt.hash(password, 12), roles: { create: { roleId: sa.id } } } });
  console.log("Bootstrap Super Admin created. 2FA enrolment is required at first sign-in.");
}

const json = (v: unknown) => v as Prisma.InputJsonValue;
async function ensureGlobal(key: string, value: unknown) {
  if (!(await prisma.globalSetting.findUnique({ where: { key } }))) await prisma.globalSetting.create({ data: { key, value: json(value) } });
}

const title = (slug: string) => slug.split(/[-/]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const ROUTES: Array<[string, string, string]> = [
  ["/", "HOME", "Home"],
  ...["about", "contact", "services", "portfolio", "insights", "solutions"].map((s): [string, string, string] => [`/${s}`, "PAGE", title(s)]),
  ...["website-development", "custom-software-development", "mobile-app-development", "erp-development", "crm-development", "ecommerce-development", "ai-automation", "business-automation", "saas-development", "api-integration", "social-media-management", "content-creation", "video-editing", "digital-marketing", "performance-marketing", "lead-generation", "branding", "seo-services"]
    .map((s): [string, string, string] => [`/${s}`, "SERVICE", title(s)]),
  ...["baghpat", "baraut", "meerut", "ghaziabad", "noida", "greater-noida", "delhi-ncr", "western-up"].map((s): [string, string, string] => [`/${s}`, "LOCATION", title(s)]),
];

async function seedContent() {
  await ensureGlobal("navigation", DEFAULT_NAVIGATION);
  await ensureGlobal("header", DEFAULT_HEADER);
  await ensureGlobal("footer", DEFAULT_FOOTER);
  if (!(await prisma.themeSetting.findUnique({ where: { key: "theme" } }))) await prisma.themeSetting.create({ data: { key: "theme", value: json(DEFAULT_THEME_CONFIG) } });

  const forms: Array<{ slug: string; name: string; description: string; fields: Array<[string, string, "TEXT" | "EMAIL" | "PHONE" | "TEXTAREA", boolean]> }> = [
    { slug: "contact", name: "Contact enquiry", description: "Main contact form", fields: [["fullName", "Full name", "TEXT", true], ["email", "Email", "EMAIL", true], ["phone", "Phone", "PHONE", false], ["company", "Company", "TEXT", false], ["serviceInterested", "Service of interest", "TEXT", false], ["projectBudget", "Budget", "TEXT", false], ["message", "Message", "TEXTAREA", true]] },
    { slug: "newsletter", name: "Newsletter signup", description: "Footer newsletter", fields: [["email", "Email", "EMAIL", true]] },
    { slug: "free-digital-audit", name: "Free digital audit", description: "Request a free digital audit", fields: [["name", "Name", "TEXT", true], ["email", "Email", "EMAIL", true], ["phone", "Phone", "PHONE", false], ["company", "Website / company", "TEXT", false], ["message", "What would you like us to look at?", "TEXTAREA", false]] },
  ];
  for (const f of forms) {
    if (await prisma.form.findUnique({ where: { slug: f.slug } })) continue;
    await prisma.form.create({
      data: {
        slug: f.slug, name: f.name, settings: json({ description: f.description, submitButtonText: "Submit", successMessage: "Thank you — we'll be in touch shortly." }),
        fields: { create: f.fields.map(([name, label, type, required], i) => ({ name, label, type, required, order: i })) },
      },
    });
  }

  // publishedAt descends with list position so the approved order is preserved (newest-first listing).
  const stamp = (i: number) => new Date(Date.now() - i * 60_000);
  for (const [i, p] of APPROVED_PROJECTS.entries()) {
    const slug = p.href.startsWith("/work/") ? p.href.slice(6) : p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (await prisma.portfolioProject.findUnique({ where: { slug } })) continue;
    const cs = Object.values(CASE_STUDIES).find((c) => c.slug === slug);
    const cat = await prisma.portfolioCategory.upsert({ where: { slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") }, update: {}, create: { name: p.category, slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") } });
    await prisma.portfolioProject.create({
      data: {
        title: p.title, slug, status: "PUBLISHED", publishedAt: stamp(i), summary: p.description, categoryId: cat.id,
        content: json({
          projectType: p.statusType, industry: "", shortDescription: p.description, fullDescription: "", thumbnail: p.image, heroImage: "", gallery: [],
          technologies: cs?.technologies ?? [], services: [], problem: cs?.problem ?? [], solution: cs?.solution ?? [],
          features: cs?.features ?? [], architecture: (cs?.architecture ?? []).map((a) => ({ label: a.label, description: a.description ?? "" })),
          caseStudyUrl: p.href, clickBehaviour: p.href.startsWith("/work/") ? "Open Case Study" : "Custom URL",
        }),
      },
    });
  }

  for (const [i, a] of INSIGHT_ARTICLES.entries()) {
    if (await prisma.article.findUnique({ where: { slug: a.slug } })) continue;
    const cat = await prisma.articleCategory.upsert({ where: { slug: a.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") }, update: {}, create: { name: a.category, slug: a.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") } });
    await prisma.article.create({
      data: {
        title: a.title, slug: a.slug, status: "PUBLISHED", excerpt: a.excerpt, categoryId: cat.id, publishedAt: stamp(i),
        content: json({ body: a.contentHtml.join("\n\n"), authorName: a.author.name, authorRole: a.author.role, readTime: a.readTime, publishedLabel: a.publishedAt }),
      },
    });
  }

  for (const [slug, pageType, name] of ROUTES) {
    if (await prisma.page.findUnique({ where: { slug } })) continue;
    await prisma.page.create({
      data: {
        title: name, slug, pageType, status: "PUBLISHED", publishedAt: new Date(),
        sections: { create: [{ type: "builtIn", order: 0, enabled: true, content: json({ route: slug }) }] },
        seo: { create: {} },
      },
    });
  }
  console.log("Content migration complete (existing records untouched).");
}

async function main() {
  await seedAccess();
  if (process.env.SEED_CONTENT !== "false") await seedContent();
  await seedPhase2(prisma); // Phase 2 built-in templates (create-if-missing, never overwritten)
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
