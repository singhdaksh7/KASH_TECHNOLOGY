import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { auditSite } from "@/lib/cms/seo-audit-data";
export const GET = admin("seo.audit", async () => { const r = await auditSite(); return ok({ generatedAt: r.generatedAt, summary: r.summary, passed: r.passed, notes: r.notes, issues: r.issues }); });
