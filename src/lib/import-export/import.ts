import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { RESERVED_FIRST_SEGMENTS, definitionSchema } from "@/lib/cms/templates";
import { slugify } from "@/lib/cms/portfolio-templates";
import { SLUG_RE } from "@/lib/cms/working-copy";
import { csvToObjects, isFormulaLike, restoreExported } from "./csv";

export type ImportKind = "pages" | "portfolio" | "leads";
const PERMISSION: Record<ImportKind, string> = { pages: "pages.create", portfolio: "portfolio.edit", leads: "leads.edit" };
const json = (v: unknown) => v as Prisma.InputJsonValue;
const MAX_PAGES = 200;

export interface ImportReport {
  kind: ImportKind;
  /** Hash of the exact payload + options that were validated. `execute` must present it. */
  digest: string;
  counts: { total: number; accepted: number; rejected: number; warnings: number };
  accepted: Array<{ row: number; summary: string }>;
  rejected: Array<{ row: number; summary: string; errors: string[] }>;
  warnings: Array<{ row: number; message: string }>;
}
interface Planned<T> { row: number; summary: string; data: T; errors: string[]; warnings: string[] }

export const digestOf = (kind: ImportKind, data: unknown, options: unknown) => createHash("sha256").update(JSON.stringify({ kind, data, options })).digest("hex");
const report = <T>(kind: ImportKind, digest: string, planned: Array<Planned<T>>): ImportReport => ({
  kind, digest,
  counts: { total: planned.length, accepted: planned.filter((p) => !p.errors.length).length, rejected: planned.filter((p) => p.errors.length).length, warnings: planned.reduce((n, p) => n + p.warnings.length, 0) },
  accepted: planned.filter((p) => !p.errors.length).map((p) => ({ row: p.row, summary: p.summary })),
  rejected: planned.filter((p) => p.errors.length).map((p) => ({ row: p.row, summary: p.summary, errors: p.errors })),
  warnings: planned.flatMap((p) => p.warnings.map((message) => ({ row: p.row, message }))),
});

/** CSV text cell → safe value. Formula-looking cells are neutralised (stored with a leading apostrophe) and reported. */
function safeCell(raw: string | undefined, warn: (m: string) => void, label: string): string {
  const v = restoreExported((raw ?? "").trim());
  if (isFormulaLike(v)) { warn(`${label} looked like a spreadsheet formula and was neutralised`); return `'${v}`; }
  return v;
}

// ── Pages (JSON) ───────────────────────────────────────────────────────────
const importedPage = z.object({
  title: z.string().trim().min(1).max(200), slug: z.string().max(200), pageType: z.string().max(50).optional(),
  seo: z.record(z.string(), z.unknown()).nullish(), sections: definitionSchema.shape.sections,
}).passthrough();

async function planPages(data: unknown): Promise<Array<Planned<z.infer<typeof importedPage>>>> {
  const list = (data as { pages?: unknown })?.pages;
  if (!Array.isArray(list)) throw new HttpError(400, "VALIDATION_ERROR", 'Expected JSON of the form { "pages": [...] }');
  if (list.length > MAX_PAGES) throw new HttpError(400, "VALIDATION_ERROR", `At most ${MAX_PAGES} pages can be imported at once`);
  const slugs = list.map((p) => (p && typeof p === "object" ? String((p as { slug?: unknown }).slug) : ""));
  const existing = new Set((await prisma.page.findMany({ where: { slug: { in: slugs } }, select: { slug: true } })).map((p) => p.slug));
  const seen = new Set<string>();
  return list.map((raw, i) => {
    const errors: string[] = [], warnings: string[] = [];
    const parsed = importedPage.safeParse(raw);
    if (!parsed.success) return { row: i + 1, summary: slugs[i] || "(invalid page)", data: raw as never, errors: parsed.error.issues.map((x) => `${x.path.join(".") || "page"}: ${x.message}`), warnings };
    const p = parsed.data;
    if (!SLUG_RE.test(p.slug) || p.slug.includes("//")) errors.push("Slug must start with '/' and use lowercase letters, numbers and dashes");
    else if (RESERVED_FIRST_SEGMENTS.includes(p.slug.split("/")[1])) errors.push("Slug is reserved by the application");
    if (existing.has(p.slug)) errors.push("A page with this slug already exists");
    if (seen.has(p.slug)) errors.push("Duplicate slug within the file");
    seen.add(p.slug);
    if (p.status && p.status !== "DRAFT") warnings.push(`Status "${String(p.status)}" ignored: imported pages are always created as DRAFT`);
    if (p.sections.some((s) => (s as { globalBlock?: unknown }).globalBlock)) warnings.push("Global-block links are not imported; those sections are created as independent copies");
    return { row: i + 1, summary: `${p.title} (${p.slug})`, data: p, errors, warnings };
  });
}

// ── Portfolio (CSV) ────────────────────────────────────────────────────────
interface ImportedProject { title: string; slug: string; summary: string | null; category: string | null; content: unknown }
async function planPortfolio(text: string): Promise<Array<Planned<ImportedProject>>> {
  const rows = csvToObjects(text);
  const slugs = rows.map((r) => r.slug?.trim() || slugify(r.title ?? ""));
  const existing = new Set((await prisma.portfolioProject.findMany({ where: { slug: { in: slugs } }, select: { slug: true } })).map((p) => p.slug));
  const seen = new Set<string>();
  return rows.map((r, i) => {
    const errors: string[] = [], warnings: string[] = [];
    const warn = (m: string) => warnings.push(m);
    const title = safeCell(r.title, warn, "title");
    const slug = slugs[i];
    if (!title) errors.push("title is required");
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push("slug is missing or invalid (lowercase letters, numbers, dashes)");
    if (existing.has(slug)) errors.push("A project with this slug already exists");
    if (seen.has(slug)) errors.push("Duplicate slug within the file");
    seen.add(slug);
    let content: unknown = null;
    if (r.content?.trim()) { try { content = JSON.parse(r.content); } catch { errors.push("content is not valid JSON"); } }
    if (r.status && r.status.toUpperCase() !== "DRAFT") warn(`status "${r.status}" ignored: imported projects are created as DRAFT`);
    return { row: i + 2, summary: `${title || "(untitled)"} (${slug || "?"})`, data: { title, slug, summary: safeCell(r.summary, warn, "summary") || null, category: safeCell(r.category, warn, "category") || null, content }, errors, warnings };
  });
}

// ── Leads (CSV) ────────────────────────────────────────────────────────────
const STATUS = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const;
const PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
interface ImportedLead { name: string | null; email: string | null; phone: string | null; company: string | null; service: string | null; message: string | null; status: (typeof STATUS)[number]; priority: (typeof PRIORITY)[number]; tags: string[]; estimatedValue: number | null }
async function planLeads(text: string, opts: { allowDuplicates?: boolean }): Promise<Array<Planned<ImportedLead>>> {
  const rows = csvToObjects(text);
  const emails = rows.map((r) => r.email?.trim().toLowerCase()).filter(Boolean);
  const existing = new Set((await prisma.lead.findMany({ where: { email: { in: emails, mode: "insensitive" }, deletedAt: null }, select: { email: true } })).map((l) => l.email?.toLowerCase()));
  const seen = new Set<string>();
  return rows.map((r, i) => {
    const errors: string[] = [], warnings: string[] = [];
    const warn = (m: string) => warnings.push(m);
    const f = (k: string) => safeCell(r[k], warn, k) || null;
    const email = f("email")?.toLowerCase() ?? null;
    const name = f("name");
    if (!name && !email) errors.push("name or email is required");
    if (email && !/^[^\s@']+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("email is not valid");
    if (email) {
      if (existing.has(email) && !opts.allowDuplicates) errors.push("A lead with this email already exists");
      else if (existing.has(email)) warnings.push("A lead with this email already exists");
      if (seen.has(email) && !opts.allowDuplicates) errors.push("Duplicate email within the file");
      seen.add(email);
    }
    const status = (r.status?.trim().toUpperCase() || "NEW") as ImportedLead["status"];
    const priority = (r.priority?.trim().toUpperCase() || "MEDIUM") as ImportedLead["priority"];
    if (!STATUS.includes(status)) errors.push(`status must be one of ${STATUS.join(", ")}`);
    if (!PRIORITY.includes(priority)) errors.push(`priority must be one of ${PRIORITY.join(", ")}`);
    let estimatedValue: number | null = null;
    if (r.estimatedvalue?.trim()) { estimatedValue = Number(r.estimatedvalue); if (!Number.isFinite(estimatedValue) || estimatedValue < 0 || estimatedValue > 1e9) { errors.push("estimatedValue must be a non-negative number"); estimatedValue = null; } }
    const tags = (r.tags ?? "").split(/[|;]/).map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 20);
    return { row: i + 2, summary: name ?? email ?? "(no name)", data: { name, email, phone: f("phone"), company: f("company"), service: f("service"), message: f("message"), status, priority, tags, estimatedValue }, errors, warnings };
  });
}

// ── Public entry points ────────────────────────────────────────────────────
export interface ImportRequest { kind: ImportKind; mode: "dry-run" | "execute"; data: unknown; digest?: string; skipRejected?: boolean; allowDuplicates?: boolean }

export async function runImport(actor: Actor, req: ImportRequest): Promise<ImportReport & { executed?: { created: number; skipped: number } }> {
  assertCan(actor, "import_export.use");
  assertCan(actor, PERMISSION[req.kind]);
  const csv = req.kind !== "pages";
  if (csv && typeof req.data !== "string") throw new HttpError(400, "VALIDATION_ERROR", "Provide the CSV file contents as a string in `data`");
  const options = { allowDuplicates: !!req.allowDuplicates };
  const digest = digestOf(req.kind, req.data, options);

  let planned: Array<Planned<never>>;
  try {
    planned = (req.kind === "pages" ? await planPages(req.data) : req.kind === "portfolio" ? await planPortfolio(req.data as string) : await planLeads(req.data as string, options)) as Array<Planned<never>>;
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(400, "VALIDATION_ERROR", e instanceof Error ? e.message : "Could not read the file");
  }
  const rep = report(req.kind, digest, planned);
  if (req.mode === "dry-run") return rep;

  // ── execute ──
  if (req.digest !== digest) throw new HttpError(409, "DIGEST_MISMATCH", "Run a dry-run on exactly this data first and pass its digest to execute", { expected: "digest of this payload" });
  if (rep.counts.rejected && !req.skipRejected) throw new HttpError(422, "HAS_REJECTED_ROWS", "Some rows were rejected. Fix them, or pass skipRejected=true to import only the accepted rows.", rep);
  const ok = planned.filter((p) => !p.errors.length);
  await prisma.$transaction(async (tx) => {
    for (const p of ok) {
      if (req.kind === "pages") {
        const d = p.data as z.infer<typeof importedPage>;
        const seo = (d.seo ?? {}) as Record<string, string | null>;
        const page = await tx.page.create({
          data: { title: d.title, slug: d.slug, pageType: d.pageType ?? "STANDARD", status: "DRAFT", createdById: actor.id, updatedById: actor.id,
            sections: { create: d.sections.map((s, i) => ({ type: s.type, order: i, enabled: s.enabled ?? true, content: json(s.content), style: s.style ? json(s.style) : Prisma.JsonNull })) },
            seo: { create: { title: seo.title ?? null, description: seo.description ?? null, canonicalUrl: seo.canonicalUrl ?? null, robots: seo.robots ?? null, ogImage: seo.ogImage ?? null } } },
        });
        await tx.pageVersion.create({ data: { pageId: page.id, version: 1, snapshot: json({ title: page.title, slug: page.slug, status: "DRAFT", pageType: page.pageType, sections: d.sections, seo }), createdById: actor.id, reason: "import" } });
      } else if (req.kind === "portfolio") {
        const d = p.data as ImportedProject;
        const category = d.category ? await tx.portfolioCategory.upsert({ where: { slug: slugify(d.category) }, update: {}, create: { name: d.category, slug: slugify(d.category) } }) : null;
        await tx.portfolioProject.create({ data: { title: d.title, slug: d.slug, status: "DRAFT", summary: d.summary, content: d.content == null ? Prisma.JsonNull : json(d.content), categoryId: category?.id } });
      } else {
        const d = p.data as ImportedLead;
        const now = new Date();
        const lead = await tx.lead.create({ data: { ...d, source: "import", lastActivityAt: now } });
        await tx.leadActivity.create({ data: { leadId: lead.id, type: "CREATED", actorId: actor.id, metadata: { via: "import" }, createdAt: now } });
      }
    }
    await auditTx(tx, { actorId: actor.id, action: "import.execute", entity: "Import", entityId: req.kind, metadata: { created: ok.length, skipped: planned.length - ok.length, digest } });
  });
  return { ...rep, executed: { created: ok.length, skipped: planned.length - ok.length } };
}
