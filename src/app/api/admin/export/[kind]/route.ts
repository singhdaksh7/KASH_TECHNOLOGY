import { NextResponse } from "next/server";
import { z } from "zod";
import { admin } from "@/lib/server/api";
import { actorFromSession } from "@/lib/rbac/actor";
import { runExport } from "@/lib/import-export/export";
const kinds = z.enum(["pages", "portfolio", "articles", "forms", "leads"]);
export const GET = admin<{ kind: string }>(null, async ({ request, session, params }) => {
  const kind = kinds.parse(params.kind);
  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : (kind === "leads" ? "csv" : "json");
  const r = await runExport(actorFromSession(session), kind, format);
  return new NextResponse(r.body, { headers: { "Content-Type": r.contentType, "Content-Disposition": `attachment; filename="${r.filename}"`, "Cache-Control": "no-store", "X-Export-Count": String(r.count) } });
});
