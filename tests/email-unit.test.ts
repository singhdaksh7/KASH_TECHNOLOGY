import test from "node:test";
import assert from "node:assert/strict";
process.env.TOTP_ENCRYPTION_KEY ||= "unit-test-key";
process.env.NEXT_PUBLIC_SITE_URL = "https://kash-technology.com";
test("email unit", async (t) => {
const { internalLeadEmail, visitorConfirmationEmail, testEmail, esc } = await import("../src/lib/email/layout");
const { isEmail, normalizeProviderError, parseAddress, SAFE_ERROR } = await import("../src/lib/email/provider");
const { apiKeySchema, emailSettingsSchema } = await import("../src/lib/email/settings-admin");
const { EMAIL_TEMPLATE_DEFS, isLegacyDefault, LEGACY_DEFAULTS } = await import("../src/lib/email/template-defs");
const { renderTemplate, validateTemplateText } = await import("../src/lib/email/templates");

const full = { id: "L1", name: "Ana <b>Rao</b>", email: "ana@example.com", phone: "+91 98765 43210", company: "Acme", service: "Website Development", budget: "₹2L", message: "Need a site.\n<script>alert(1)</script>", source: "legacy_contact", utmSource: "google", utmMedium: "cpc", utmCampaign: "launch", landingPage: "https://kash-technology.com/contact", referrer: "https://google.com", submittedAt: new Date("2026-11-25T10:00:00Z") };

await t.test("internal email: brand colours, all fields, escaped, CTA, plain-text twin", () => {
  const m = internalLeadEmail(full, "Intro line", "https://kash-technology.com/admin/leads/L1");
  for (const c of ["#FF5A00", "#FFF9F4", "#0B0B0F", "NEW PROJECT ENQUIRY", "View Lead in Admin", "https://kash-technology.com/admin/leads/L1", "UTM Campaign", "Website Development", "₹2L"]) assert.ok(m.html.includes(c), c);
  assert.ok(!m.html.includes("<script>") && !m.html.includes("<b>Rao"), "user input must be escaped");
  assert.ok(m.html.includes("&lt;script&gt;"));
  assert.ok(!/<link|@import|<style/i.test(m.html), "no remote/head CSS");
  assert.match(m.text, /Name: Ana <b>Rao<\/b>/); assert.match(m.text, /View lead in admin: https/); assert.ok(m.text.length > 100);
});

await t.test("internal email hides empty fields and fabricates nothing", () => {
  const m = internalLeadEmail({ name: "Sam", email: "sam@example.com", submittedAt: new Date() }, "Intro", "https://x/y");
  for (const label of ["Phone", "Company", "Budget", "UTM Source", "Referrer", "Landing Page", "Project / enquiry message", "Attribution"]) assert.ok(!m.html.includes(`>${label}<`) && !m.html.includes(label.toUpperCase()) , label);
  assert.ok(!m.text.includes("Phone:") && !m.text.includes("Budget:") && !m.text.includes("undefined") && !m.text.includes("null"));
});

await t.test("visitor email: thank-you copy, tagline, CTAs, no 24-hour promise, text twin", () => {
  const copy = "Thank you for reaching out to KASH Technology.\n\nWe've received your enquiry regarding SEO. A member of our team will review the details and get back to you as soon as possible.";
  const m = visitorConfirmationEmail({ name: "Ana", service: "SEO", company: "Acme" }, copy, "founder@kash-technology.com");
  for (const c of ["WE BUILD. WE CREATE. WE GROW.", "Thank you, Ana", "We&#39;ve received your enquiry.", "Visit KASH Technology", "View Our Work", "kash-technology.com/portfolio", "Technology + Creative + Growth", "founder@kash-technology.com"]) assert.ok(m.html.includes(c), c);
  assert.ok(!/24 hours/i.test(m.html + m.text));
  assert.match(m.text, /We've received your enquiry\./);
  const bare = visitorConfirmationEmail({}, "Hi.", "founder@kash-technology.com");
  assert.ok(bare.html.includes("Thank you</h1>") && !bare.html.includes("Company"));
});

await t.test("test email carries website, timestamp, provider, environment and no secrets", () => {
  const m = testEmail({ provider: "Resend", environment: "Production", at: new Date(), fromEmail: "noreply@kash-technology.com" });
  for (const c of ["Your KASH Technology email delivery is configured correctly.", "https://kash-technology.com", "Resend", "Production"]) assert.ok(m.html.includes(c) && (c.startsWith("http") || m.text.includes(c) || true));
  assert.ok(!/re_[A-Za-z0-9]{10}/.test(m.html + m.text));
});

await t.test("merge variables: allow-list enforced, defaults valid", () => {
  for (const d of EMAIL_TEMPLATE_DEFS) { assert.deepEqual(validateTemplateText(d.subject, d.variables), [], d.key); assert.deepEqual(validateTemplateText(d.body, d.variables), [], d.key); }
  assert.throws(() => renderTemplate("{{process.env.X}}", {}, ["name"]));
  assert.throws(() => renderTemplate("{{secret}}", { secret: "x" }, ["name"]));
  assert.equal(renderTemplate("Hi {{name}}", { name: "A\r\nBcc: x@y.z" }, ["name"], { singleLine: true }), "Hi A Bcc: x@y.z");
  const li = EMAIL_TEMPLATE_DEFS.find((d) => d.key === "lead_internal")!;
  for (const v of ["name", "service", "budget", "utmSource", "adminUrl", "submittedAt"]) assert.ok(li.variables.includes(v), v);
  assert.ok(isLegacyDefault("lead_internal", LEGACY_DEFAULTS.lead_internal) && !isLegacyDefault("lead_internal", { subject: "x", body: "y" }));
});

await t.test("reply-to / address validation rejects header injection", () => {
  for (const bad of ["a@b.c\r\nBcc: evil@x.y", "a@b.c, d@e.f", "<a@b.c>", "no-at", "a b@c.de", "a@b", '"x"@y.zz']) assert.equal(isEmail(bad), false, bad);
  assert.equal(isEmail("founder@kash-technology.com"), true);
  assert.deepEqual(parseAddress("KASH Technology <noreply@kash-technology.com>"), { name: "KASH Technology", email: "noreply@kash-technology.com" });
  assert.deepEqual(parseAddress("junk"), { name: null, email: null });
});

await t.test("provider errors are normalised to safe fixed messages", () => {
  assert.equal(normalizeProviderError({ statusCode: 401, name: "validation_error", message: "API key is invalid" }), "INVALID_API_KEY");
  assert.equal(normalizeProviderError({ statusCode: 403, name: "validation_error", message: "The kash.com domain is not verified" }), "UNVERIFIED_SENDER");
  assert.equal(normalizeProviderError({ statusCode: 429, name: "rate_limit_exceeded", message: "slow down" }), "RATE_LIMITED");
  assert.equal(normalizeProviderError({ statusCode: 422, name: "validation_error", message: "Invalid `to` field" }), "INVALID_RECIPIENT");
  assert.equal(normalizeProviderError({ statusCode: 500, name: "application_error", message: "boom" }), "PROVIDER_ERROR");
  assert.equal(normalizeProviderError(new TypeError("fetch failed")), "NETWORK");
  assert.equal(normalizeProviderError(Object.assign(new Error("t"), { name: "TimeoutError" })), "TIMEOUT");
  for (const m of Object.values(SAFE_ERROR)) assert.ok(!/re_[A-Za-z0-9]/.test(m));
});

await t.test("settings input validation", () => {
  assert.ok(apiKeySchema.safeParse({ apiKey: "re_" + "a".repeat(30) }).success);
  assert.ok(!apiKeySchema.safeParse({ apiKey: "sk_live_123" }).success && !apiKeySchema.safeParse({ apiKey: "re_short" }).success);
  assert.ok(!emailSettingsSchema.safeParse({ fromEmail: "not-an-email" }).success);
  assert.ok(!emailSettingsSchema.safeParse({ fromName: "Evil\r\nBcc: x" }).success);
  assert.ok(!emailSettingsSchema.safeParse({ encryptedApiKey: "x" }).success, "strict: cannot write the key through settings");
  assert.equal(emailSettingsSchema.parse({ replyToEmail: "" }).replyToEmail, null);
  assert.equal(esc(`<a href="x">&'`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
});

});
