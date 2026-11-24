import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { listPortfolioTemplates } from "@/lib/cms/portfolio-templates";
export const GET = admin(null, async ({ session }) => ok(await listPortfolioTemplates(actorFromSession(session))));
