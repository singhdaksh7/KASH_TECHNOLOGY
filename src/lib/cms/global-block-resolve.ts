/** Pure helper (no server imports) so the public renderer can use it. */
export interface BlockLike { id: string; type: string; content: unknown; style: unknown }
/** Linked sections inherit the block's type/content/style at read time; unlinked sections are returned unchanged. */
export function resolveSections<S extends { type: string; content: unknown; style?: unknown; globalBlockId?: string | null }>(
  sections: S[], blocks: Map<string, BlockLike>,
): S[] {
  return sections.map((s) => {
    const b = s.globalBlockId ? blocks.get(s.globalBlockId) : undefined;
    return b ? { ...s, type: b.type, content: b.content, style: b.style } : s;
  });
}
