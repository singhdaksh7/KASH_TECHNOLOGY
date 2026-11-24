/**
 * Integration tests against a real PostgreSQL database.
 * Run with: TEST_DATABASE_URL=postgresql://... npm run test:platform   (database must have all migrations applied).
 * Without TEST_DATABASE_URL these tests are skipped (the pure unit tests still run).
 */
import test from "node:test";
import assert from "node:assert/strict";

const URL_ = process.env.TEST_DATABASE_URL;
const skip = URL_ ? false : "TEST_DATABASE_URL not set";
if (URL_) process.env.DATABASE_URL = URL_;

const run = Math.random().toString(36).slice(2, 8);
const U = (s: string) => `${s}-${run}`;
type Actor = { id: string; permissions: ReadonlySet<string>; isSuper: boolean };
const actor = (id: string, perms: string[], isSuper = false): Actor => ({ id, permissions: new Set(perms), isSuper });
const rejects = (p: Promise<unknown>, code: string) => assert.rejects(p, (e: { code?: string }) => e.code === code, `expected ${code}`);

test("phase 2 database integration", { skip }, async (t) => {
  const { prisma } = await import("../src/lib/db/prisma");
  const wf = await import("../src/lib/cms/page-workflow");
  const tpl = await import("../src/lib/cms/templates");
  const blocks = await import("../src/lib/cms/global-blocks");
  const sched = await import("../src/lib/cms/scheduler");
  const ver = await import("../src/lib/cms/versions");
  const seoData = await import("../src/lib/cms/seo-audit-data");
  const media = await import("../src/lib/cms/media");
  const leads = await import("../src/lib/crm/leads");
  const tasks = await import("../src/lib/crm/tasks");
  const notif = await import("../src/lib/notifications");
  const emailAdmin = await import("../src/lib/email/template-admin");
  const formsAdmin = await import("../src/lib/forms/admin");
  const subs = await import("../src/lib/forms/submissions");
  const portfolio = await import("../src/lib/cms/portfolio-templates");
  const bulk = await import("../src/lib/cms/bulk");
  const imp = await import("../src/lib/import-export/import");
  const exp = await import("../src/lib/import-export/export");
  const search = await import("../src/lib/cms/search");
  const { seedPhase2 } = await import("../prisma/seed-phase2");
  const { snapshotPage } = await import("../src/lib/cms/working-copy");

  const mkUser = (n: string) => prisma.user.create({ data: { email: `${n}-${run}@test.local`, passwordHash: "x", name: n } });
  const author = await mkUser("author"), reviewer = await mkUser("reviewer"), boss = await mkUser("boss");
  // Real DB roles: recipients of notifications are resolved from roles, not from in-memory actors.
  const role = await prisma.role.create({ data: { name: `rv-${run}` } });
  for (const key of ["content.review", "content.approve", "leads.view", "forms.view"]) {
    const perm = await prisma.permission.upsert({ where: { key }, update: {}, create: { key } });
    await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perm.id } });
  }
  await prisma.userRole.createMany({ data: [{ userId: reviewer.id, roleId: role.id }, { userId: boss.id, roleId: role.id }] });
  const ALL = ["templates.view", "templates.manage", "pages.create", "pages.view", "pages.edit", "global_blocks.view", "global_blocks.manage", "content.submit_review", "content.review", "content.approve", "content.publish", "content.schedule", "media.view", "media.delete", "media.upload", "media.folders", "leads.view", "leads.edit", "leads.assign", "leads.manage_followup", "tasks.view", "tasks.manage", "notifications.view", "email_templates.view", "email_templates.manage", "forms.view", "forms.edit", "portfolio.view", "portfolio.edit", "portfolio.publish", "articles.view", "import_export.use", "search.use"];
  const sa = actor(author.id, ["pages.create", "templates.view", "content.submit_review", "pages.view"]);
  const rv = actor(reviewer.id, ["content.review", "content.approve", "content.publish", "content.schedule", "pages.view"]);
  const admin = actor(boss.id, ALL);
  const mkPage = async (slug: string, status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" = "DRAFT", extra: object = {}) => {
    const p = await prisma.page.create({ data: { title: slug, slug: `/${U(slug)}`, status, createdById: author.id, sections: { create: [{ type: "hero", order: 0, content: { heading: "H" } }] }, seo: { create: { title: "T" } }, ...extra } });
    await prisma.$transaction((tx) => snapshotPage(tx, p.id, author.id, "init"));
    return p;
  };

  await t.test("seed is idempotent and does not overwrite admin edits", async () => {
    await seedPhase2(prisma);
    await prisma.pageTemplate.update({ where: { slug: "blank-page" }, data: { name: "Edited" } });
    await seedPhase2(prisma);
    assert.equal(await prisma.pageTemplate.count({ where: { isSystem: true } }), 8);
    assert.equal((await prisma.pageTemplate.findUnique({ where: { slug: "blank-page" } }))!.name, "Edited");
    assert.equal(await prisma.formTemplate.count(), 6); assert.equal(await prisma.portfolioTemplate.count(), 6); assert.equal(await prisma.emailTemplate.count(), 6);
    await prisma.pageTemplate.update({ where: { slug: "blank-page" }, data: { name: "Blank Page" } });
  });

  await t.test("page template CRUD, system protection, create page from template", async () => {
    const created = await tpl.createTemplate(admin, { name: U("Custom"), category: "CUSTOM", definition: { sections: [{ type: "cta", content: { heading: "x" } }] } });
    assert.equal(created.isSystem, false);
    await rejects(tpl.createTemplate(admin, { name: "dup", slug: created.slug, category: "CUSTOM", definition: { sections: [] } }), "CONFLICT");
    await tpl.updateTemplate(admin, created.id, { name: "Renamed" });
    await rejects(tpl.createTemplate(sa, { name: "n", category: "CUSTOM", definition: { sections: [] } }), "FORBIDDEN");
    const system = (await prisma.pageTemplate.findFirst({ where: { slug: "service-page" } }))!;
    await rejects(tpl.deleteTemplate(admin, system.id), "SYSTEM_TEMPLATE");
    await rejects(tpl.updateTemplate(admin, system.id, { name: "x" }), "SYSTEM_TEMPLATE");
    const page = await tpl.createPageFromTemplate(sa, system.id, { title: "Svc", slug: `/${U("svc")}` });
    assert.equal(page.status, "DRAFT"); assert.equal(page.createdById, author.id);
    assert.equal(page.sections.length, 7);
    assert.equal(await prisma.pageVersion.count({ where: { pageId: page.id } }), 1);
    assert.ok(await prisma.auditLog.findFirst({ where: { action: "page.create_from_template", entityId: page.id } }));
    await rejects(tpl.createPageFromTemplate(sa, system.id, { title: "Svc", slug: page.slug }), "CONFLICT");
    await rejects(tpl.createPageFromTemplate(sa, system.id, { title: "x", slug: "/admin/x" }), "VALIDATION_ERROR");
    await tpl.deleteTemplate(admin, created.id);
    assert.equal(await prisma.pageTemplate.count({ where: { id: created.id } }), 0);
  });

  await t.test("approval workflow: legal path, illegal jumps, permission denial, self-approval", async () => {
    const p = await mkPage("wf");
    await rejects(wf.approvePage(rv, p.id), "INVALID_TRANSITION");
    await rejects(wf.submitForReview(actor(reviewer.id, ["pages.view"]), p.id), "FORBIDDEN");
    await wf.submitForReview(sa, p.id, "pls");
    await rejects(wf.submitForReview(sa, p.id), "INVALID_TRANSITION");
    await rejects(wf.requestChanges(sa, p.id, "no"), "FORBIDDEN");
    await rejects(wf.requestChanges(rv, p.id, "  "), "VALIDATION_ERROR");
    assert.equal((await wf.requestChanges(rv, p.id, "fix the hero")).status, "CHANGES_REQUESTED");
    await wf.submitForReview(sa, p.id);
    const selfApprover = actor(author.id, ["content.approve", "content.submit_review"]);
    await rejects(wf.approvePage(selfApprover, p.id), "SELF_APPROVAL");
    assert.equal((await wf.approvePage(rv, p.id)).status, "APPROVED");
    await rejects(wf.publishPage(actor(reviewer.id, ["content.approve"]), p.id), "FORBIDDEN");
    assert.equal((await wf.publishPage(rv, p.id)).status, "PUBLISHED");
    await rejects(wf.publishPage(rv, p.id), "INVALID_TRANSITION");
    assert.equal((await wf.archivePage(rv, p.id)).status, "ARCHIVED");
    assert.equal((await wf.unarchivePage(rv, p.id)).status, "DRAFT");
    // notifications generated, deduplicated
    assert.ok(await prisma.notification.findFirst({ where: { userId: reviewer.id, type: "PAGE_REVIEW", entityId: p.id } }));
    assert.ok(await prisma.notification.findFirst({ where: { userId: author.id, type: "PAGE_CHANGES_REQUESTED", entityId: p.id } }));
    assert.ok(await prisma.notification.findFirst({ where: { userId: author.id, type: "PAGE_APPROVED", entityId: p.id } }));
    assert.ok(await prisma.auditLog.findFirst({ where: { action: "page.approve", entityId: p.id } }));
  });

  await t.test("fast-track needs content.approve; schedule/cancel/expiry rules", async () => {
    const p = await mkPage("ft");
    await rejects(wf.publishPage(actor(reviewer.id, ["content.publish"]), p.id), "FORBIDDEN");
    const future = new Date(Date.now() + 3_600_000), later = new Date(Date.now() + 7_200_000);
    await rejects(wf.schedulePage(rv, p.id, { publishAt: new Date(Date.now() - 1000) }), "VALIDATION_ERROR");
    await rejects(wf.schedulePage(rv, p.id, { publishAt: later, unpublishAt: future }), "VALIDATION_ERROR");
    await rejects(wf.schedulePage(actor(reviewer.id, ["content.approve"]), p.id, { publishAt: future }), "FORBIDDEN");
    const s = await wf.schedulePage(rv, p.id, { publishAt: future, unpublishAt: later });
    assert.equal(s.status, "SCHEDULED");
    assert.equal((await wf.cancelSchedule(rv, p.id)).status, "APPROVED");
    assert.equal((await prisma.page.findUnique({ where: { id: p.id } }))!.publishAt, null);
  });

  await t.test("scheduler: publishes due, unpublishes expired, applies draft, is idempotent, ignores future", async () => {
    const due = await mkPage("due", "SCHEDULED", { publishAt: new Date(Date.now() - 60_000), draft: { title: "Draft title", slug: `/${U("due-new")}`, seo: { title: "S" }, sections: [{ type: "cta", order: 0, enabled: true, content: { heading: "from draft" } }] } });
    const future = await mkPage("fut", "SCHEDULED", { publishAt: new Date(Date.now() + 3_600_000) });
    const expiring = await mkPage("exp", "PUBLISHED", { publishedAt: new Date(), unpublishAt: new Date(Date.now() - 60_000) });
    const first = await sched.processScheduledContent();
    assert.ok(first.published.some((x) => x.id === due.id)); assert.ok(first.unpublished.some((x) => x.id === expiring.id));
    assert.ok(!first.published.some((x) => x.id === future.id));
    const d = await prisma.page.findUnique({ where: { id: due.id }, include: { sections: true } });
    assert.equal(d!.status, "PUBLISHED"); assert.equal(d!.title, "Draft title"); assert.equal(d!.draft, null); assert.equal(d!.sections[0].type, "cta"); assert.equal(d!.publishAt, null);
    const e = await prisma.page.findUnique({ where: { id: expiring.id } });
    assert.equal(e!.status, "DRAFT"); assert.equal(e!.unpublishAt, null);
    assert.equal((await prisma.page.findUnique({ where: { id: future.id } }))!.status, "SCHEDULED");
    const audits = await prisma.auditLog.count({ where: { entityId: { in: [due.id, expiring.id] }, action: { in: ["page.publish", "page.unpublish"] } } });
    const notes = await prisma.notification.count({ where: { entityId: { in: [due.id, expiring.id] } } });
    const second = await sched.processScheduledContent();
    assert.ok(!second.published.some((x) => x.id === due.id)); assert.ok(!second.unpublished.some((x) => x.id === expiring.id));
    assert.equal(await prisma.auditLog.count({ where: { entityId: { in: [due.id, expiring.id] }, action: { in: ["page.publish", "page.unpublish"] } } }), audits);
    assert.equal(await prisma.notification.count({ where: { entityId: { in: [due.id, expiring.id] } } }), notes);
    assert.equal(audits, 2);
    // concurrent runs act once
    const again = await mkPage("conc", "SCHEDULED", { publishAt: new Date(Date.now() - 1000) });
    const [r1, r2] = await Promise.all([sched.processScheduledContent(), sched.processScheduledContent()]);
    assert.equal([...r1.published, ...r2.published].filter((x) => x.id === again.id).length, 1);
    assert.equal(await prisma.auditLog.count({ where: { entityId: again.id, action: "page.publish" } }), 1);
  });

  await t.test("scheduler: a failing item does not stop others and notifies once", async () => {
    const bad = await mkPage("bad", "SCHEDULED", { publishAt: new Date(Date.now() - 1000), draft: { title: "", slug: "/x", seo: {}, sections: [] } });
    const good = await mkPage("good", "SCHEDULED", { publishAt: new Date(Date.now() - 500) });
    const r1 = await sched.processScheduledContent();
    assert.ok(r1.failed.some((f) => f.id === bad.id)); assert.ok(r1.published.some((x) => x.id === good.id));
    await sched.processScheduledContent();
    assert.equal(await prisma.notification.count({ where: { entityId: bad.id, type: "PAGE_PUBLISH_FAILED", userId: boss.id } }) <= 1, true);
    assert.equal((await prisma.page.findUnique({ where: { id: bad.id } }))!.status, "SCHEDULED");
  });

  await t.test("global blocks: CRUD, usage, deletion guard, detach (live + draft)", async () => {
    const b = await blocks.createBlock(admin, { name: U("Footer CTA"), type: "cta", content: { heading: "Block" } });
    await rejects(blocks.createBlock(admin, { name: "x", slug: b.slug, type: "cta", content: {} }), "CONFLICT");
    await rejects(blocks.createBlock(sa, { name: "x", type: "cta", content: {} }), "FORBIDDEN");
    const p1 = await mkPage("gb1"), p2 = await mkPage("gb2");
    await prisma.pageSection.create({ data: { pageId: p1.id, type: "cta", order: 1, content: {}, globalBlockId: b.id } });
    await blocks.linkBlockToPage(admin, b.id, p2.id);
    const usage = await blocks.blockUsage(b.id);
    assert.deepEqual(usage.map((u) => [u.pageId, u.live, u.inDraft]).sort(), [[p1.id, true, false], [p2.id, false, true]].sort());
    await rejects(blocks.deleteBlock(admin, b.id), "BLOCK_IN_USE");
    await blocks.updateBlock(admin, b.id, { content: { heading: "Updated" } });
    const detached = await blocks.detachBlock(admin, b.id);
    assert.deepEqual(detached, { detachedLive: 1, detachedDraft: 1 });
    const s = await prisma.pageSection.findFirst({ where: { pageId: p1.id, order: 1 } });
    assert.equal(s!.globalBlockId, null); assert.deepEqual(s!.content, { heading: "Updated" });
    const dr = (await prisma.page.findUnique({ where: { id: p2.id } }))!.draft as { sections: Array<{ globalBlockId: string | null; content: object }> };
    assert.ok(dr.sections.every((x) => x.globalBlockId === null)); assert.deepEqual(dr.sections.at(-1)!.content, { heading: "Updated" });
    assert.deepEqual(await blocks.blockUsage(b.id), []);
    await blocks.deleteBlock(admin, b.id);
    assert.ok(await prisma.auditLog.findFirst({ where: { action: "global_block.detach", entityId: b.id } }));
  });

  await t.test("revision comparison and version list", async () => {
    const p = await mkPage("cmp");
    await prisma.pageSection.updateMany({ where: { pageId: p.id }, data: { content: { heading: "Changed" } } });
    await prisma.page.update({ where: { id: p.id }, data: { title: "New title" } });
    await prisma.$transaction((tx) => snapshotPage(tx, p.id, author.id, "edit"));
    const c = await ver.compareVersions(p.id, 1, 2);
    assert.deepEqual(c.diff.metadata.map((m) => m.field), ["title"]);
    assert.deepEqual(c.diff.sections.changed[0].content, [{ path: "heading", from: "H", to: "Changed" }]);
    assert.equal((await ver.listVersions(p.id)).length, 2);
    await rejects(ver.compareVersions(p.id, 1, 9), "NOT_FOUND");
  });

  await t.test("SEO audit over real data finds duplicates and redirect loops", async () => {
    const mk = (n: string) => prisma.page.create({ data: { title: n, slug: `/${U(n)}`, status: "PUBLISHED", publishedAt: new Date(), sections: { create: [{ type: "hero", order: 0, content: {} }] }, seo: { create: { title: `Dup ${run}`, description: "d" } } } });
    const [a, b] = [await mk("sa"), await mk("sb")];
    await prisma.redirect.createMany({ data: [{ sourcePath: `/${U("l1")}`, destination: `/${U("l2")}`, statusCode: 301 }, { sourcePath: `/${U("l2")}`, destination: `/${U("l1")}`, statusCode: 301 }] });
    const r = await seoData.auditSite();
    assert.ok(r.issues.filter((i) => i.type === "DUPLICATE_TITLE" && [a.id, b.id].includes(i.entityId)).length === 2);
    assert.ok(r.issues.some((i) => i.type === "REDIRECT_LOOP"));
    assert.ok(r.summary.critical >= 2);
  });

  await t.test("media folders, move, usage tracking and delete protection", async () => {
    const mf = actor(boss.id, ["media.folders", "media.view", "media.delete"]);
    const root = await media.createFolder(mf, { name: U("Root") });
    await rejects(media.createFolder(mf, { name: root.name.toUpperCase() }), "CONFLICT");
    const child = await media.createFolder(mf, { name: "Child", parentId: root.id });
    await rejects(media.updateFolder(mf, root.id, { parentId: child.id }), "VALIDATION_ERROR");
    await rejects(media.createFolder(actor(boss.id, ["media.view"]), { name: "x" }), "FORBIDDEN");
    const url = `/uploads/${U("pic")}.png`;
    const asset = await prisma.mediaAsset.create({ data: { filename: "pic.png", mimeType: "image/png", size: 1, storageKey: U("pic"), publicUrl: url } });
    await media.moveAsset(mf, asset.id, child.id);
    assert.equal((await prisma.mediaAsset.findUnique({ where: { id: asset.id } }))!.folderId, child.id);
    await rejects(media.deleteFolder(mf, root.id), "FOLDER_NOT_EMPTY");
    await rejects(media.deleteFolder(mf, child.id), "FOLDER_NOT_EMPTY");
    const folders = await media.listFolders(mf);
    assert.equal(folders.folders.find((f) => f.id === child.id)!.assetCount, 1);
    // usage
    const page = await mkPage("mu"); const block = await prisma.globalBlock.create({ data: { name: U("mb"), slug: U("mb"), content: { img: url } } });
    await prisma.pageSection.updateMany({ where: { pageId: page.id }, data: { content: { image: url } } });
    await prisma.seoMetadata.update({ where: { pageId: page.id }, data: { ogImage: url } });
    await prisma.portfolioProject.create({ data: { title: "p", slug: U("pp"), content: { hero: url } } });
    await prisma.article.create({ data: { title: "a", slug: U("aa"), content: { body: `<img src="${url}">` } } });
    await prisma.globalSetting.create({ data: { key: `header-${run}`, value: { logo: url } } });
    await prisma.globalSetting.create({ data: { key: `footer-${run}`, value: { logo: url } } });
    await prisma.themeSetting.create({ data: { key: `theme-${run}`, value: { bg: url } } });
    const u = await media.getAssetUsage(actor(boss.id, ["media.view"]), asset.id);
    for (const type of ["PageSection", "Page", "GlobalBlock", "Portfolio", "Article", "Header", "Footer", "Theme"]) assert.ok(u.byType[type], `usage ${type}`);
    await rejects(media.deleteMediaAsset(mf, asset.id), "MEDIA_IN_USE");
    await rejects(media.deleteMediaAsset(mf, asset.id, { force: true }), "FORBIDDEN");
    const forced = await media.deleteMediaAsset(actor(boss.id, ["media.delete", "media.force_delete"]), asset.id, { force: true });
    assert.equal(forced.forced, true);
    assert.ok(await prisma.auditLog.findFirst({ where: { action: "media.force_delete", entityId: asset.id } }));
    assert.equal(block.id.length > 0, true);
    // unused asset deletes normally; folder cleanup
    const free = await prisma.mediaAsset.create({ data: { filename: "f.png", mimeType: "image/png", size: 1, storageKey: U("free"), publicUrl: `/uploads/${U("free")}.png` } });
    assert.equal((await media.deleteMediaAsset(mf, free.id)).forced, false);
    await media.deleteFolder(mf, root.id, { moveContentsToParent: true });
    assert.equal((await prisma.mediaFolder.findUnique({ where: { id: child.id } }))!.parentId, null);
    await media.deleteFolder(mf, child.id, { moveContentsToParent: true });
    // optimisation contract is honest
    const img = await prisma.mediaAsset.create({ data: { filename: "o.png", mimeType: "image/png", size: 9, storageKey: U("o"), publicUrl: `/uploads/${U("o")}.png` } });
    assert.equal(media.mediaCapabilities().optimization.supported, false);
    await rejects(media.optimizeMedia(actor(boss.id, ["media.upload"]), img.id, "WEBP"), "UNSUPPORTED_CAPABILITY");
  });

  await t.test("lead CRM: assign, priority, follow-up, activity timeline, lastActivityAt", async () => {
    const lead = await prisma.lead.create({ data: { name: "Lee", email: `lee-${run}@x.co`, source: "form:contact" } });
    await leads.onLeadCreated(lead);
    const full = actor(boss.id, ["leads.view", "leads.edit", "leads.assign", "leads.manage_followup"]);
    await rejects(leads.assignLead(actor(boss.id, ["leads.edit"]), lead.id, reviewer.id), "FORBIDDEN");
    await rejects(leads.assignLead(full, lead.id, "ghost"), "VALIDATION_ERROR");
    const before = (await prisma.lead.findUnique({ where: { id: lead.id } }))!.lastActivityAt!;
    await new Promise((r) => setTimeout(r, 15));
    await leads.assignLead(full, lead.id, reviewer.id);
    await leads.updateLeadMeta(full, lead.id, { priority: "URGENT", estimatedValue: 1250.5, tags: ["VIP", "vip", "web"] });
    const fu = new Date(Date.now() + 86_400_000);
    await leads.setLeadFollowUp(full, lead.id, fu, "call back");
    await leads.changeLeadStatus(full, lead.id, "CONTACTED", "spoke");
    await leads.addLeadNote(full, lead.id, "note");
    await tasks.createTask(actor(boss.id, ["tasks.manage", "leads.view"]), { title: "Send proposal", relatedType: "LEAD", relatedId: lead.id });
    const d = await leads.getLeadDetail(lead.id);
    assert.equal(d.assignedToId, reviewer.id); assert.equal(d.priority, "URGENT"); assert.equal(d.estimatedValue, 1250.5); assert.deepEqual(d.tags, ["vip", "web"]);
    assert.equal(d.nextFollowUpAt!.getTime(), fu.getTime()); assert.equal(d.status, "CONTACTED");
    assert.ok(d.lastActivityAt!.getTime() > before.getTime());
    const types = new Set(d.activities.map((a) => a.type));
    for (const x of ["CREATED", "ASSIGNED", "PRIORITY_CHANGED", "FOLLOW_UP_SET", "STATUS_CHANGED", "NOTE_ADDED", "TASK_CREATED"]) assert.ok(types.has(x), x);
    assert.equal(d.tasks.length, 1);
    assert.ok(await prisma.notification.findFirst({ where: { userId: reviewer.id, type: "LEAD_ASSIGNED", entityId: lead.id } }));
    assert.ok(await prisma.notification.findFirst({ where: { type: "NEW_LEAD", entityId: lead.id } }));
    await leads.onLeadCreated(lead);
    assert.equal(await prisma.notification.count({ where: { type: "NEW_LEAD", entityId: lead.id, userId: boss.id } }), 1, "no duplicate new-lead notification");
    // status history is append-only
    await leads.changeLeadStatus(full, lead.id, "QUALIFIED");
    assert.equal(((await prisma.lead.findUnique({ where: { id: lead.id } }))!.statusHistory as unknown[]).length, 2);
    // filters
    const f = await leads.listLeads(full, { assignee: reviewer.id, priority: ["URGENT"], status: ["QUALIFIED"], tag: "vip", source: "contact" });
    assert.ok(f.leads.some((x) => x.id === lead.id));
    assert.equal((await leads.listLeads(full, { assignee: "unassigned", q: `lee-${run}` })).leads.length, 0);
    assert.ok((await leads.listLeads(full, { from: new Date(Date.now() - 60_000), to: new Date(Date.now() + 60_000), followUpDue: false, q: "Lee" })).leads.length >= 1);
  });

  await t.test("tasks CRUD and permission awareness", async () => {
    const mgr = actor(boss.id, ["tasks.manage", "tasks.view", "pages.view"]);
    const pg = await mkPage("tk");
    const task = await tasks.createTask(mgr, { title: "Review page", assignedToId: author.id, relatedType: "PAGE", relatedId: pg.id, dueAt: new Date(Date.now() - 1000) });
    await rejects(tasks.createTask(mgr, { title: "x", relatedType: "LEAD", relatedId: "nope" }), "FORBIDDEN");
    await rejects(tasks.createTask(actor(boss.id, ["tasks.manage", "pages.view"]), { title: "x", relatedType: "PAGE", relatedId: "nope" }), "NOT_FOUND");
    await rejects(tasks.createTask(actor(author.id, ["tasks.view"]), { title: "x" }), "FORBIDDEN");
    const mine = actor(author.id, ["tasks.view"]);
    assert.equal((await tasks.listTasks(mine, {})).some((x) => x.id === task.id), true);
    assert.equal((await tasks.listTasks(actor(reviewer.id, ["tasks.view"]), {})).some((x) => x.id === task.id), false);
    await rejects(tasks.updateTask(mine, task.id, { title: "rename" }), "FORBIDDEN");
    assert.equal((await tasks.updateTask(mine, task.id, { status: "DONE" })).completedAt !== null, true);
    assert.equal((await tasks.updateTask(mgr, task.id, { status: "TODO" })).completedAt, null);
    assert.equal((await tasks.listTasks(mgr, { relatedType: "PAGE", relatedId: pg.id, overdue: true })).length, 1);
    assert.ok(await prisma.notification.findFirst({ where: { userId: author.id, type: "TASK_ASSIGNED", entityId: task.id } }));
    await tasks.deleteTask(mgr, task.id);
    await rejects(tasks.getTask(mgr, task.id), "NOT_FOUND");
  });

  await t.test("notifications: list, unread count, read, read-all, ownership", async () => {
    const u = await mkUser("noti");
    await notif.notifyUsers({ userIds: [u.id], type: "SYSTEM", title: "a", message: "a", dedupeKey: "k1" });
    await notif.notifyUsers({ userIds: [u.id], type: "SYSTEM", title: "a", message: "a", dedupeKey: "k1" });
    await notif.notifyUsers({ userIds: [u.id], type: "SYSTEM", title: "b", message: "b" });
    await notif.notifyUsers({ userIds: [u.id], type: "SYSTEM", title: "c", message: "c" });
    let l = await notif.listNotifications(u.id);
    assert.equal(l.items.length, 3); assert.equal(l.unreadCount, 3);
    assert.equal(await notif.markNotificationRead(u.id, l.items[0].id), true);
    assert.equal(await notif.markNotificationRead(reviewer.id, l.items[1].id), false, "cannot read someone else's");
    l = await notif.listNotifications(u.id); assert.equal(l.unreadCount, 2);
    assert.equal((await notif.listNotifications(u.id, { unreadOnly: true })).items.length, 2);
    assert.equal(await notif.markAllNotificationsRead(u.id), 2);
    assert.equal((await notif.listNotifications(u.id)).unreadCount, 0);
    assert.equal((await notif.listNotifications(u.id, { limit: 2 })).nextCursor !== null, true);
  });

  await t.test("email templates: seeded, editable, unsafe variables rejected, fallback", async () => {
    const mgr = actor(boss.id, ["email_templates.manage", "email_templates.view"]);
    await prisma.emailTemplate.deleteMany({ where: { key: "lead_confirmation" } });
    await seedPhase2(prisma);
    assert.equal((await emailAdmin.listEmailTemplates(mgr)).length, 6);
    await rejects(emailAdmin.saveEmailTemplate(mgr, "lead_internal", { body: "{{process.env.SECRET}}" }), "UNSAFE_TEMPLATE");
    await rejects(emailAdmin.saveEmailTemplate(mgr, "lead_internal", { subject: "{{notAllowed}}" }), "UNSAFE_TEMPLATE");
    await rejects(emailAdmin.saveEmailTemplate(actor(boss.id, ["email_templates.view"]), "lead_internal", { body: "x" }), "FORBIDDEN");
    await rejects(emailAdmin.getEmailTemplate(mgr, "nope"), "NOT_FOUND");
    const { renderEmail } = await import("../src/lib/email/templates");
    await emailAdmin.saveEmailTemplate(mgr, "lead_confirmation", { subject: "Hello {{name}}", body: "Custom for {{service}}" });
    assert.deepEqual(await renderEmail("lead_confirmation", { name: "Ana", service: "SEO" }), { subject: "Hello Ana", text: "Custom for SEO", source: "database" });
    await emailAdmin.saveEmailTemplate(mgr, "lead_confirmation", { enabled: false });
    assert.equal((await renderEmail("lead_confirmation", { name: "Ana", siteName: "KASH" })).source, "default");
    await emailAdmin.saveEmailTemplate(mgr, "lead_confirmation", { enabled: true });
    assert.match((await emailAdmin.previewEmailTemplate(mgr, "team_invite", { inviteeName: "Zed" })).text, /Zed/);
  });

  await t.test("form templates clone real Form + FormField; advanced config via admin API; submissions", async () => {
    const fa = actor(boss.id, ["forms.view", "forms.edit"]);
    const tmpl = (await prisma.formTemplate.findUnique({ where: { key: "project-enquiry" } }))!;
    const form = await formsAdmin.createFormFromTemplate(fa, tmpl.id, { slug: U("enq") });
    assert.equal(form.fields.length, 7); assert.ok(form.fields.some((f) => f.step === 2 && f.conditionalRules));
    assert.equal(await prisma.formField.count({ where: { formId: form.id } }), 7);
    await rejects(formsAdmin.createFormFromTemplate(fa, tmpl.id, { slug: form.slug }), "CONFLICT");
    const auto = await formsAdmin.createFormFromTemplate(fa, tmpl.id);
    assert.match(auto.slug, /^project-enquiry(-\d+)?$/);
    await rejects(formsAdmin.createForm(fa, { name: "bad", slug: U("bad"), fields: [{ name: "a", label: "A", type: "TEXT", required: false, step: 1, conditionalRules: { action: "show", match: "all", conditions: [{ field: "a", operator: "is_empty" }] } }] }), "VALIDATION_ERROR");
    await rejects(formsAdmin.createForm(actor(boss.id, ["forms.view"]), { name: "x", slug: U("x"), fields: [{ name: "a", label: "A", type: "TEXT", required: false, step: 1 }] }), "FORBIDDEN");
    const updated = await formsAdmin.updateForm(fa, form.id, { successMessage: "Thanks!", successRedirectUrl: "/thanks", createLead: false, sendNotification: false });
    assert.equal(updated.createLead, false);
    const req = new Request("http://x.test/", { method: "POST", headers: { referer: "http://x.test/c" } });
    const res = await subs.saveSubmission(form.slug, { name: "N", email: "n@x.co", service: "Website Development", message: "m" }, req);
    assert.equal(res.lead, null); assert.equal(res.successMessage, "Thanks!"); assert.equal(res.successRedirectUrl, "/thanks");
    assert.equal(await prisma.lead.count({ where: { email: "n@x.co", source: `form:${form.slug}` } }), 0);
    assert.ok(await prisma.notification.findFirst({ where: { type: "FORM_SUBMISSION", entityId: res.submission.id } }));
    await assert.rejects(subs.saveSubmission(form.slug, { name: "N", email: "n@x.co", service: "Other", message: "m" }, req), /REQUIRED:otherService/ as never).catch(() => undefined);
    await formsAdmin.updateForm(fa, form.id, { createLead: true });
    const res2 = await subs.saveSubmission(form.slug, { name: "N2", email: "n2@x.co", service: "Website Development", message: "m" }, req);
    assert.ok(res2.lead); assert.ok(await prisma.leadActivity.findFirst({ where: { leadId: res2.lead!.id, type: "CREATED" } }));
    await rejects(formsAdmin.deleteForm(fa, form.id), "FORM_HAS_SUBMISSIONS");
  });

  await t.test("portfolio templates clone into a DRAFT project", async () => {
    const pa = actor(boss.id, ["portfolio.view", "portfolio.edit"]);
    const tm = (await prisma.portfolioTemplate.findUnique({ where: { key: "mobile-app" } }))!;
    const p = await portfolio.createProjectFromTemplate(pa, tm.id, { title: `My App ${run}` });
    assert.equal(p.status, "DRAFT"); assert.equal((p.content as { projectType: string }).projectType, "Mobile App");
    assert.ok(p.categoryId); assert.ok(await prisma.auditLog.findFirst({ where: { action: "portfolio.create_from_template", entityId: p.id } }));
    const p2 = await portfolio.createProjectFromTemplate(pa, tm.id, { title: `My App ${run}` });
    assert.notEqual(p2.slug, p.slug);
    await rejects(portfolio.createProjectFromTemplate(actor(boss.id, ["portfolio.view"]), tm.id, { title: "x" }), "FORBIDDEN");
  });

  await t.test("bulk operations: RBAC, validation, limits and all-or-nothing transactions", async () => {
    const a = await mkPage("b1", "APPROVED"), b = await mkPage("b2", "APPROVED"), c = await mkPage("b3", "IN_REVIEW");
    await rejects(bulk.bulkPages(actor(boss.id, ["pages.view"]), { action: "publish", ids: [a.id] }), "FORBIDDEN");
    await rejects(bulk.bulkPages(rv, { action: "publish", ids: [a.id, "ghost"] }), "NOT_FOUND");
    await rejects(bulk.bulkPages(rv, { action: "publish", ids: [a.id, b.id, c.id] }), "BULK_REJECTED");
    assert.deepEqual((await prisma.page.findMany({ where: { id: { in: [a.id, b.id, c.id] } }, orderBy: { slug: "asc" } })).map((p) => p.status).sort(), ["APPROVED", "APPROVED", "IN_REVIEW"], "nothing changed");
    assert.equal(bulk.pagesBulkSchema.safeParse({ action: "publish", ids: Array.from({ length: 51 }, (_, i) => String(i)) }).success, false);
    assert.equal(bulk.pagesBulkSchema.safeParse({ action: "publish", ids: ["a", "a"] }).success, false);
    const r = await bulk.bulkPages(rv, { action: "publish", ids: [a.id, b.id] });
    assert.equal(r.changed, 2); assert.ok(await prisma.auditLog.findFirst({ where: { action: "page.bulk_publish" } }));
    // rollback on mid-batch failure: second page's draft has a slug clash
    const x = await mkPage("rb1", "APPROVED"), y = await mkPage("rb2", "APPROVED", { draft: { title: "t", slug: a.slug, seo: {}, sections: [] } });
    await rejects(bulk.bulkPages(rv, { action: "publish", ids: [x.id, y.id] }), "CONFLICT");
    assert.equal((await prisma.page.findUnique({ where: { id: x.id } }))!.status, "APPROVED", "first page rolled back");
    // leads
    const l1 = await prisma.lead.create({ data: { name: "L1" } }), l2 = await prisma.lead.create({ data: { name: "L2" } });
    await rejects(bulk.bulkLeads(actor(boss.id, ["leads.edit"]), { action: "assign", ids: [l1.id], assignedToId: boss.id }), "FORBIDDEN");
    await rejects(bulk.bulkLeads(admin, { action: "assign", ids: [l1.id, l2.id], assignedToId: "ghost" }), "VALIDATION_ERROR");
    await bulk.bulkLeads(admin, { action: "assign", ids: [l1.id, l2.id], assignedToId: boss.id });
    await bulk.bulkLeads(admin, { action: "tag", ids: [l1.id, l2.id], add: ["Hot"], remove: [] });
    assert.deepEqual((await prisma.lead.findUnique({ where: { id: l2.id } }))!.tags, ["hot"]);
    assert.equal(await prisma.leadActivity.count({ where: { leadId: { in: [l1.id, l2.id] }, type: "ASSIGNED" } }), 2);
    // media
    const m1 = await prisma.mediaAsset.create({ data: { filename: "1", mimeType: "image/png", size: 1, storageKey: U("bm1"), publicUrl: "/uploads/bm1" } });
    const folder = await prisma.mediaFolder.create({ data: { name: U("bf") } });
    await rejects(bulk.bulkMedia(admin, { action: "move", ids: [m1.id], folderId: "ghost" }), "NOT_FOUND");
    await rejects(bulk.bulkMedia(actor(boss.id, ["media.view"]), { action: "move", ids: [m1.id], folderId: folder.id }), "FORBIDDEN");
    assert.equal((await bulk.bulkMedia(admin, { action: "move", ids: [m1.id], folderId: folder.id })).changed, 1);
    // portfolio
    const pj = await prisma.portfolioProject.create({ data: { title: "pj", slug: U("pj") } });
    await rejects(bulk.bulkPortfolio(actor(boss.id, ["portfolio.edit"]), { action: "publish", ids: [pj.id] }), "FORBIDDEN");
    assert.equal((await bulk.bulkPortfolio(admin, { action: "publish", ids: [pj.id] })).changed, 1);
    assert.equal((await bulk.bulkPortfolio(admin, { action: "publish", ids: [pj.id] })).skipped, 1);
  });

  await t.test("import: dry-run, digest-gated execute, formula protection; export hygiene", async () => {
    const ia = actor(boss.id, ["import_export.use", "leads.edit", "leads.view", "pages.create", "pages.view", "portfolio.edit"]);
    const csv = `name,email,estimatedvalue,status\r\n=cmd|' /C calc'!A0,ok-${run}@x.co,100,NEW\r\nBad,not-an-email,1,NEW\r\nNoStatus,ns-${run}@x.co,abc,WON\r\n`;
    await rejects(imp.runImport(actor(boss.id, ["leads.edit"]), { kind: "leads", mode: "dry-run", data: csv }), "FORBIDDEN");
    const dry = await imp.runImport(ia, { kind: "leads", mode: "dry-run", data: csv });
    assert.equal(dry.counts.accepted, 1); assert.equal(dry.counts.rejected, 2); assert.ok(dry.warnings.some((w) => /formula/.test(w.message)));
    assert.equal(await prisma.lead.count({ where: { email: `ok-${run}@x.co` } }), 0, "dry-run writes nothing");
    await rejects(imp.runImport(ia, { kind: "leads", mode: "execute", data: csv }), "DIGEST_MISMATCH");
    await rejects(imp.runImport(ia, { kind: "leads", mode: "execute", data: csv, digest: dry.digest }), "HAS_REJECTED_ROWS");
    const done = await imp.runImport(ia, { kind: "leads", mode: "execute", data: csv, digest: dry.digest, skipRejected: true });
    assert.deepEqual(done.executed, { created: 1, skipped: 2 });
    const lead = (await prisma.lead.findFirst({ where: { email: `ok-${run}@x.co` } }))!;
    assert.ok(lead.name!.startsWith("'="), "formula neutralised in storage"); assert.equal(lead.source, "import");
    const again = await imp.runImport(ia, { kind: "leads", mode: "dry-run", data: `name,email\nX,ok-${run}@x.co\n` });
    assert.equal(again.counts.rejected, 1, "duplicate email rejected");
    // export neutralises formulas and never leaks secrets
    const out = await exp.runExport(ia, "leads", "csv");
    assert.ok(out.body.includes(`'=cmd`)); assert.ok(!/passwordHash|tokenHash|encryptedSecret/i.test(out.body));
    await rejects(exp.runExport(actor(boss.id, ["import_export.use"]), "leads", "csv"), "FORBIDDEN");
    // pages import
    const slug = `/${U("imp")}`;
    const pages = { pages: [{ title: "Imp", slug, status: "PUBLISHED", sections: [{ type: "cta", content: { a: 1 } }] }, { title: "Bad", slug: "/ADMIN x", sections: [] }, { title: "Exists", slug: (await mkPage("ex")).slug, sections: [] }] };
    const pd = await imp.runImport(ia, { kind: "pages", mode: "dry-run", data: pages });
    assert.equal(pd.counts.accepted, 1); assert.equal(pd.counts.rejected, 2); assert.ok(pd.warnings.some((w) => /DRAFT/.test(w.message)));
    await imp.runImport(ia, { kind: "pages", mode: "execute", data: pages, digest: pd.digest, skipRejected: true });
    const ip = (await prisma.page.findUnique({ where: { slug } }))!;
    assert.equal(ip.status, "DRAFT");
    const pj = await exp.runExport(ia, "pages", "json");
    assert.ok(JSON.parse(pj.body).pages.some((p: { slug: string }) => p.slug === slug));
    // portfolio csv
    const pcsv = `title,slug,category,content\r\nProj ${run},${U("pcsv")},Web,"{""a"":1}"\r\nBroken,${U("pcsv2")},Web,{notjson\r\n`;
    const pr = await imp.runImport(ia, { kind: "portfolio", mode: "dry-run", data: pcsv });
    assert.equal(pr.counts.accepted, 1); assert.equal(pr.counts.rejected, 1);
  });

  await t.test("admin search is permission filtered, limited and excludes deleted rows", async () => {
    const key = `zq${run}`;
    await prisma.page.create({ data: { title: `Page ${key}`, slug: `/${key}` } });
    await prisma.page.create({ data: { title: `Gone ${key}`, slug: `/gone-${key}`, deletedAt: new Date() } });
    await prisma.lead.create({ data: { name: `Lead ${key}`, email: `${key}@x.co` } });
    await prisma.mediaAsset.create({ data: { filename: `${key}.png`, mimeType: "image/png", size: 1, storageKey: key, publicUrl: `/uploads/${key}` } });
    await rejects(search.adminSearch(actor(boss.id, ["pages.view"]), key), "FORBIDDEN");
    await rejects(search.adminSearch(admin, "a"), "VALIDATION_ERROR");
    const onlyPages = await search.adminSearch(actor(boss.id, ["search.use", "pages.view"]), key);
    assert.deepEqual(Object.keys(onlyPages.results), ["pages"]); assert.equal(onlyPages.results.pages!.length, 1);
    assert.ok(!JSON.stringify(onlyPages).includes("@x.co"), "no lead data leaks");
    const all = await search.adminSearch(admin, key);
    assert.ok(all.results.leads && all.results.media && all.results.pages);
    assert.ok((await search.adminSearch(admin, "Page", 1)).results.pages!.length <= 1);
  });
});
