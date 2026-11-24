import { Fragment, type ReactNode } from "react";
import { normalizeRichText } from "@/lib/cms/richtext";
import type { RichTextBlock, RichTextInline } from "@/lib/cms/types";
import { CmsLink } from "./CmsLink";
import { SafeImage } from "./SafeImage";

function Inline({ nodes }: { nodes: RichTextInline[] }): ReactNode {
  return nodes.map((n, i) => {
    if (n.type === "link") {
      return (
        <CmsLink key={i} href={n.href} className="font-semibold text-[var(--color-primary)] underline underline-offset-2 hover:opacity-80">
          <Inline nodes={n.children} />
        </CmsLink>
      );
    }
    let el: ReactNode = n.text.includes("\n")
      ? n.text.split("\n").flatMap((part, j) => (j ? [<br key={`b${j}`} />, part] : [part]))
      : n.text;
    if (n.code) el = <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.9em]">{el}</code>;
    if (n.bold) el = <strong>{el}</strong>;
    if (n.italic) el = <em>{el}</em>;
    return <Fragment key={i}>{el}</Fragment>;
  });
}

function Block({ block }: { block: RichTextBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-relaxed">
          <Inline nodes={block.children} />
        </p>
      );
    case "heading": {
      const cls = "font-serif-heading font-bold tracking-tight pt-2";
      if (block.level === 2) return <h2 className={`${cls} text-2xl sm:text-3xl`}><Inline nodes={block.children} /></h2>;
      if (block.level === 3) return <h3 className={`${cls} text-xl sm:text-2xl`}><Inline nodes={block.children} /></h3>;
      return <h4 className={`${cls} text-lg`}><Inline nodes={block.children} /></h4>;
    }
    case "quote":
      return (
        <blockquote className="border-l-4 border-[var(--color-primary)] pl-4 italic opacity-90">
          <Inline nodes={block.children} />
        </blockquote>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`${block.ordered ? "list-decimal" : "list-disc"} space-y-1.5 pl-6`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <Inline nodes={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "image":
      return <SafeImage src={block.src} alt={block.alt} wrapperClassName="aspect-[16/9] w-full rounded-[var(--radius-card)]" />;
    case "divider":
      return <hr className="border-current opacity-15" />;
  }
}

/**
 * Renders CMS rich text. Accepts structured blocks, paragraph strings or an HTML string;
 * everything is normalised/sanitised first and rendered as React elements (no dangerouslySetInnerHTML).
 */
export function RichText({ value, className = "", gap = "space-y-5" }: { value: unknown; className?: string; gap?: string }) {
  const blocks = normalizeRichText(value);
  if (!blocks.length) return null;
  return (
    <div className={`${gap} text-base sm:text-lg ${className}`}>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}
