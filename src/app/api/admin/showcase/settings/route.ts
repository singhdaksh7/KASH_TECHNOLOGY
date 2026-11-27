import { admin, body, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { 
  getShowcaseSettings, 
  updateShowcaseSettings, 
  showcaseSettingsSchema 
} from "@/lib/server/showcase-admin";

export const GET = admin("showcase.view", async () => {
  const settings = await getShowcaseSettings();
  return ok(settings);
});

export const PUT = admin("showcase.manage", async ({ request, session }) => {
  const d = await body(request, showcaseSettingsSchema);
  const updated = await updateShowcaseSettings(d);
  await audit({
    actorId: session.userId,
    action: "showcase_settings.update",
    entity: "ShowcaseSettings",
    entityId: updated.id,
  });
  refreshPublicSite();
  return ok(updated);
});
