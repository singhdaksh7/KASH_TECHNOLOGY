import Link from "next/link";
import type { ReactNode } from "react";
import { isExternalHref, safeHref } from "@/lib/cms/url-safety";

interface CmsLinkProps {
  href: unknown;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** Renders a CMS-provided link. Unsafe hrefs (javascript:, data:, …) degrade to plain text. */
export function CmsLink({ href, className, children, ...rest }: CmsLinkProps) {
  const safe = safeHref(href);
  if (!safe) return <span className={className}>{children}</span>;
  if (isExternalHref(safe)) {
    return (
      <a href={safe} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
        {children}
      </a>
    );
  }
  if (/^(mailto|tel):/i.test(safe) || safe.startsWith("#") || safe.startsWith("?")) {
    return (
      <a href={safe} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={safe} className={className} {...rest}>
      {children}
    </Link>
  );
}
