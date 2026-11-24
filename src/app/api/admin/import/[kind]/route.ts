import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { runImport } from "@/lib/import-export/import";
const schema = z.object({ mode: z.enum(["dry-run", "execute"]), data: z.unknown(), digest: z.string().optional(), skipRejected: z.boolean().optional(), allowDuplicates: z.boolean().optional() });
export const POST = admin<{ kind: string }>(null, async ({ request, session, params }) => {
  const kind = z.enum(["pages", "portfolio", "leads"]).parse(params.kind);
  return ok(await runImport(actorFromSession(session), { kind, ...(await body(request, schema)) }));
});
