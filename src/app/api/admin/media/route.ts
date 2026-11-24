import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { admin, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { storage } from "@/lib/storage/local";
import { ALLOWED, imageSize, safeBaseName, sniffMime } from "@/lib/storage/validate";
import { toMediaItem, usageCounts } from "@/lib/server/dto-media";
import { rateLimit } from "@/lib/server/rate-limit";

export const GET = admin("media.view", async () => {
  const rows = await prisma.mediaAsset.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 500 });
  const usage = await usageCounts(rows.map((r) => r.publicUrl));
  return ok(rows.map((r) => toMediaItem(r, usage.get(r.publicUrl) ?? 0)));
});

export async function readUpload(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "VALIDATION_ERROR", "A file is required");
  const buf = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffMime(buf);
  const rule = sniffed ? ALLOWED[sniffed] : undefined;
  if (!sniffed || !rule) throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Allowed: JPEG, PNG, WebP, GIF, PDF, MP4, WebM");
  if (file.type && file.type !== sniffed && !(file.type === "application/octet-stream")) throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "File content does not match its declared type");
  if (buf.length > rule.maxBytes) throw new HttpError(413, "TOO_LARGE", `File exceeds the ${Math.round(rule.maxBytes / 1048576)} MB limit for this type`);
  const dims = rule.kind === "image" ? imageSize(buf, sniffed) : null;
  const d = new Date();
  const key = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomBytes(6).toString("hex")}-${safeBaseName(file.name)}.${rule.ext}`;
  return { buf, mime: sniffed, key, dims, filename: file.name.slice(0, 200), text: (k: string) => (typeof form?.get(k) === "string" ? String(form?.get(k)).slice(0, 500) : undefined) };
}

export const POST = admin("media.upload", async ({ request, session }) => {
  if (!rateLimit(`upload:${session.userId}`, 40, 10 * 60_000)) throw new HttpError(429, "RATE_LIMITED", "Too many uploads. Try again shortly.");
  const u = await readUpload(request);
  const stored = await storage.upload({ key: u.key, body: u.buf, mimeType: u.mime });
  const row = await prisma.mediaAsset.create({
    data: {
      filename: u.filename, mimeType: u.mime, size: u.buf.length, width: u.dims?.width, height: u.dims?.height,
      alt: u.text("alt"), title: u.text("title") ?? u.filename.replace(/\.[^.]+$/, ""), caption: u.text("caption"),
      storageKey: stored.key, publicUrl: stored.publicUrl, createdById: session.userId,
    },
  });
  await audit({ actorId: session.userId, action: "media.upload", entity: "MediaAsset", entityId: row.id, metadata: { mime: u.mime, size: u.buf.length } });
  return ok(toMediaItem(row), 201);
});
