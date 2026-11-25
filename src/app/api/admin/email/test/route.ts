import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { sendTest } from "@/lib/email/settings-admin";
export const POST = admin(null, async ({ request, session }) => ok(await sendTest(actorFromSession(session), (await body(request, z.object({ recipient: z.string().max(320) }).strict())).recipient)));
