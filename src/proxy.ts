import { NextResponse, type NextRequest } from "next/server";
import { lookupRedirect } from "@/lib/server/redirects";

/**
 * Edge-of-app policy (Next.js 16 proxy):
 *  1. /admin/** → must carry a session cookie (real validation happens in the admin layout + every API).
 *  2. Admin / preview / admin-API responses are never indexable (X-Robots-Tag) and never cached.
 *  3. Public GET/HEAD paths are checked against the admin-managed Redirect table (60s in-process cache).
 */
const SESSION_COOKIE = "kash_admin_session";
const AUTH_PAGES = ["/admin/login", "/admin/verify-2fa", "/admin/setup-2fa", "/admin/change-password"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const sensitive = isAdminPage || pathname.startsWith("/preview") || pathname.startsWith("/api/admin");

  if (isAdminPage && !AUTH_PAGES.some((p) => pathname.startsWith(p)) && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const res = NextResponse.redirect(url);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (!sensitive && (request.method === "GET" || request.method === "HEAD")) {
    const hit = await lookupRedirect(pathname).catch(() => null);
    if (hit) {
      const target = /^https?:\/\//i.test(hit.destination) ? hit.destination : new URL(hit.destination + (hit.destination.includes("?") ? "" : search), request.url).toString();
      return NextResponse.redirect(target, hit.statusCode as 301 | 302 | 307 | 308);
    }
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  const res = NextResponse.next({ request: { headers } });
  if (sensitive) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|uploads/|api/(?!admin)).*)"],
};
