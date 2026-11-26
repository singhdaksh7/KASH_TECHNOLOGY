import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";

const GLOBAL_KEYS = ["header", "footer", "navigation", "site", "integrations.public", "business"] as const;
const THEME_KEYS = ["theme"] as const;
const schema = z.object({ key: z.string(), value: z.unknown(), theme: z.boolean().optional() });

export const GET = admin("settings.view", async () => {
  const [global, theme] = await Promise.all([prisma.globalSetting.findMany(), prisma.themeSetting.findMany()]);
  return ok({ global, theme });
});

export const PUT = admin("settings.manage", async ({ request, session }) => {
  const d = await body(request, schema);
  const allowed = (d.theme ? THEME_KEYS : GLOBAL_KEYS) as readonly string[];
  if (!allowed.includes(d.key)) throw new HttpError(400, "VALIDATION_ERROR", "Unknown setting");
  if (JSON.stringify(d.value ?? null).length > 200_000) throw new HttpError(400, "VALIDATION_ERROR", "Setting too large");
  const args = { where: { key: d.key }, update: { value: d.value as Prisma.InputJsonValue }, create: { key: d.key, value: d.value as Prisma.InputJsonValue } };
  const row = d.theme ? await prisma.themeSetting.upsert(args) : await prisma.globalSetting.upsert(args);
  await audit({ actorId: session.userId, action: "settings.update", entity: d.theme ? "ThemeSetting" : "GlobalSetting", entityId: d.key });
  refreshPublicSite();
  return ok(row);
});

export const DELETE = admin("settings.manage", async ({ request, session }) => {
  const d = await body(request, z.object({ key: z.string(), theme: z.boolean().optional() }));
  const allowed = (d.theme ? THEME_KEYS : GLOBAL_KEYS) as readonly string[];
  if (!allowed.includes(d.key)) throw new HttpError(400, "VALIDATION_ERROR", "Unknown setting");
  if (d.theme) await prisma.themeSetting.deleteMany({ where: { key: d.key } });
  else await prisma.globalSetting.deleteMany({ where: { key: d.key } });
  await audit({ actorId: session.userId, action: "settings.reset", entity: d.theme ? "ThemeSetting" : "GlobalSetting", entityId: d.key });
  refreshPublicSite();
  return ok({ reset: true });
});
