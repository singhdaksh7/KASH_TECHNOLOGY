import { embedSrc } from "@/lib/cms/section-compat";
import { SectionHeader, str, type SectionProps } from "./util";

/** Custom Embed: allow-listed providers only (YouTube privacy host, Vimeo, Google Maps). Never raw HTML/scripts. */
export function CustomEmbedSection({ section }: SectionProps) {
  const c = section.content;
  const src = embedSrc(c.url ?? c.src);
  if (!src) return null;
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeader heading={str(c.heading)} subheading={str(c.description)} />
      <div className="aspect-video overflow-hidden rounded-[var(--radius-card)]">
        <iframe
          src={src}
          title={str(c.title, 200) ?? str(c.heading, 200) ?? "Embedded content"}
          loading="lazy"
          className="h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          allowFullScreen
        />
      </div>
    </div>
  );
}
