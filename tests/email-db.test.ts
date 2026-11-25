/**
 * Email system integration tests against real PostgreSQL (TEST_DATABASE_URL, all migrations applied). Skipped otherwise.
 * The network transport is replaced with a stub: no real email is ever sent.
 */
import test from "node:test";
import assert from "node:assert/strict";

const URL_ = process.env.TEST_DATABASE_URL;
const skip = URL_ ? false : "TEST_DATABASE_URL not set";
if (URL_) process.env.DATABASE_URL = URL_;
process.env.TOTP_ENCRYPTION_KEY ||= "email-test-key";
process.env.NEXT_PUBLIC_SITE_URL = "https://kash-technology.com";
delete process.env.RESEND_API_KEY; delete process.env.RESEND_FROM_EMAIL; delete process.env.CONTACT_RECEIVER_EMAIL;

type Actor = { id: string; permissions: ReadonlySet<string>; isSuper: boolean };
const actor = (id: string, perms: string[], isSuper = false): Actor => ({ id, permissions: new Set(perms), isSuper });
const rejects = (p: Promise<unknown>, code: string) => assert.rejects(p, (e: { code?: string }) => e.code === code, `expected ${code}`);
const KEY = "re_" + "Z9y8X7w6V5u4T3s2R1q0".repeat(2);
const run = Math.random().toString(36).slice(2, 8);

test("email delivery integration", { skip }, async (t) => {
  const { prisma } = await import("../src/lib/db/prisma");
  const provider = await import("../src/lib/email/provider");
  const admin = await import("../src/lib/email/settings-admin");
  const delivery = await import("../src/lib/email/delivery");
  const mail = await import("../src/lib/email/lead-mail");
  const tplAdmin = await import("../src/lib/email/template-admin");
  const { persistLegacyContact } = await import("../src/lib/forms/legacy-contact");
  await prisma.emailSettings.deleteMany(); await prisma.emailDelivery.deleteMany();

  const boss = await prisma.user.create({ data: { email: `boss-${run}@t.local`, passwordHash: "x" } });
  const boss2 = await prisma.user.create({ data: { email: `boss2-${run}@t.local`, passwordHash: "x" } });
  const sup = actor(boss.id, [], true), sup2 = actor(boss2.id, [], true);
  const manager = actor(boss.id, ["email_settings.view", "email_settings.manage", "email_logs.view", "email.retry", "email_templates.manage", "email_templates.view"]);
  const viewer = actor(boss.id, ["leads.view", "settings.view"]);
  const sent: Array<{ to: string; subject: string; html: string; text: string; replyTo?: string; from: string }> = [];
  let mode: "ok" | "401" | "429" | "unverified" | "throw" = "ok";
  provider.setEmailTransportForTests(async (apiKey, p) => {
    assert.equal(apiKey, KEY);
    if (mode === "throw") throw new TypeError("fetch failed");
    if (mode === "401") return { data: null, error: { statusCode: 401, name: "validation_error", message: `API key is invalid ${KEY}` } };
    if (mode === "429") return { data: null, error: { statusCode: 429, name: "rate_limit_exceeded", message: "slow" } };
    if (mode === "unverified") return { data: null, error: { statusCode: 403, name: "validation_error", message: "The domain is not verified" } };
    sent.push(p); return { data: { id: `msg_${sent.length}` }, error: null };
  });
  const req = (extra: Record<string, string> = {}) => new Request("https://kash-technology.com/api/contact", { method: "POST", headers: { referer: "https://kash-technology.com/contact", ...extra } });
  const contact = (n: string, email = `${n}@visitor.test`) => ({ fullName: n, email, phone: "+91 90000 00000", company: "Acme", serviceInterested: "Website Development", projectBudget: "₹2L", message: `Hello ${n} ${run}` });

  await t.test("unconfigured: lead saved, emails SKIPPED+logged, nothing sent", async () => {
    const r = await persistLegacyContact(contact("nocfg"), req());
    assert.ok(await prisma.lead.findUnique({ where: { id: r.lead.id } }));
    const rows = await prisma.emailDelivery.findMany({ where: { entityId: r.lead.id } });
    assert.equal(rows.length, 2); assert.ok(rows.every((x) => x.status === "SKIPPED" && x.errorCode === "NOT_CONFIGURED"));
    assert.equal(sent.length, 0);
    assert.equal((await admin.emailStatus(manager)).state, "not_configured");
  });

  await t.test("permissions: settings, key, test email, logs, retry", async () => {
    await rejects(admin.viewSettings(viewer), "FORBIDDEN");
    await rejects(admin.saveSettings(viewer, { enabled: true }), "FORBIDDEN");
    await rejects(admin.setApiKey(viewer, { apiKey: KEY }), "FORBIDDEN");
    await rejects(admin.removeApiKey(viewer), "FORBIDDEN");
    await rejects(admin.sendTest(viewer, "a@b.co"), "FORBIDDEN");
    await rejects(admin.emailStatus(viewer), "FORBIDDEN");
    await rejects(admin.viewSettings(actor(boss.id, ["email_settings.view"])).then(() => admin.saveSettings(actor(boss.id, ["email_settings.view"]), { enabled: true })), "FORBIDDEN");
    await rejects(mail.retryDelivery(viewer, "x"), "FORBIDDEN");
    await admin.viewSettings(sup);
  });

  await t.test("API key: encrypted at rest, never returned, audited without the value", async () => {
    const v = await admin.setApiKey(manager, { apiKey: KEY });
    assert.deepEqual(v.apiKey, { configured: true, source: "database", lastFour: KEY.slice(-4) });
    const everything = JSON.stringify([v, await admin.viewSettings(manager), await admin.emailStatus(manager)]);
    assert.ok(!everything.includes(KEY) && !everything.includes(KEY.slice(0, 20)), "key must never be in any API view");
    const row = await prisma.emailSettings.findUnique({ where: { id: "default" } });
    assert.ok(row?.encryptedApiKey && !row.encryptedApiKey.includes(KEY.slice(0, 12)), "ciphertext only");
    assert.equal((await provider.getEmailConfig()).apiKey, KEY);
    const logs = JSON.stringify(await prisma.auditLog.findMany({ where: { entity: "EmailSettings" } }));
    assert.ok(logs.includes("email.api_key_updated") && logs.includes("Resend API key updated") && !logs.includes(KEY.slice(0, 12)));
  });

  await t.test("settings save + audit; invalid addresses rejected", async () => {
    await admin.saveSettings(manager, { enabled: true, fromName: "KASH Technology", fromEmail: "noreply@kash-technology.com", internalRecipient: "founder@kash-technology.com", replyToEmail: "founder@kash-technology.com", testRecipient: "me@kash-technology.com" });
    const cfg = await provider.getEmailConfig();
    assert.equal(cfg.enabled, true); assert.equal(cfg.from, "KASH Technology <noreply@kash-technology.com>"); assert.equal(cfg.internalRecipient, "founder@kash-technology.com");
    const actions = (await prisma.auditLog.findMany({ where: { entity: "EmailSettings" } })).map((a) => a.action);
    for (const a of ["email.enabled", "email.from_changed", "email.internal_recipient_changed"]) assert.ok(actions.includes(a), a);
    await assert.rejects(async () => admin.emailSettingsSchema.parse({ fromEmail: "bad" }));
    assert.equal((await admin.emailStatus(manager)).state, "connected");
  });

  await t.test("test email: sent through provider, logged, audited, rate-limited, bad recipient rejected", async () => {
    await rejects(admin.sendTest(manager, "not-an-email"), "VALIDATION_ERROR");
    const r = await admin.sendTest(manager, "me@kash-technology.com");
    assert.equal(r.status, "SENT");
    const m = sent.at(-1)!;
    assert.equal(m.subject, "KASH Technology — Email Configuration Test"); assert.ok(m.html.includes("configured correctly") && m.text.includes("configured correctly") && !m.html.includes(KEY));
    assert.ok((await prisma.auditLog.findMany({ where: { action: "email.test_sent" } })).length >= 1);
    for (let i = 0; i < 4; i++) await admin.sendTest(manager, "me@kash-technology.com");
    await rejects(admin.sendTest(manager, "me@kash-technology.com"), "RATE_LIMITED");
  });

  await t.test("test email works while delivery is switched off, but real emails are SKIPPED/DISABLED", async () => {
    await admin.saveSettings(manager, { enabled: false });
    sent.length = 0;
    const t2 = await admin.sendTest(sup2, "me@kash-technology.com");
    assert.equal(t2.status, "SENT");
    const r = await persistLegacyContact(contact("off"), req());
    const rows = await prisma.emailDelivery.findMany({ where: { entityId: r.lead.id } });
    assert.ok(rows.every((x) => x.status === "SKIPPED" && x.errorCode === "DISABLED"));
    await admin.saveSettings(manager, { enabled: true });
  });

  await t.test("full flow: lead saved, founder + visitor emails sent, reply-to behaviour, logs", async () => {
    sent.length = 0;
    const r = await persistLegacyContact(contact("happy"), req());
    assert.equal(r.duplicate, false);
    const lead = await prisma.lead.findUniqueOrThrow({ where: { id: r.lead.id } });
    assert.equal(lead.budget, "₹2L");
    assert.equal(sent.length, 2);
    const internal = sent.find((m) => m.to === "founder@kash-technology.com")!, visitor = sent.find((m) => m.to === "happy@visitor.test")!;
    assert.ok(internal && visitor);
    assert.match(internal.subject, /^New Project Enquiry — happy \| Website Development$/); assert.equal(internal.replyTo, "happy@visitor.test");
    assert.ok(internal.html.includes(`/admin/leads/${lead.id}`) && internal.html.includes("₹2L") && internal.text.length > 50);
    assert.equal(visitor.replyTo, "founder@kash-technology.com"); assert.ok(visitor.html.includes("WE BUILD. WE CREATE. WE GROW.") && visitor.html.includes("regarding Website Development") && visitor.text);
    const rows = await prisma.emailDelivery.findMany({ where: { entityId: lead.id } });
    assert.deepEqual(rows.map((x) => x.status).sort(), ["SENT", "SENT"]); assert.ok(rows.every((x) => x.providerMessageId && x.sentAt));
    assert.ok(await prisma.leadActivity.findFirst({ where: { leadId: lead.id, type: "CREATED" } }), "activity recorded before email");
    assert.ok(await prisma.notification.findFirst({ where: { entityId: lead.id } }).then((n) => n !== undefined));
  });

  await t.test("toggles: visitor confirmation off → SKIPPED/TOGGLE_OFF, internal still sent", async () => {
    await admin.saveSettings(manager, { sendVisitorConfirmation: false });
    sent.length = 0;
    const r = await persistLegacyContact(contact("toggle"), req());
    const rows = await prisma.emailDelivery.findMany({ where: { entityId: r.lead.id } });
    assert.equal(rows.find((x) => x.templateKey === "lead_confirmation")?.errorCode, "TOGGLE_OFF");
    assert.equal(rows.find((x) => x.templateKey === "lead_internal")?.status, "SENT"); assert.equal(sent.length, 1);
    await admin.saveSettings(manager, { sendVisitorConfirmation: true });
  });

  await t.test("provider failures NEVER lose the lead; errors normalised, safe, key-free", async () => {
    for (const [m, code] of [["401", "INVALID_API_KEY"], ["429", "RATE_LIMITED"], ["unverified", "UNVERIFIED_SENDER"], ["throw", "NETWORK"]] as const) {
      mode = m;
      const r = await persistLegacyContact(contact(`fail-${m}`), req());
      assert.ok(await prisma.lead.findUnique({ where: { id: r.lead.id } }), `lead survives ${m}`);
      const rows = await prisma.emailDelivery.findMany({ where: { entityId: r.lead.id } });
      assert.ok(rows.length === 2 && rows.every((x) => x.status === "FAILED" && x.errorCode === code), m);
      assert.ok(rows.every((x) => !JSON.stringify(x).includes(KEY.slice(0, 12))), "no key in log");
    }
    assert.equal((await admin.emailStatus(manager)).state, "error");
    mode = "ok";
  });

  await t.test("retry: re-renders, bounded attempts, only failed/skipped, audited", async () => {
    mode = "401";
    const r = await persistLegacyContact(contact("retry"), req());
    const failed = await prisma.emailDelivery.findMany({ where: { entityId: r.lead.id } });
    assert.equal(failed.length, 2);
    const internalRow = failed.find((x) => x.templateKey === "lead_internal")!;
    mode = "ok"; sent.length = 0;
    const res = await mail.retryDelivery(manager, internalRow.id);
    assert.equal(res.status, "SENT"); assert.equal(sent.length, 1);
    const after = await prisma.emailDelivery.findUniqueOrThrow({ where: { id: internalRow.id } });
    assert.equal(after.attempts, 2); assert.equal(after.status, "SENT"); assert.equal(after.errorCode, null);
    await rejects(mail.retryDelivery(manager, internalRow.id), "CONFLICT");
    mode = "401";
    const other = failed.find((x) => x.templateKey === "lead_confirmation")!;
    await prisma.emailDelivery.update({ where: { id: other.id }, data: { attempts: delivery.MAX_ATTEMPTS } });
    await rejects(mail.retryDelivery(manager, other.id), "RETRY_LIMIT");
    await rejects(mail.retryDelivery(manager, "nope"), "NOT_FOUND");
    assert.ok((await prisma.auditLog.findMany({ where: { action: "email.retry", entityId: internalRow.id } })).length === 1);
    mode = "ok";
  });

  await t.test("duplicate protection: same dedupe key / same enquiry twice sends once", async () => {
    sent.length = 0;
    const a = await persistLegacyContact(contact("dupe"), req());
    const b = await persistLegacyContact(contact("dupe"), req());
    assert.equal(b.duplicate, true); assert.equal(b.lead.id, a.lead.id);
    assert.equal(await prisma.lead.count({ where: { email: "dupe@visitor.test" } }), 1);
    assert.equal(sent.length, 2);
    const again = await mail.notifyLead({ type: "Lead", id: a.lead.id }, mail.leadToMailData(a.lead));
    assert.ok(again.internal?.duplicate && again.confirmation?.duplicate); assert.equal(sent.length, 2);
  });

  await t.test("invalid visitor address: confirmation fails safely, internal reply-to falls back", async () => {
    sent.length = 0;
    const lead = await prisma.lead.create({ data: { name: "NoMail", email: "bad address", message: "m", source: "legacy_contact" } });
    const out = await mail.notifyLead({ type: "Lead", id: lead.id }, mail.leadToMailData(lead));
    assert.equal(out.confirmation?.errorCode, "INVALID_RECIPIENT");
    assert.equal(out.internal?.status, "SENT"); assert.equal(sent[0].replyTo, "founder@kash-technology.com");
  });

  await t.test("template edits flow into real emails; unsafe variables rejected; edits audited; legacy default upgraded", async () => {
    await prisma.emailTemplate.deleteMany({ where: { key: { in: ["lead_confirmation", "lead_internal"] } } });
    const { LEGACY_DEFAULTS } = await import("../src/lib/email/template-defs");
    await prisma.emailTemplate.create({ data: { key: "lead_internal", name: "x", ...LEGACY_DEFAULTS.lead_internal } });
    const cfg = await provider.getEmailConfig();
    const sample = { name: "T", email: "t@x.co", service: "SEO", submittedAt: new Date() };
    assert.match((await mail.buildInternal(sample, null, cfg)).subject, /^New Project Enquiry/, "legacy row upgraded to new default");
    await rejects(tplAdmin.saveEmailTemplate(manager, "lead_confirmation", { body: "{{process.env.X}}" }), "UNSAFE_TEMPLATE");
    await tplAdmin.saveEmailTemplate(manager, "lead_confirmation", { subject: "Thanks {{name}}!", body: "Custom copy about {{service}}." });
    const v = await mail.buildVisitor({ name: "Ana", email: "ana@x.co", service: "SEO", submittedAt: new Date() }, cfg);
    assert.equal(v.subject, "Thanks Ana!"); assert.ok(v.html.includes("Custom copy about SEO.") && v.text.includes("Custom copy about SEO."));
    assert.ok((await prisma.auditLog.findMany({ where: { action: "email_template.update", entityId: "lead_confirmation" } })).length >= 1);
    const p = await tplAdmin.previewEmailTemplate(manager, "lead_internal", {});
    assert.ok(p.html?.includes("Example Client") && p.previewData === true);
    await prisma.emailTemplate.deleteMany({ where: { key: { in: ["lead_confirmation", "lead_internal"] } } });
  });

  await t.test("env fallback when no admin key; admin key wins; remove key → env/disabled", async () => {
    await admin.removeApiKey(manager);
    assert.equal((await provider.getEmailConfig()).apiKeySource, "none");
    process.env.RESEND_API_KEY = KEY;
    const c = await provider.getEmailConfig(); assert.equal(c.apiKeySource, "environment");
    assert.deepEqual((await admin.viewSettings(manager)).apiKey, { configured: true, source: "environment", lastFour: KEY.slice(-4) });
    await admin.setApiKey(manager, { apiKey: KEY });
    assert.equal((await provider.getEmailConfig()).apiKeySource, "database");
    delete process.env.RESEND_API_KEY;
    assert.ok((await prisma.auditLog.findMany({ where: { action: "email.api_key_removed" } })).length === 1);
  });

  provider.setEmailTransportForTests(null);
});
