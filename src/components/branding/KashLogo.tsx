import React from "react";
import Link from "next/link";
import Image from "next/image";

interface KashLogoProps {
  className?: string;
  variant?: "header" | "footer" | "dark" | "admin";
  height?: number;
}

export function KashLogo({ className = "", variant = "header", height }: KashLogoProps) {
  // Determine if this is on a dark background
  const isDarkBackground = variant === "dark";
  const logoSrc = isDarkBackground
    ? "/images/logo/kash-logo-white-tagline.webp"
    : "/images/logo/kash-logo-transparent.webp";

  // Aspect ratio of the original logo is 530 x 110 (approx 4.818 : 1)
  // Standard rendered height: 38px (width ~183px), footer 42px (width ~202px)
  const renderHeight = height || (variant === "footer" ? 42 : variant === "admin" ? 36 : 38);
  const renderWidth = Math.round(renderHeight * (530 / 110));

  return (
    <Link
      href="/"
      className={`inline-flex items-center shrink-0 select-none group transition-opacity hover:opacity-95 ${className}`}
      aria-label="KASH Technology - Home"
    >
      <Image
        src={logoSrc}
        alt="Kash Technology — TAILORED | AFFORDABLE | SCALABLE"
        width={renderWidth}
        height={renderHeight}
        priority={variant === "header"}
        className="h-auto object-contain"
        style={{
          height: `${renderHeight}px`,
          width: "auto",
          maxWidth: "100%",
        }}
      />
    </Link>
  );
}
