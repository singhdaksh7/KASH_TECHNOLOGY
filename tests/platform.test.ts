import test from "node:test";
import assert from "node:assert/strict";
import { newTotp, verifyTotp } from "../src/lib/auth/totp";
import { rateLimit } from "../src/lib/server/rate-limit";
import { validateRedirect } from "../src/lib/server/redirects";

test("TOTP accepts current standard authenticator token and rejects a different token", () => {
  const totp = newTotp(); const token = totp.generate();
  assert.equal(verifyTotp(totp.secret.base32, token), true);
  assert.equal(verifyTotp(totp.secret.base32, "000000"), false);
});
test("redirect validation prevents non-local and self-referential redirects", () => {
  assert.throws(() => validateRedirect("/old", "https://evil.example"));
  assert.throws(() => validateRedirect("/same", "/same"));
  assert.doesNotThrow(() => validateRedirect("/old", "/new"));
});
test("rate limiting denies requests beyond its configured bound", () => {
  assert.equal(rateLimit("test-limiter", 1, 60_000), true);
  assert.equal(rateLimit("test-limiter", 1, 60_000), false);
});

/* ───────── CMS engine unit tests ───────── */
import { SECTION_LABELS } from "../src/lib/cms/section-compat";
import { SECTION_REGISTRY } from "../src/components/cms-sections/registry";
import { normalizeRichText } from "../src/lib/cms/richtext";
import { resolveTheme, themeToCss, DEFAULT_THEME } from "../src/lib/theme/theme";
import { signPending, verifyPending } from "../src/lib/auth/crypto";
import { safeHref } from "../src/lib/cms/url-safety";

test("every section the Page Builder can save is renderable by the public registry", () => {
  for (const id of Object.keys(SECTION_LABELS)) assert.ok(id in SECTION_REGISTRY, `missing renderer for ${id}`);
});

test("rich text sanitiser drops scripts, handlers and javascript: links", () => {
  const blocks = JSON.stringify(normalizeRichText('<p>a<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(2)">l</a><a href="https://ok.test" onclick="x()">ok</a></p><iframe src="//e"></iframe>'));
  assert.ok(!/script|onerror|javascript:|onclick|iframe/i.test(blocks.replace(/https:\/\/ok\.test/, "")));
  assert.ok(blocks.includes("https://ok.test"));
});

test("unsafe URLs are rejected", () => {
  assert.equal(safeHref("javascript:alert(1)"), null);
  assert.equal(safeHref("java\nscript:alert(1)"), null);
  assert.equal(safeHref("//evil.test"), null);
  assert.equal(safeHref("/ok"), "/ok");
});

test("theme defaults are the approved KASH palette and invalid overrides are dropped", () => {
  assert.equal(DEFAULT_THEME.colorPrimary, "#FF5A00");
  const t = resolveTheme({ colorPrimary: "red; } body{display:none", radiusButton: "url(x)", colorSecondary: "#112233" });
  assert.equal(t.colorPrimary, "#FF5A00");
  assert.equal(t.colorSecondary, "#112233");
  assert.ok(!themeToCss(t).includes("display:none"));
});

test("redirect validation: loops, external-looking sources and reserved paths", () => {
  assert.throws(() => validateRedirect("//evil.test", "/a"));
  assert.throws(() => validateRedirect("/admin/x", "/a"));
  assert.throws(() => validateRedirect("/a", "/a"));
  assert.deepEqual(validateRedirect("/old/", "/new"), { sourcePath: "/old", destination: "/new" });
});

test("2FA pending token is signed, expiring and tamper-evident", () => {
  process.env.AUTH_SECRET = "unit-test-secret";
  const t = signPending("user1");
  assert.equal(verifyPending(t), "user1");
  assert.equal(verifyPending(t.replace("user1", "user2")), null);
  assert.equal(verifyPending("user1.x"), null);
  assert.equal(verifyPending(signPending("user1", -1)), null);
});
