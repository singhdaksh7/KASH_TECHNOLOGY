import React from "react";
import Link from "next/link";

interface KashLogoProps {
  className?: string;
  variant?: "header" | "footer";
}

export function KashLogo({ className = "" }: KashLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Modern Orange Hex / Geometric Ribbon Icon */}
      <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          {/* Black left bracket/polygon */}
          <path
            d="M6 5L15 5L9 31L0 31L6 5Z"
            fill="#0B0B0F"
          />
          {/* Top orange wing */}
          <path
            d="M16 5L28 5L20 17L11 17L16 5Z"
            fill="#FF5A00"
          />
          {/* Bottom orange wing */}
          <path
            d="M18 19L27 19L36 31L25 31L18 19Z"
            fill="#FF8A3D"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center leading-none text-left">
        <span className="font-extrabold text-[17px] tracking-tight text-[#0B0B0F] uppercase">
          KASH
        </span>
        <span className="text-[11px] font-semibold text-[#4B5563] tracking-normal -mt-0.5">
          Technology
        </span>
      </div>
    </Link>
  );
}
