import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";

export const redirectSchema = z.object({
  sourcePath: z.string().max(2048),
  destination: z.string().max(2048),
  statusCode: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]),
  active: z.boolean().default(true),
});

export async function assertNoLoop(source: string, destination: string, ignoreId?: string) {
  const rows = await prisma.redirect.findMany({ where: { active: true, ...(ignoreId ? { id: { not: ignoreId } } : {}) } });
  const map = new Map(rows.map((r) => [r.sourcePath, r.destination]));
  map.set(source, destination);
  const seen = new Set<string>([source]);
  let cur = destination;
  for (let i = 0; i < 12; i++) {
    const next = map.get(cur);
    if (!next) return;
    if (seen.has(cur)) throw new HttpError(400, "VALIDATION_ERROR", "Redirect loop detected");
    seen.add(cur);
    cur = next;
  }
  throw new HttpError(400, "VALIDATION_ERROR", "Redirect chain is too long (possible loop)");
}

