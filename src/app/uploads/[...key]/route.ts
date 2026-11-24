import { prisma } from "@/lib/db/prisma";
import { storage } from "@/lib/storage/local";

/** Serves uploaded media from the persistent volume. Only keys that exist as MediaAsset rows are served. */
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.map(decodeURIComponent).join("/");
  if (key.includes("..")) return new Response("Not found", { status: 404 });
  const asset = await prisma.mediaAsset.findFirst({ where: { storageKey: key, deletedAt: null }, select: { mimeType: true, filename: true } }).catch(() => null);
  if (!asset) return new Response("Not found", { status: 404 });
  const data = await storage.read(key);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Content-Disposition": `inline; filename="${encodeURIComponent(asset.filename)}"`,
    },
  });
}
