import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

interface KashLogoProps {
  variant?: "header" | "footer" | "badge" | "emblem";
  className?: string;
  showTagline?: boolean;
}

export function KashLogo({ variant = "header", className = "", showTagline = true }: KashLogoProps) {
  if (variant === "badge" || variant === "emblem") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Image
          src="/images/logo/kash-logo-emblem.jpg"
          alt="KASH Technology Official Logo"
          width={variant === "emblem" ? 420 : 180}
          height={variant === "emblem" ? 420 : 180}
          className="object-contain rounded-full shadow-2xl"
          priority
        />
      </div>
    );
  }

  return (
    <Link href="/" className={`group flex items-center gap-3 select-none ${className}`}>
      {/* Monogram emblem icon */}
      <div className="relative w-10 h-10 rounded-lg bg-[#0b0d0e] border border-[#c5a880]/40 p-0.5 flex items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(197,168,128,0.2)] group-hover:border-[#f36b21]/80 transition-all duration-300 shrink-0">
        <Image
          src="/images/logo/kash-logo-emblem.jpg"
          alt="KASH Emblem"
          width={40}
          height={40}
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <span className="font-serif-heading text-lg sm:text-xl font-bold tracking-wider text-[#c5a880] group-hover:text-white transition-colors duration-200 leading-tight">
          KASH TECHNOLOGY
        </span>
        {showTagline && (
          <span className="text-[7.5px] sm:text-[8px] font-mono tracking-[0.25em] text-[#c5a880]/85 uppercase font-semibold mt-0.5">
            {SITE_CONFIG.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
