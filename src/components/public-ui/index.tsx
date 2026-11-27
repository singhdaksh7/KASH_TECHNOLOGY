"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// 1. SECTION HEADING
// ---------------------------------------------------------------------------
interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        isCenter ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase font-mono px-3 py-1 rounded-full",
            isDark
              ? "bg-white/10 text-[#FF8A3D] border border-white/10"
              : "bg-[#FFF3E9] text-[#FF5A00] border border-[#FF5A00]/20"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
          <span>{eyebrow}</span>
        </div>
      )}

      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.12]",
          isDark ? "text-white" : "text-[#0B0B0F]"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed max-w-2xl font-normal",
            isCenter && "mx-auto",
            isDark ? "text-stone-400" : "text-[#4B5563]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. PRIMARY & SECONDARY BUTTONS
// ---------------------------------------------------------------------------
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}

export function StudioButton({
  href,
  variant = "primary",
  size = "md",
  icon = <ArrowRight className="w-4 h-4" />,
  iconPosition = "right",
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3.5 text-sm font-bold",
    lg: "px-8 py-4 text-base font-bold",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white hover:brightness-105 shadow-md shadow-[#FF5A00]/20 active:scale-[0.98]",
    secondary:
      "bg-white border border-[#E8E5E2] text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] shadow-xs active:scale-[0.98]",
    dark:
      "bg-[#0B0B0F] text-white hover:bg-stone-900 shadow-md active:scale-[0.98]",
    outline:
      "bg-transparent border border-white/20 text-white hover:bg-white/10 active:scale-[0.98]",
  };

  const combinedClasses = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer select-none",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {iconPosition === "left" && icon}
        <span>{children}</span>
        {iconPosition === "right" && icon}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {iconPosition === "left" && icon}
      <span>{children}</span>
      {iconPosition === "right" && icon}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 3. EDITORIAL CASE STUDY ROW (Large Visual Storytelling)
// ---------------------------------------------------------------------------
interface CaseStudyRowProps {
  number: string;
  title: string;
  category: string;
  tagline: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  image: string;
  href: string;
  reverse?: boolean;
}

export function CaseStudyRow({
  number,
  title,
  category,
  tagline,
  challenge,
  solution,
  capabilities,
  image,
  href,
  reverse = false,
}: CaseStudyRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-12 lg:py-16 border-b border-white/10 last:border-none",
        reverse && "lg:grid-flow-dense"
      )}
    >
      {/* Content Column (5 cols) */}
      <div
        className={cn(
          "lg:col-span-5 space-y-6",
          reverse && "lg:col-start-8"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-[#FF5A00] tracking-wider">
            {number}
          </span>
          <span className="w-8 h-px bg-white/20" />
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
            {category}
          </span>
        </div>

        <div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-base text-stone-300 font-medium mt-1">
            {tagline}
          </p>
        </div>

        <div className="space-y-3 text-sm text-stone-400 leading-relaxed">
          <p>
            <strong className="text-stone-200">The Challenge:</strong> {challenge}
          </p>
          <p>
            <strong className="text-stone-200">The Solution:</strong> {solution}
          </p>
        </div>

        {/* Capabilities Pill List */}
        <div className="flex flex-wrap gap-2 pt-1">
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="text-xs px-3 py-1 rounded-md bg-white/[0.06] border border-white/10 text-stone-300 font-mono"
            >
              {cap}
            </span>
          ))}
        </div>

        <div className="pt-3">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5A00] hover:text-[#FF8A3D] group transition-colors"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Media Mockup Column (7 cols) */}
      <div
        className={cn(
          "lg:col-span-7 relative group",
          reverse && "lg:col-start-1"
        )}
      >
        <Link href={href} className="block relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-[#FF5A00]/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}
