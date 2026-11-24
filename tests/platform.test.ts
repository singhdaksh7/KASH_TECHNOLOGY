import test from "node:test";
import assert from "node:assert/strict";
import { newTotp, verifyTotp } from "../src/lib/auth/totp";
import { validateRedirect } from "../src/lib/server/redirects";
import { rateLimit } from "../src/lib/server/rate-limit";

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
