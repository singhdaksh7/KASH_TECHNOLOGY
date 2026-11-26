import test from "node:test";
import assert from "node:assert/strict";
import { ADMIN_NAVIGATION, filterNavigation } from "../src/lib/rbac/navigation";
import { PERMISSION_GROUPS } from "../src/lib/rbac/matrix";
import { scrub } from "../src/lib/server/scrub";
import { getDefaultBusinessProfile } from "../src/lib/server/business-profile";

test("permission navigation: hides restricted routes for viewer", () => {
  const viewerCan = (perm?: string) =>
    !perm || ["pages.view", "notifications.view", "tasks.view"].includes(perm);

  const filtered = filterNavigation(ADMIN_NAVIGATION, viewerCan);

  // Content should contain Pages (pages.view) but not Insights (articles.view) or Media (media.view)
  const contentGroup = filtered.find((g) => g.title === "CONTENT");
  assert.ok(contentGroup, "Content group exists");
  assert.ok(contentGroup.items.some((i) => i.href === "/admin/pages"));
  assert.ok(!contentGroup.items.some((i) => i.href === "/admin/insights"));
  assert.ok(!contentGroup.items.some((i) => i.href === "/admin/media"));

  // System should not contain Team (users.view) or Audit Log (audit.view)
  const systemGroup = filtered.find((g) => g.title === "OPERATIONS & SYSTEM");
  assert.ok(systemGroup, "System group exists");
  assert.ok(!systemGroup.items.some((i) => i.href === "/admin/team"));
  assert.ok(!systemGroup.items.some((i) => i.href === "/admin/audit-log"));
});

test("permission navigation: super admin has unrestricted access to all groups", () => {
  const superCan = () => true;
  const filtered = filterNavigation(ADMIN_NAVIGATION, superCan);
  assert.equal(filtered.length, ADMIN_NAVIGATION.length);
  const totalOriginal = ADMIN_NAVIGATION.reduce((acc, g) => acc + g.items.length, 0);
  const totalFiltered = filtered.reduce((acc, g) => acc + g.items.length, 0);
  assert.equal(totalFiltered, totalOriginal);
});

test("permission matrix: groups are distinct and non-empty", () => {
  assert.ok(PERMISSION_GROUPS.length >= 8);
  for (const g of PERMISSION_GROUPS) {
    assert.ok(g.name && g.key);
    assert.ok(g.permissions.length > 0);
    for (const p of g.permissions) {
      assert.ok(p.key.includes("."));
      assert.ok(p.description.length > 0);
    }
  }
});

test("audit log scrubbing: sensitive keys are redacted", () => {
  const payload = {
    username: "founder",
    password: "secret_password_123",
    api_key: "kash_live_testkey",
    totpSecret: "JBSWY3DPEHPK3PXP",
    nested: {
      authHeader: "Bearer eyJhbGciOi...",
      cleanField: "safe value",
    },
  };

  const scrubbed = scrub(payload) as Record<string, unknown>;
  const nested = scrubbed.nested as Record<string, unknown>;
  assert.equal(scrubbed.username, "founder");
  assert.equal(scrubbed.password, "[redacted]");
  assert.equal(scrubbed.api_key, "[redacted]");
  assert.equal(scrubbed.totpSecret, "[redacted]");
  assert.equal(nested.cleanField, "safe value");
  assert.equal(nested.authHeader, "[redacted]");
});

test("business profile: defaults fallback to SITE_CONFIG correctly", () => {
  const profile = getDefaultBusinessProfile();
  assert.equal(profile.businessName, "KASH Technology");
  assert.equal(profile.defaultLocale, "en-IN");
  assert.equal(profile.timezone, "Asia/Kolkata");
  assert.ok(profile.primaryEmail.includes("@"));
  assert.ok(profile.organizationSchema.knowsAbout?.includes("Software Engineering"));
});
