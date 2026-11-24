/** Upload validation: allow-listed MIME types, size caps, magic-byte sniffing and image dimensions. */
export const ALLOWED: Record<string, { ext: string; kind: "image" | "video" | "pdf"; maxBytes: number }> = {
  "image/jpeg": { ext: "jpg", kind: "image", maxBytes: 10 * 1024 * 1024 },
  "image/png": { ext: "png", kind: "image", maxBytes: 10 * 1024 * 1024 },
  "image/webp": { ext: "webp", kind: "image", maxBytes: 10 * 1024 * 1024 },
  "image/gif": { ext: "gif", kind: "image", maxBytes: 8 * 1024 * 1024 },
  "application/pdf": { ext: "pdf", kind: "pdf", maxBytes: 15 * 1024 * 1024 },
  "video/mp4": { ext: "mp4", kind: "video", maxBytes: 40 * 1024 * 1024 },
  "video/webm": { ext: "webm", kind: "video", maxBytes: 40 * 1024 * 1024 },
};

export function sniffMime(b: Buffer): string | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString("ascii"))) return "image/gif";
  if (b.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  if (b.subarray(4, 8).toString("ascii") === "ftyp") return "video/mp4";
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return "video/webm";
  return null;
}

export function imageSize(b: Buffer, mime: string): { width: number; height: number } | null {
  try {
    if (mime === "image/png") return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    if (mime === "image/gif") return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
    if (mime === "image/jpeg") {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const marker = b[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
    if (mime === "image/webp") {
      const kind = b.subarray(12, 16).toString("ascii");
      if (kind === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
      if (kind === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
      if (kind === "VP8L") { const v = b.readUInt32LE(21); return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
    }
  } catch {
    /* fall through */
  }
  return null;
}

export function safeBaseName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return base || "file";
}

export const humanSize = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
