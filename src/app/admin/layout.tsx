import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentSession } from "@/lib/auth/session";
import { requires2fa } from "@/lib/rbac/permissions";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { absolute: "KASH CMS" },
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const PUBLIC_AUTH = ["/admin/login", "/admin/verify-2fa"];

/**
 * Server-side gate for EVERY /admin/** page (in addition to proxy.ts and per-API authorization):
 * no valid session → /admin/login; session without enrolled 2FA → /admin/setup-2fa.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (!PUBLIC_AUTH.some((p) => pathname.startsWith(p))) {
    const session = await currentSession();
    if (!session) redirect("/admin/login");
    const enrolled = !!session.user.twoFactor?.enabledAt;
    if (requires2fa() && !enrolled && !pathname.startsWith("/admin/setup-2fa")) redirect("/admin/setup-2fa");
  }
  return <AdminShell>{children}</AdminShell>;
}
