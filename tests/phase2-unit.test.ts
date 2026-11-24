import test from "node:test";
import assert from "node:assert/strict";
import { canTransition, assertTransition, validateSchedule, TRANSITIONS, CONTENT_STATUSES } from "../src/lib/cms/workflow";
import { compareSnapshots } from "../src/lib/cms/diff";
import { runSeoAudit, analyzeRedirects, countH1, imagesMissingAlt, internalLinks, validCanonical, type AuditPage } from "../src/lib/cms/seo-audit";
import { renderTemplate, validateTemplateText, TemplateError, EMAIL_TEMPLATE_DEFS } from "../src/lib/email/templates";
import { toCsv, parseCsv, csvToObjects, neutralizeFormula, isFormulaLike, restoreExported } from "../src/lib/import-export/csv";
import { assertNoSecrets } from "../src/lib/import-export/export";
import { conditionalRulesSchema, validateFieldRules, fieldState, evaluationOrder } from "../src/lib/forms/rules";
import { validateFormConfig, fieldSchema, safeRedirectUrl } from "../src/lib/forms/config";
import { validateSubmission } from "../src/lib/forms/submissions";
import { BUILTIN_PAGE_TEMPLATES, BUILTIN_FORM_TEMPLATES, BUILTIN_PORTFOLIO_TEMPLATES, SECTION_TYPES } from "../src/lib/cms/builtin-templates";
import { definitionSchema } from "../src/lib/cms/templates";
import { formBaseSchema } from "../src/lib/forms/config";
import { PHASE2_KEYS, PHASE2_ROLE_GRANTS } from "../src/lib/rbac/phase2-permissions";
import { schedulerSecretMatches } from "../src/lib/cms/scheduler";
import { likePattern, depthOf, descendantIds, folderPath, subtreeHeight } from "../src/lib/cms/media";
import { digestOf } from "../src/lib/import-export/import";
import { actorFromSession, can, assertCan } from "../src/lib/rbac/actor";
import { resolveSections } from "../src/lib/cms/working-copy";

// ── Workflow ──
test("workflow: legal and illegal transitions", () => {
  assert.ok(canTransition("DRAFT", "IN_REVIEW"));
  assert.ok(canTransition("IN_REVIEW", "APPROVED"));
  assert.ok(canTransition("APPROVED", "SCHEDULED"));
  assert.ok(canTransition("SCHEDULED", "PUBLISHED"));
  assert.ok(!canTransition("DRAFT", "APPROVED"));
  assert.ok(!canTransition("DRAFT", "PUBLISHED"));
  assert.ok(!canTransition("IN_REVIEW", "PUBLISHED"));
  assert.ok(!canTransition("ARCHIVED", "PUBLISHED"));
  assert.ok(!canTransition("PUBLISHED", "APPROVED"));
  assert.throws(() => assertTransition("DRAFT", "PUBLISHED"), (e: { code?: string }) => e.code === "INVALID_TRANSITION");
});
test("workflow: fast-track only from DRAFT/CHANGES_REQUESTED to PUBLISHED/SCHEDULED", () => {
  assert.ok(canTransition("DRAFT", "PUBLISHED", { fastTrack: true }));
  assert.ok(canTransition("CHANGES_REQUESTED", "SCHEDULED", { fastTrack: true }));
  assert.ok(!canTransition("IN_REVIEW", "PUBLISHED", { fastTrack: true }));
  assert.ok(!canTransition("ARCHIVED", "PUBLISHED", { fastTrack: true }));
});
test("workflow: every status has an entry and targets are valid statuses", () => {
  for (const s of CONTENT_STATUSES) { assert.ok(TRANSITIONS[s]); for (const t of TRANSITIONS[s]) assert.ok(CONTENT_STATUSES.includes(t)); }
});
test("schedule validation", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  assert.equal(validateSchedule(new Date("2026-01-02"), null, now), null);
  assert.match(validateSchedule(new Date("2025-12-31"), null, now)!, /future/);
  assert.match(validateSchedule(new Date("2026-02-01"), new Date("2026-01-15"), now)!, /after/);
  assert.match(validateSchedule(null, new Date("2025-01-01"), now)!, /future/);
});

// ── Revision compare ──
const sec = (id: string, type: string, order: number, content: object = {}, extra: object = {}) => ({ id, type, order, enabled: true, content, style: null, ...extra });
test("compare: metadata, SEO, added/removed/changed sections, order", () => {
  const a = { title: "A", slug: "/a", status: "DRAFT", seo: { title: "T1" }, sections: [sec("1", "hero", 0, { heading: "Hi" }), sec("2", "cta", 1), sec("3", "faq", 2)] };
  const b = { title: "B", slug: "/a", status: "DRAFT", seo: { title: "T2", description: "d" }, sections: [sec("1", "hero", 0, { heading: "Hello" }), sec("3", "faq", 1), sec("4", "stats", 2)] };
  const d = compareSnapshots(a, b);
  assert.deepEqual(d.metadata.map((m) => m.field), ["title"]);
  assert.deepEqual(d.seo.map((m) => m.field), ["title", "description"]);
  assert.equal(d.sections.removed.length, 1); assert.equal(d.sections.removed[0].type, "cta");
  assert.equal(d.sections.added.length, 1); assert.equal(d.sections.added[0].type, "stats");
  assert.deepEqual(d.sections.changed.find((c) => c.id === "1")!.content, [{ path: "heading", from: "Hi", to: "Hello" }]);
  assert.equal(d.sections.orderChanged, false, "removing a section is not a reorder");
  assert.equal(d.identical, false);
});
test("compare: detects reorder, style and enabled changes; identical snapshots", () => {
  const a = { sections: [sec("1", "hero", 0), sec("2", "cta", 1)] };
  const b = { sections: [sec("2", "cta", 0, {}, { style: { bg: "x" } }), sec("1", "hero", 1, {}, { enabled: false })] };
  const d = compareSnapshots(a, b);
  assert.equal(d.sections.orderChanged, true);
  assert.deepEqual(d.sections.changed.find((c) => c.id === "2")!.style, [{ path: "(root)", from: null, to: { bg: "x" } }]);
  assert.deepEqual(d.sections.changed.find((c) => c.id === "1")!.enabled, { from: true, to: false });
  assert.equal(compareSnapshots(a, a).identical, true);
});
test("compare: pairs sections by type when ids differ (after a restore)", () => {
  const d = compareSnapshots({ sections: [sec("old", "hero", 0, { h: 1 })] }, { sections: [sec("new", "hero", 0, { h: 2 })] });
  assert.equal(d.sections.added.length + d.sections.removed.length, 0);
  assert.equal(d.sections.changed[0].content[0].path, "h");
});

// ── SEO audit ──
const page = (id: string, slug: string, over: Partial<AuditPage> = {}): AuditPage => ({
  id, title: id, slug, status: "PUBLISHED", seo: { title: `Title ${id}`, description: `Desc ${id}`, canonicalUrl: `https://x.test${slug}`, ogImage: "/uploads/a.png", structuredData: { "@type": "Thing" } },
  sections: [{ type: "hero", order: 0, enabled: true, content: { heading: "H" } }], ...over,
});
const audit = (pages: AuditPage[], extra: Partial<Parameters<typeof runSeoAudit>[0]> = {}) => runSeoAudit({ pages, redirects: [], media: [], navHrefs: ["/"], siteUrl: "https://x.test", ...extra });
const types = (r: ReturnType<typeof audit>) => r.issues.map((i) => i.type);

test("seo: clean page produces no issues and passed checks", () => {
  const r = audit([page("home", "/")]);
  assert.deepEqual(r.issues, []);
  assert.ok(r.summary.passed >= 10);
});
test("seo: missing/oversized/duplicate metadata", () => {
  const r = audit([
    page("a", "/a", { seo: { title: "", description: "" } }),
    page("b", "/b", { seo: { title: "Same", description: "Same d", canonicalUrl: "/b" } }),
    page("c", "/c", { seo: { title: "same", description: "same d", canonicalUrl: "/c" } }),
    page("d", "/d", { seo: { title: "x".repeat(70), description: "y".repeat(200), canonicalUrl: "/d" } }),
  ], { navHrefs: ["/a", "/b", "/c", "/d"] });
  const t = types(r);
  for (const x of ["MISSING_TITLE", "MISSING_META_DESCRIPTION", "DUPLICATE_TITLE", "DUPLICATE_META_DESCRIPTION", "TITLE_TOO_LONG", "DESCRIPTION_TOO_LONG"]) assert.ok(t.includes(x as never), x);
  assert.equal(r.issues.filter((i) => i.type === "DUPLICATE_TITLE").length, 2);
  assert.equal(r.issues.find((i) => i.type === "MISSING_TITLE")!.severity, "CRITICAL");
  assert.ok(r.issues.every((i) => i.id && i.entityId && i.message && i.recommendation && i.url));
});
test("seo: unpublished pages downgrade CRITICAL to WARNING", () => {
  const r = audit([page("a", "/a", { status: "DRAFT", seo: {} })]);
  assert.equal(r.issues.find((i) => i.type === "MISSING_TITLE")!.severity, "WARNING");
});
test("seo: H1 count, images without alt, canonical, noindex, og, schema", () => {
  assert.equal(countH1([{ type: "hero", order: 0, enabled: true, content: {} }, { type: "richText", order: 1, enabled: true, content: { body: "<h1>x</h1>" } }]), 2);
  assert.deepEqual(imagesMissingAlt([{ type: "gallery", order: 0, enabled: true, content: { items: [{ src: "/uploads/a.png" }, { src: "/uploads/b.png", alt: "ok" }], html: '<img src="/x.jpg">' } }]).sort(), ["/uploads/a.png", "/x.jpg"]);
  assert.equal(validCanonical("ftp://x").ok, false);
  assert.equal(validCanonical("https://other.test/a", "x.test").ok, false);
  assert.equal(validCanonical("/ok").ok, true);
  const r = audit([page("a", "/a", { seo: { robots: "noindex,follow", title: "t", description: "d", canonicalUrl: "bad url" }, sections: [] })], { navHrefs: ["/a"] });
  const t = types(r);
  for (const x of ["MISSING_H1", "NOINDEX", "INVALID_CANONICAL", "MISSING_OG_IMAGE", "MISSING_SCHEMA"]) assert.ok(t.includes(x as never), x);
});
test("seo: broken internal links and orphan pages", () => {
  assert.deepEqual(internalLinks([{ type: "cta", order: 0, enabled: true, content: { primaryCtaUrl: "/gone?x=1#h", other: "https://ext.test/z", mail: "mailto:a@b.c", file: "/uploads/f.pdf" } }]), ["/gone"]);
  const r = audit([
    page("home", "/", { sections: [{ type: "cta", order: 0, enabled: true, content: { primaryCtaUrl: "/gone", href: "/linked" } }, { type: "hero", order: 1, enabled: true, content: {} }] }),
    page("linked", "/linked"), page("orphan", "/orphan"),
  ]);
  const broken = r.issues.find((i) => i.type === "BROKEN_INTERNAL_LINK")!;
  assert.match(broken.message, /\/gone/); assert.doesNotMatch(broken.message, /\/linked/);
  assert.deepEqual(r.issues.filter((i) => i.type === "ORPHAN_PAGE").map((i) => i.entityId), ["orphan"]);
});
test("seo: orphan check is skipped (and says so) without navigation data", () => {
  const r = audit([page("home", "/"), page("x", "/x")], { navHrefs: [] });
  assert.ok(!types(r).includes("ORPHAN_PAGE")); assert.ok(r.notes.some((n) => /Orphan/.test(n)));
});
test("seo: redirect chains and loops", () => {
  const mk = (s: string, d: string, i: string) => ({ id: i, sourcePath: s, destination: d, active: true });
  const m = analyzeRedirects([mk("/a", "/b", "1"), mk("/b", "/c", "2"), mk("/x", "/y", "3"), mk("/y", "/x", "4"), mk("/ok", "/page", "5")]);
  assert.equal(m.get("/a")!.kind, "chain"); assert.deepEqual(m.get("/a")!.path, ["/a", "/b", "/c"]);
  assert.equal(m.get("/x")!.kind, "loop"); assert.equal(m.get("/y")!.kind, "loop");
  assert.ok(!m.has("/ok"));
  const r = audit([page("home", "/")], { redirects: [mk("/x", "/y", "3"), mk("/y", "/x", "4")] });
  assert.equal(r.issues.filter((i) => i.type === "REDIRECT_LOOP").length, 2);
  assert.equal(r.issues[0].severity, "CRITICAL");
});
test("seo: media without alt is reported", () => {
  const r = audit([page("home", "/")], { media: [{ id: "m1", filename: "a.png", publicUrl: "/uploads/a.png", alt: "" }] });
  assert.equal(r.issues[0].entityType, "MediaAsset");
});

// ── Email templates ──
test("email: merge variables render and unknown variables are rejected", () => {
  assert.equal(renderTemplate("Hi {{ name }}, {{service}}", { name: "Ana", service: "SEO" }, ["name", "service"]), "Hi Ana, SEO");
  assert.throws(() => renderTemplate("{{secret}}", { secret: "x" }, ["name"]), TemplateError);
  assert.throws(() => renderTemplate("{{name.constructor}}", {}, ["name"]), TemplateError);
  assert.throws(() => renderTemplate("{{#if name}}x{{/if}}", {}, ["name"]), TemplateError);
  assert.throws(() => renderTemplate("{{ process.env.X }}", {}, ["name"]), TemplateError);
  assert.deepEqual(validateTemplateText("ok {{name}}", ["name"]), []);
  assert.ok(validateTemplateText("{{ a }} {{", ["a"]).length > 0);
});
test("email: subject values cannot inject headers; values are not re-interpreted", () => {
  assert.equal(renderTemplate("S: {{name}}", { name: "a\r\nBcc: x" }, ["name"], { singleLine: true }), "S: a Bcc: x");
  assert.equal(renderTemplate("{{name}}", { name: "{{secret}}" }, ["name"]), "{{secret}}");
});
test("email: every built-in template is valid against its own allow-list", () => {
  for (const d of EMAIL_TEMPLATE_DEFS) { assert.deepEqual(validateTemplateText(d.subject, d.variables), [], d.key); assert.deepEqual(validateTemplateText(d.body, d.variables), [], d.key); }
  assert.deepEqual(EMAIL_TEMPLATE_DEFS.map((d) => d.key).sort(), ["lead_confirmation", "lead_internal", "newsletter_confirmation", "page_approval", "security_notice", "team_invite"]);
});

// ── CSV ──
test("csv: formula injection is neutralised on export and restored on import", () => {
  for (const bad of ["=1+1", "@SUM(A1)", "+cmd|' /C calc'!A0", "-2+3", "\tx", "=HYPERLINK(\"http://e\")"]) { assert.ok(isFormulaLike(bad), bad); assert.ok(neutralizeFormula(bad).startsWith("'")); }
  for (const fine of ["+91 98765 43210", "-12", "hello", "(555) 123-4567"]) assert.equal(isFormulaLike(fine), false, fine);
  assert.equal(restoreExported("'=1+1"), "=1+1");
  const csv = toCsv(["a", "b"], [["=1+1", 'say "hi", ok'], [5, null]]);
  assert.equal(csv, "a,b\r\n'=1+1,\"say \"\"hi\"\", ok\"\r\n5,\r\n");
  assert.deepEqual(parseCsv(csv), [["a", "b"], ["'=1+1", 'say "hi", ok'], ["5", ""]]);
});
test("csv: parser handles quotes, newlines, BOM and rejects unterminated quotes", () => {
  assert.deepEqual(csvToObjects('﻿Name,Note\r\n"A","line1\nline2"\r\n'), [{ name: "A", note: "line1\nline2" }]);
  assert.throws(() => parseCsv('a,"b'));
});
test("export never contains secret-looking keys", () => {
  assert.doesNotThrow(() => assertNoSecrets({ pages: [{ title: "x", sections: [{ content: { a: 1 } }] }] }));
  for (const k of ["passwordHash", "tokenHash", "encryptedSecret", "codeHash", "sessions", "recoveryCodes"]) assert.throws(() => assertNoSecrets({ a: [{ [k]: 1 }] }), /forbidden/, k);
});
test("import digest is deterministic and payload-sensitive", () => {
  assert.equal(digestOf("leads", "a", {}), digestOf("leads", "a", {}));
  assert.notEqual(digestOf("leads", "a", {}), digestOf("leads", "b", {}));
  assert.notEqual(digestOf("leads", "a", {}), digestOf("pages", "a", {}));
});

// ── Forms ──
const R = (o: object) => conditionalRulesSchema.parse(o);
test("forms: conditional rules schema accepts data only and rejects code-like input", () => {
  assert.ok(conditionalRulesSchema.safeParse({ action: "show", conditions: [{ field: "a", operator: "equals", value: "x" }] }).success);
  assert.equal(conditionalRulesSchema.safeParse({ action: "show", conditions: [{ field: "a", operator: "eval", value: "1" }] }).success, false);
  assert.equal(conditionalRulesSchema.safeParse({ action: "show", js: "alert(1)", conditions: [{ field: "a", operator: "equals", value: "x" }] }).success, false);
  assert.equal(conditionalRulesSchema.safeParse({ action: "show", conditions: [{ field: "a b", operator: "equals", value: "x" }] }).success, false);
  assert.equal(conditionalRulesSchema.safeParse({ action: "show", conditions: [{ field: "a", operator: "equals" }] }).success, false);
});
test("forms: rule validation finds unknown refs, self refs and cycles", () => {
  const rule = (f: string) => ({ action: "show", conditions: [{ field: f, operator: "is_not_empty" }] });
  assert.deepEqual(validateFieldRules([{ name: "a" }, { name: "b", conditionalRules: rule("a") }]), []);
  assert.ok(validateFieldRules([{ name: "b", conditionalRules: rule("zzz") }])[0].includes("unknown"));
  assert.ok(validateFieldRules([{ name: "b", conditionalRules: rule("b") }])[0].includes("itself"));
  assert.ok(validateFieldRules([{ name: "a", conditionalRules: rule("b") }, { name: "b", conditionalRules: rule("a") }]).some((e) => e.includes("Circular")));
});
test("forms: field visibility and rule-required evaluation", () => {
  assert.deepEqual(fieldState(R({ action: "show", conditions: [{ field: "s", operator: "equals", value: "Other" }] }), { s: "Other" }), { visible: true, requiredByRule: false });
  assert.equal(fieldState(R({ action: "show", conditions: [{ field: "s", operator: "equals", value: "Other" }] }), { s: "x" }).visible, false);
  assert.equal(fieldState(R({ action: "hide", conditions: [{ field: "s", operator: "is_empty" }] }), {}).visible, false);
  assert.equal(fieldState(R({ action: "require", match: "any", conditions: [{ field: "a", operator: "contains", value: "z" }, { field: "b", operator: "greater_than", value: 5 }] }), { b: 9 }).requiredByRule, true);
  assert.deepEqual(evaluationOrder([{ name: "b", conditionalRules: { action: "show", conditions: [{ field: "a", operator: "is_empty" }] } }, { name: "a" }]).map((f) => f.name), ["a", "b"]);
});
test("forms: submission validation honours rules (hidden ignored, rule-required enforced)", () => {
  const fields = [
    { name: "service", type: "SELECT", required: true, options: ["Web", "Other"], conditionalRules: null },
    { name: "other", type: "TEXT", required: true, options: null, conditionalRules: { action: "show", conditions: [{ field: "service", operator: "equals", value: "Other" }] } },
    { name: "email", type: "EMAIL", required: false, options: null, conditionalRules: { action: "require", conditions: [{ field: "service", operator: "equals", value: "Web" }] } },
  ];
  assert.deepEqual(validateSubmission(fields, { service: "Web", other: "ignored", email: "a@b.co" }), { service: "Web", email: "a@b.co" });
  assert.throws(() => validateSubmission(fields, { service: "Web" }), /REQUIRED:email/);
  assert.throws(() => validateSubmission(fields, { service: "Other" }), /REQUIRED:other/);
  assert.throws(() => validateSubmission(fields, { service: "Nope" }), /INVALID:service/);
  assert.throws(() => validateSubmission(fields, { service: "Other", other: "x", email: "bad" }), /INVALID:email/);
});
test("forms: config validation (steps, options, redirect safety)", () => {
  const f = (o: object) => fieldSchema.parse({ name: "n", label: "L", type: "TEXT", ...o });
  assert.deepEqual(validateFormConfig({ fields: [f({ step: 1 }), f({ name: "m", step: 2 })], settings: { multiStep: true, steps: ["A", "B"] } }), []);
  assert.ok(validateFormConfig({ fields: [f({ step: 1 }), f({ name: "m", step: 3 })] }).some((e) => /gaps/.test(e)));
  assert.ok(validateFormConfig({ fields: [f({ type: "SELECT" })] }).some((e) => /option/.test(e)));
  assert.ok(validateFormConfig({ fields: [f({}), f({})] }).some((e) => /Duplicate/.test(e)));
  assert.ok(safeRedirectUrl.safeParse("/thanks").success); assert.ok(safeRedirectUrl.safeParse("https://a.test/x").success);
  for (const bad of ["javascript:alert(1)", "//evil.test", "http://a.test", "data:text/html,x"]) assert.equal(safeRedirectUrl.safeParse(bad).success, false, bad);
});

// ── Built-in templates ──
test("built-in templates are valid", () => {
  assert.deepEqual(BUILTIN_PAGE_TEMPLATES.map((t) => t.name), ["Blank Page", "Service Page", "Landing Page", "Portfolio Case Study", "Location SEO Page", "Campaign Page", "About Page", "Contact Page"]);
  for (const t of BUILTIN_PAGE_TEMPLATES) { assert.ok(definitionSchema.safeParse(t.definition).success, t.slug); for (const s of t.definition.sections) assert.ok((SECTION_TYPES as readonly string[]).includes(s.type), `${t.slug}:${s.type}`); }
  assert.deepEqual(BUILTIN_FORM_TEMPLATES.map((t) => t.name), ["Contact Form", "Project Enquiry", "Free Digital Audit", "Request Quote", "Newsletter", "Callback Request"]);
  for (const t of BUILTIN_FORM_TEMPLATES) {
    const d = t.definition;
    const p = formBaseSchema.safeParse({ name: t.name, slug: d.slug, settings: d.settings, fields: d.fields.map((f) => ({ ...f, required: f.required ?? false, step: f.step ?? 1 })) });
    assert.ok(p.success, t.key); assert.deepEqual(validateFormConfig(p.data!), [], t.key);
  }
  assert.deepEqual(BUILTIN_PORTFOLIO_TEMPLATES.map((t) => t.name), ["Technology Project", "Mobile App", "ERP / CRM", "Website", "Branding", "Marketing Campaign"]);
});

// ── Permissions / actor ──
test("phase 2 permissions: all required keys exist; role grants only use known keys; viewers cannot manage", () => {
  for (const k of ["templates.view", "templates.manage", "global_blocks.view", "global_blocks.manage", "content.submit_review", "content.review", "content.approve", "content.schedule", "seo.audit", "media.folders", "media.force_delete", "leads.assign", "leads.manage_followup", "tasks.view", "tasks.manage", "notifications.view", "email_templates.view", "email_templates.manage", "import_export.use", "search.use"]) assert.ok(PHASE2_KEYS.includes(k), k);
  for (const [role, g] of Object.entries(PHASE2_ROLE_GRANTS)) for (const k of g) assert.ok(PHASE2_KEYS.includes(k), `${role}:${k}`);
  assert.ok(!PHASE2_ROLE_GRANTS.VIEWER.some((k) => /manage|approve|publish|force|assign/.test(k)));
  assert.ok(!PHASE2_ROLE_GRANTS.CONTENT_EDITOR.includes("content.publish"));
  assert.ok(!PHASE2_ROLE_GRANTS.MARKETING_MANAGER.includes("media.force_delete"));
  assert.equal(new Set(PHASE2_KEYS).size, PHASE2_KEYS.length);
});
test("actor: super admin bypass and permission checks", () => {
  const mk = (name: string, keys: string[]) => actorFromSession({ userId: "u", user: { roles: [{ role: { name, permissions: keys.map((key) => ({ permission: { key } })) } }] } });
  assert.ok(can(mk("SUPER_ADMIN", []), "anything"));
  const a = mk("EDITOR", ["tasks.view"]);
  assert.ok(can(a, "tasks.view")); assert.ok(!can(a, "tasks.manage"));
  assert.throws(() => assertCan(a, "tasks.manage"), (e: { status?: number }) => e.status === 403);
});

// ── Misc helpers ──
test("scheduler secret comparison", () => {
  assert.equal(schedulerSecretMatches("abc", "abc"), true);
  assert.equal(schedulerSecretMatches("abd", "abc"), false);
  assert.equal(schedulerSecretMatches("abc", undefined), false);
  assert.equal(schedulerSecretMatches(null, "abc"), false);
  assert.equal(schedulerSecretMatches("abcd", "abc"), false);
});
test("media helpers: LIKE escaping and folder tree maths", () => {
  assert.equal(likePattern("/uploads/a_b%c.png"), "%/uploads/a\\_b\\%c.png%");
  const all = [{ id: "a", name: "A", parentId: null }, { id: "b", name: "B", parentId: "a" }, { id: "c", name: "C", parentId: "b" }];
  assert.deepEqual(folderPath(all, "c"), ["A", "B", "C"]); assert.equal(depthOf(all, "c"), 3);
  assert.deepEqual([...descendantIds(all, "a")].sort(), ["b", "c"]); assert.equal(subtreeHeight(all, "a"), 3);
});
test("global blocks: linked sections inherit, unlinked unchanged", () => {
  const blocks = new Map([["b1", { id: "b1", type: "cta", content: { t: "block" }, style: { s: 1 } }]]);
  const out = resolveSections([{ type: "x", content: {}, style: null, globalBlockId: "b1" }, { type: "hero", content: { a: 1 }, style: null, globalBlockId: null }], blocks);
  assert.deepEqual(out[0], { type: "cta", content: { t: "block" }, style: { s: 1 }, globalBlockId: "b1" });
  assert.equal(out[1].type, "hero");
});
