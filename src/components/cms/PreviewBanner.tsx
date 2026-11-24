export function PreviewBanner({ title, status }: { title: string; status: string }) {
  return (
    <div
      role="status"
      className="sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[var(--color-primary)] px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white"
    >
      <span>Preview mode</span>
      <span className="opacity-80">·</span>
      <span className="normal-case tracking-normal">
        {title} ({status}) — not visible to the public, not indexed
      </span>
    </div>
  );
}
