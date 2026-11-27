"use client";

import React, { useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import { VERIFIED_REVIEWS, type ClientReview } from "@/data/testimonials";

interface ReviewTickerProps {
  reviews?: ClientReview[];
  className?: string;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ReviewTicker({
  reviews = VERIFIED_REVIEWS,
  className = "",
}: ReviewTickerProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Render a single review item
  const renderReviewItem = (item: ClientReview, index: number, isDuplicate = false) => {
    const ratingCount = item.rating && item.rating > 0 && item.rating <= 5 ? item.rating : 5;
    
    return (
      <div
        key={`${isDuplicate ? "dup-" : "item-"}${item.id || index}`}
        className="inline-flex items-center gap-3 px-4 sm:px-6 shrink-0 whitespace-nowrap group/item"
      >
        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 text-[#FF5A00]" aria-hidden="true">
          {Array.from({ length: ratingCount }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>

        {/* Client Name & Location */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white">
          <span>{item.name}</span>
          {item.location && (
            <span className="text-stone-400 font-normal font-mono text-[11px] sm:text-xs">
              ({item.location})
            </span>
          )}
          <span className="text-stone-500 mx-1">—</span>
        </div>

        {/* Quote */}
        <p className="text-xs sm:text-sm text-stone-300 font-normal italic">
          &ldquo;{item.quote}&rdquo;
        </p>

        {/* Separator Dot */}
        <span className="text-[#FF5A00] font-bold text-base sm:text-lg ml-3 select-none" aria-hidden="true">
          &bull;
        </span>
      </div>
    );
  };

  return (
    <section
      aria-label="Verified Client Feedback"
      className={`relative w-full bg-[#0B0B0F] border-y border-[#FF5A00]/20 py-4 sm:py-5 overflow-hidden select-none sm:select-text ${className}`}
    >
      <div className="relative w-full flex items-center">
        
        {/* Left Edge Static Label */}
        <div className="hidden md:flex items-center gap-2 pl-6 pr-4 shrink-0 border-r border-white/10 z-20 bg-[#0B0B0F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#FF5A00] uppercase whitespace-nowrap">
            CLIENT FEEDBACK
          </span>
        </div>

        {/* Edge Gradient Masks for Soft Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#0B0B0F] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#0B0B0F] to-transparent pointer-events-none z-10" />

        {/* Ticker Container */}
        {prefersReducedMotion ? (
          /* Reduced Motion fallback: clean static/scrollable row without motion loops */
          <div className="w-full flex items-center overflow-x-auto py-1 px-4 scrollbar-none">
            {reviews.map((r, idx) => renderReviewItem(r, idx, false))}
          </div>
        ) : (
          /* Marquee track with hover-to-pause desktop interaction */
          <div className="relative w-full overflow-hidden group">
            <div
              className="flex items-center w-max motion-safe:animate-ticker group-hover:[animation-play-state:paused]"
              style={{
                willChange: "transform",
              }}
            >
              {/* Primary Semantic Track (Read by Screen Readers) */}
              <div className="flex items-center shrink-0">
                {reviews.map((r, idx) => renderReviewItem(r, idx, false))}
              </div>

              {/* Duplicate Visual Track for Seamless Marquee (Hidden from Screen Readers) */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                {reviews.map((r, idx) => renderReviewItem(r, idx, true))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
