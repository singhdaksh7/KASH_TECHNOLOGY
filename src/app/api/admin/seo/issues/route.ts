import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { auditSite } from "@/lib/cms/seo-audit-data";
import { int, list } from "@/lib/server/query";
export const GET = admin("seo.audit", async ({ request }) => {
  const sp = new URL(request.url).searchParams;
  const sev = list(sp, "severity")?.map((s) => s.toUpperCase()), types = list(sp, "type")?.map((s) => s.toUpperCase()), ent = sp.get("entityType");
  const all = (await auditSite()).issues.filter((i) => (!sev || sev.includes(i.severity)) && (!types || types.includes(i.type)) && (!ent || i.entityType === ent));
  const limit = Math.min(int(sp, "limit", 100), 500), offset = Math.max(Number(sp.get("offset")) || 0, 0);
  return ok({ total: all.length, limit, offset, issues: all.slice(offset, offset + limit) });
});
