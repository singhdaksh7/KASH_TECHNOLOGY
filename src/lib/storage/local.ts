import fs from "fs/promises";
import path from "path";
import type { StorageProvider } from "./provider";

/**
 * Local-disk storage on a PERSISTENT volume (never inside the ephemeral container layer).
 * MEDIA_DIR must point at a mounted volume in production. Files are served by app/uploads/[...key]/route.ts
 * (Next.js does not serve files added to /public after the build).
 */
export const mediaRoot = () => path.resolve(process.env.MEDIA_DIR || path.join(process.cwd(), "storage", "uploads"));

function resolveKey(key: string) {
  const root = mediaRoot();
  const target = path.resolve(root, key);
  if (!target.startsWith(root + path.sep)) throw new Error("Invalid storage key");
  return target;
}

export const localStorage: StorageProvider = {
  async upload({ key, body }) {
    const target = resolveKey(key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, body, { flag: "wx" });
    return { key, publicUrl: this.getPublicUrl(key) };
  },
  async read(key) {
    try {
      return await fs.readFile(resolveKey(key));
    } catch {
      return null;
    }
  },
  async delete(key) {
    await fs.unlink(resolveKey(key)).catch(() => undefined);
  },
  async replace(oldKey, input) {
    const stored = await this.upload(input);
    await this.delete(oldKey);
    return stored;
  },
  getPublicUrl(key) {
    return `/uploads/${key.split("/").map(encodeURIComponent).join("/")}`;
  },
};

/** The active provider. An S3/R2 provider can be added here behind the same interface. */
export const storage: StorageProvider = localStorage;
