"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Tailwind classes for the wrapping box (needs a size / aspect ratio). */
  wrapperClassName?: string;
  priority?: boolean;
  sizes?: string;
}

/** Image with graceful fallback: invalid/missing/broken src renders a branded placeholder. */
export function SafeImage({ src, alt, className, wrapperClassName, priority, sizes = "(min-width: 1024px) 50vw, 100vw" }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const remote = !!src && /^https?:\/\//i.test(src);

  return (
    <div className={cn("relative overflow-hidden bg-[#0e0e12]", wrapperClassName)}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={remote}
          onError={() => setFailed(true)}
          className={cn("object-cover", className)}
        />
      ) : (
        <div
          role="img"
          aria-label={alt || "Image unavailable"}
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/25 via-[#0e0e12] to-[#0B0B0F]"
        />
      )}
    </div>
  );
}
