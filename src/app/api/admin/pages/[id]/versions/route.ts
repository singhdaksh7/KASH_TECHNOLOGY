import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { listVersions } from "@/lib/cms/versions";
export const GET = admin<{ id: string }>("pages.view", async ({ params }) => ok(await listVersions(params.id)));
