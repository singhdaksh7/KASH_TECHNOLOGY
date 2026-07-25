import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "elevated" | "outline";
}

const VARIANT_CLASSES = {
  flat: "bg-surface",
  elevated: "bg-surface-elevated shadow-lg shadow-black/20",
  outline: "bg-transparent border border-border",
} as const;

export function Card({ variant = "flat", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] p-6",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
