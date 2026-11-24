/** Structured comparison of two page version snapshots. Pure: no database access. */

export interface SnapshotSection { id?: string; type: string; order: number; enabled: boolean; content?: unknown; style?: unknown; globalBlockId?: string | null }
export interface PageSnapshot {
  title?: string; slug?: string; status?: string; pageType?: string;
  seo?: Record<string, unknown> | null;
  sections?: SnapshotSection[];
}
export interface FieldChange { field: string; from: unknown; to: unknown }
export interface PathChange { path: string; from: unknown; to: unknown }
export interface SectionRef { id?: string; type: string; order: number; enabled: boolean }
export interface SectionChange {
  id?: string; type: string;
  position: { from: number; to: number } | null;
  enabled: { from: boolean; to: boolean } | null;
  typeChanged: { from: string; to: string } | null;
  globalBlock: { from: string | null; to: string | null } | null;
  content: PathChange[];
  style: PathChange[];
}
export interface SnapshotDiff {
  identical: boolean;
  metadata: FieldChange[];
  seo: FieldChange[];
  sections: {
    added: Array<SectionRef & { content: unknown; style: unknown }>;
    removed: Array<SectionRef & { content: unknown; style: unknown }>;
    changed: SectionChange[];
    orderChanged: boolean;
    order: { from: string[]; to: string[] };
  };
  summary: { metadataChanges: number; seoChanges: number; added: number; removed: number; changed: number; contentChanges: number; styleChanges: number };
}

const META_FIELDS = ["title", "slug", "status", "pageType"] as const;
const SEO_FIELDS = ["title", "description", "canonicalUrl", "robots", "ogImage", "ogTitle", "ogDescription", "twitterImage", "focusKeyword", "secondaryKeywords", "structuredData"];

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const MAX_CHANGES = 500;

/** Deep path diff for JSON values (objects by key, arrays by index). Capped so a pathological payload cannot blow up a response. */
export function diffJson(a: unknown, b: unknown, path = "", out: PathChange[] = []): PathChange[] {
  if (out.length >= MAX_CHANGES) return out;
  if (isObj(a) && isObj(b)) {
    for (const k of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) diffJson(a[k], b[k], path ? `${path}.${k}` : k, out);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) diffJson(a[i], b[i], `${path}[${i}]`, out);
  } else if (!same(a, b)) {
    out.push({ path: path || "(root)", from: a ?? null, to: b ?? null });
  }
  return out;
}

const ref = (s: SnapshotSection): SectionRef => ({ id: s.id, type: s.type, order: s.order, enabled: s.enabled });

/**
 * Pairs sections between versions. Section ids are stable within a page's history unless a restore
 * recreated them, so: (1) match by id; (2) pair the remaining sections of the same type in order.
 */
export function pairSections(a: SnapshotSection[], b: SnapshotSection[]) {
  const pairs: Array<[SnapshotSection, SnapshotSection]> = [];
  const usedB = new Set<number>();
  const unmatchedA: number[] = [];
  a.forEach((sa, i) => {
    const j = sa.id ? b.findIndex((sb, k) => !usedB.has(k) && sb.id === sa.id) : -1;
    if (j >= 0) { usedB.add(j); pairs.push([sa, b[j]]); } else unmatchedA.push(i);
  });
  const removed: SnapshotSection[] = [];
  for (const i of unmatchedA) {
    const j = b.findIndex((sb, k) => !usedB.has(k) && sb.type === a[i].type);
    if (j >= 0) { usedB.add(j); pairs.push([a[i], b[j]]); } else removed.push(a[i]);
  }
  const added = b.filter((_, k) => !usedB.has(k));
  return { pairs, added, removed };
}

export function compareSnapshots(from: PageSnapshot, to: PageSnapshot): SnapshotDiff {
  const metadata: FieldChange[] = META_FIELDS.filter((f) => !same(from[f], to[f])).map((f) => ({ field: f, from: from[f] ?? null, to: to[f] ?? null }));
  const seo: FieldChange[] = SEO_FIELDS.filter((f) => !same(from.seo?.[f], to.seo?.[f])).map((f) => ({ field: f, from: from.seo?.[f] ?? null, to: to.seo?.[f] ?? null }));

  const sa = [...(from.sections ?? [])].sort((x, y) => x.order - y.order);
  const sb = [...(to.sections ?? [])].sort((x, y) => x.order - y.order);
  const { pairs, added, removed } = pairSections(sa, sb);

  // Order is judged among surviving (paired) sections only, so adding or removing one section
  // does not flag every other section as "moved".
  const rankA = new Map<SnapshotSection, number>(), rankB = new Map<SnapshotSection, number>();
  [...pairs].sort((p, q) => sa.indexOf(p[0]) - sa.indexOf(q[0])).forEach(([x], i) => rankA.set(x, i));
  [...pairs].sort((p, q) => sb.indexOf(p[1]) - sb.indexOf(q[1])).forEach(([, y], i) => rankB.set(y, i));
  const orderChanged = pairs.some(([x, y]) => rankA.get(x) !== rankB.get(y));

  const changed: SectionChange[] = [];
  for (const [x, y] of pairs) {
    const content = diffJson(x.content, y.content);
    const style = diffJson(x.style, y.style);
    const enabled = x.enabled !== y.enabled ? { from: x.enabled, to: y.enabled } : null;
    const typeChanged = x.type !== y.type ? { from: x.type, to: y.type } : null;
    const globalBlock = (x.globalBlockId ?? null) !== (y.globalBlockId ?? null) ? { from: x.globalBlockId ?? null, to: y.globalBlockId ?? null } : null;
    const position = rankA.get(x) !== rankB.get(y) ? { from: sa.indexOf(x), to: sb.indexOf(y) } : null;
    if (content.length || style.length || enabled || typeChanged || globalBlock || position) {
      changed.push({ id: y.id ?? x.id, type: y.type, position, enabled, typeChanged, globalBlock, content, style });
    }
  }
  const label = (s: SnapshotSection) => s.id ?? `${s.type}#${s.order}`;
  const detail = (s: SnapshotSection) => ({ ...ref(s), content: s.content ?? null, style: s.style ?? null });
  const diff: SnapshotDiff = {
    identical: false, metadata, seo,
    sections: { added: added.map(detail), removed: removed.map(detail), changed, orderChanged, order: { from: sa.map(label), to: sb.map(label) } },
    summary: {
      metadataChanges: metadata.length, seoChanges: seo.length, added: added.length, removed: removed.length, changed: changed.length,
      contentChanges: changed.reduce((n, c) => n + c.content.length, 0), styleChanges: changed.reduce((n, c) => n + c.style.length, 0),
    },
  };
  diff.identical = !metadata.length && !seo.length && !added.length && !removed.length && !changed.length && !orderChanged;
  return diff;
}
