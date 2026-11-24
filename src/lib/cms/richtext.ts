import type { RichTextBlock, RichTextInline, RichTextValue } from "./types";
import { safeHref, safeImageSrc } from "./url-safety";

/**
 * Rich text normalisation.
 *
 * The CMS may send structured JSON blocks (preferred), an array of plain
 * paragraph strings, or an HTML string. All three are converted into the same
 * RichTextBlock tree, which is then rendered as React elements. We NEVER pass
 * CMS HTML to dangerouslySetInnerHTML: HTML is parsed here with an allow-list,
 * so <script>, event handlers, style attributes and javascript: URLs cannot
 * survive the conversion.
 */

const MAX_DEPTH = 6;
const MAX_BLOCKS = 500;
const MAX_TEXT = 20_000;

/* ───────── structured JSON validation ───────── */

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeInline(v: unknown, depth = 0): RichTextInline[] {
  if (typeof v === "string") return v ? [{ type: "text", text: v.slice(0, MAX_TEXT) }] : [];
  if (!Array.isArray(v)) {
    if (isObj(v)) return normalizeInline([v], depth);
    return [];
  }
  const out: RichTextInline[] = [];
  for (const node of v) {
    if (typeof node === "string") {
      out.push({ type: "text", text: node.slice(0, MAX_TEXT) });
    } else if (isObj(node) && node.type === "text" && typeof node.text === "string") {
      out.push({
        type: "text",
        text: node.text.slice(0, MAX_TEXT),
        bold: node.bold === true || undefined,
        italic: node.italic === true || undefined,
        code: node.code === true || undefined,
      });
    } else if (isObj(node) && node.type === "link" && depth < MAX_DEPTH) {
      const href = safeHref(node.href);
      const children = normalizeInline(node.children, depth + 1);
      if (href) out.push({ type: "link", href, children });
      else out.push(...children); // drop the link, keep the text
    }
  }
  return out;
}

function normalizeBlock(v: unknown): RichTextBlock | null {
  if (typeof v === "string") {
    return v.trim() ? { type: "paragraph", children: [{ type: "text", text: v.slice(0, MAX_TEXT) }] } : null;
  }
  if (!isObj(v)) return null;
  switch (v.type) {
    case "paragraph": {
      const children = normalizeInline(v.children);
      return children.length ? { type: "paragraph", children } : null;
    }
    case "heading": {
      const level = v.level === 3 || v.level === 4 ? v.level : 2;
      const children = normalizeInline(v.children);
      return children.length ? { type: "heading", level, children } : null;
    }
    case "quote": {
      const children = normalizeInline(v.children);
      return children.length ? { type: "quote", children } : null;
    }
    case "list": {
      if (!Array.isArray(v.items)) return null;
      const items = v.items.map((i) => normalizeInline(i)).filter((i) => i.length);
      return items.length ? { type: "list", ordered: v.ordered === true, items } : null;
    }
    case "image": {
      const src = safeImageSrc(v.src);
      return src ? { type: "image", src, alt: typeof v.alt === "string" ? v.alt.slice(0, 300) : "" } : null;
    }
    case "divider":
      return { type: "divider" };
    default:
      return null;
  }
}

/* ───────── HTML allow-list parser ───────── */

type HNode = { tag: string; attrs: Record<string, string>; children: HNode[] } | { text: string };

const VOID = new Set(["br", "hr", "img"]);
const DROP_WITH_CONTENT = new Set([
  "script", "style", "iframe", "object", "embed", "noscript", "template", "svg", "math",
  "form", "textarea", "select", "title", "head", "link", "meta",
]);

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeFromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeFromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
function safeFromCodePoint(n: number): string {
  if (!Number.isFinite(n) || n < 32 || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff)) return "";
  return String.fromCodePoint(n);
}

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

function parseHtml(html: string): HNode[] {
  const root: { tag: string; attrs: Record<string, string>; children: HNode[] } = { tag: "root", attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>|<|[^<]+/g;
  let m: RegExpExecArray | null;
  let nodes = 0;
  while ((m = re.exec(html)) && nodes++ < 20_000) {
    const whole = m[0];
    if (whole.startsWith("<!--")) continue;
    const top = stack[stack.length - 1];
    if (!m[2]) {
      // text (or a stray "<")
      top.children.push({ text: decodeEntities(whole) });
      continue;
    }
    const tag = m[2].toLowerCase();
    if (m[1]) {
      // closing tag: pop to the matching open tag if present
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    if (DROP_WITH_CONTENT.has(tag)) {
      const close = new RegExp(`</${tag}\\s*>`, "i");
      const rest = html.slice(re.lastIndex);
      const found = close.exec(rest);
      re.lastIndex = found ? re.lastIndex + found.index + found[0].length : html.length;
      continue;
    }
    const node = { tag, attrs: parseAttrs(m[3] ?? ""), children: [] as HNode[] };
    top.children.push(node);
    if (!VOID.has(tag) && !/\/\s*$/.test(m[3] ?? "") && stack.length < 40) stack.push(node);
  }
  return root.children;
}

function isEl(n: HNode): n is Extract<HNode, { tag: string }> {
  return "tag" in n;
}

function inlineFromNodes(nodes: HNode[], marks: { bold?: boolean; italic?: boolean; code?: boolean } = {}): RichTextInline[] {
  const out: RichTextInline[] = [];
  for (const n of nodes) {
    if (!isEl(n)) {
      if (n.text) out.push({ type: "text", text: n.text.slice(0, MAX_TEXT), ...marks });
      continue;
    }
    switch (n.tag) {
      case "strong":
      case "b":
        out.push(...inlineFromNodes(n.children, { ...marks, bold: true }));
        break;
      case "em":
      case "i":
        out.push(...inlineFromNodes(n.children, { ...marks, italic: true }));
        break;
      case "code":
        out.push(...inlineFromNodes(n.children, { ...marks, code: true }));
        break;
      case "br":
        out.push({ type: "text", text: "\n", ...marks });
        break;
      case "a": {
        const href = safeHref(n.attrs.href);
        const kids = inlineFromNodes(n.children, marks);
        if (href) out.push({ type: "link", href, children: kids });
        else out.push(...kids);
        break;
      }
      default:
        // unknown/unsupported inline wrapper: keep the text, drop the tag
        out.push(...inlineFromNodes(n.children, marks));
    }
  }
  return out;
}

const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "blockquote", "hr", "img", "div", "section", "article", "pre"]);

function blocksFromNodes(nodes: HNode[]): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];
  let run: HNode[] = [];
  const flush = () => {
    const children = inlineFromNodes(run);
    if (children.some((c) => c.type === "link" || c.text.trim())) blocks.push({ type: "paragraph", children });
    run = [];
  };
  for (const n of nodes) {
    if (!isEl(n) || !BLOCK_TAGS.has(n.tag)) {
      run.push(n);
      continue;
    }
    flush();
    switch (n.tag) {
      case "p":
      case "pre": {
        const children = inlineFromNodes(n.children, n.tag === "pre" ? { code: true } : {});
        if (children.length) blocks.push({ type: "paragraph", children });
        break;
      }
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const level = n.tag === "h3" ? 3 : n.tag === "h4" || n.tag === "h5" || n.tag === "h6" ? 4 : 2;
        const children = inlineFromNodes(n.children);
        if (children.length) blocks.push({ type: "heading", level, children });
        break;
      }
      case "blockquote": {
        const children = inlineFromNodes(n.children);
        if (children.length) blocks.push({ type: "quote", children });
        break;
      }
      case "ul":
      case "ol": {
        const items = n.children
          .filter((c): c is Extract<HNode, { tag: string }> => isEl(c) && c.tag === "li")
          .map((li) => inlineFromNodes(li.children))
          .filter((i) => i.length);
        if (items.length) blocks.push({ type: "list", ordered: n.tag === "ol", items });
        break;
      }
      case "hr":
        blocks.push({ type: "divider" });
        break;
      case "img": {
        const src = safeImageSrc(n.attrs.src);
        if (src) blocks.push({ type: "image", src, alt: (n.attrs.alt ?? "").slice(0, 300) });
        break;
      }
      default: // div / section / article: descend
        blocks.push(...blocksFromNodes(n.children));
    }
  }
  flush();
  return blocks;
}

/** Sanitizes an HTML string into the safe block tree. */
export function sanitizeHtmlToBlocks(html: string): RichTextValue {
  return blocksFromNodes(parseHtml(html.slice(0, 500_000))).slice(0, MAX_BLOCKS);
}

/** Accepts structured blocks, string[] paragraphs, or an HTML/plain string. */
export function normalizeRichText(value: unknown): RichTextValue {
  if (typeof value === "string") {
    return /<[a-zA-Z!/]/.test(value)
      ? sanitizeHtmlToBlocks(value)
      : value
          .split(/\n{2,}/)
          .map((p) => normalizeBlock(p.trim()))
          .filter((b): b is RichTextBlock => b !== null);
  }
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_BLOCKS)
      .map(normalizeBlock)
      .filter((b): b is RichTextBlock => b !== null);
  }
  if (isObj(value)) {
    const b = normalizeBlock(value);
    return b ? [b] : [];
  }
  return [];
}

/** Plain-text projection (for schema/meta fallbacks). */
export function richTextToPlainText(blocks: RichTextValue): string {
  const inl = (c: RichTextInline[]): string => c.map((i) => (i.type === "text" ? i.text : inl(i.children))).join("");
  return blocks
    .map((b) => {
      switch (b.type) {
        case "paragraph":
        case "heading":
        case "quote":
          return inl(b.children);
        case "list":
          return b.items.map(inl).join(" ");
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ");
}
