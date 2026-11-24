import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as m from "@/lib/cms/media";
const schema = z.object({ format: z.enum(["WEBP", "AVIF"]) });
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await m.optimizeMedia(actorFromSession(session), params.id, (await body(request, schema)).format)));
