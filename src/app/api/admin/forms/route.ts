import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as f from "@/lib/forms/admin";
import { formCreateSchema } from "@/lib/forms/config";
export const GET = admin(null, async ({ session }) => ok(await f.listForms(actorFromSession(session))));
export const POST = admin(null, async ({ request, session }) => ok(await f.createForm(actorFromSession(session), await body(request, formCreateSchema)), 201));
