import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { mediaCapabilities } from "@/lib/cms/media";
export const GET = admin("media.view", async () => ok(mediaCapabilities()));
