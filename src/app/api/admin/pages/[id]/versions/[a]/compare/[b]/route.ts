import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { compareVersions } from "@/lib/cms/versions";
export const GET = admin<{ id: string; a: string; b: string }>("pages.view", async ({ params }) => ok(await compareVersions(params.id, Number(params.a), Number(params.b))));
