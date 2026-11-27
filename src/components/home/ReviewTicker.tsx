"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Star, Pause, Play } from "lucide-react";
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

/**
 * High-quality SVG country flags
 */
function CountryFlag({ code }: { code: string }) {
  if (code === "IN") {
    return (
      <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="India flag">
        <path fill="#f93" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#128807" d="M0 320h640v160H0z"/>
        <circle cx="320" cy="240" r="56" fill="none" stroke="#008" strokeWidth="12"/>
      </svg>
    );
  }
  if (code === "US") {
    return (
      <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="United States flag">
        <path fill="#bd3d44" d="M0 0h640v480H0z"/>
        <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
        <path fill="#192f5d" d="M0 0h260v260H0z"/>
      </svg>
    );
  }
  if (code === "UK" || code === "GB") {
    return (
      <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="United Kingdom flag">
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M640 0 0 480"/>
        <path stroke="#c8102e" strokeWidth="40" d="m0 0 640 480M640 0 0 480"/>
        <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
        <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
      </svg>
    );
  }
  return null;
}

/**
 * Generate clean deterministic initials avatar
 */
function ClientAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  if (photoUrl) {
    return (
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#FF5A00]/40 shrink-0 shadow-sm">
        <Image src={photoUrl} alt={name} fill className="object-cover" />
      </div>
    );
  }

  // Initials
  const initials = name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#1E1E2A] to-[#12121A] border border-[#FF5A00]/40 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-[11px] sm:text-xs font-mono font-bold text-[#FF8A3D]">{initials}</span>
    </div>
  );
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

  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Requirement: Use only approved, authentic testimonials. If empty, hide ticker.
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Render a single review item
  const renderReviewItem = (item: ClientReview, index: number, isDuplicate = false) => {
    const ratingCount = item.rating && item.rating > 0 && item.rating <= 5 ? item.rating : 5;
    
    return (
      <div
        key={`${isDuplicate ? "dup-" : "item-"}${item.id || index}`}
        className="inline-flex items-center gap-3 px-5 sm:px-7 shrink-0 whitespace-nowrap group/item"
      >
        {/* Client Profile Photo / Initials Avatar */}
        <ClientAvatar name={item.name} photoUrl={item.photoUrl} />

        {/* Client Name */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white">
          <span>{item.name}</span>
        </div>

        {/* Country Flag & Name */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-stone-300">
          <CountryFlag code={item.countryCode} />
          <span>{item.location ? `${item.location}, ${item.country}` : item.country}</span>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 text-[#FF5A00]" aria-label={`${ratingCount} out of 5 stars`}>
          {Array.from({ length: ratingCount }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>

        <span className="text-stone-500">—</span>

        {/* Authentic Review Quote */}
        <p className="text-xs sm:text-sm text-stone-200 font-normal italic">
          &ldquo;{item.quote}&rdquo;
        </p>

        {/* Separator Dot */}
        <span className="text-[#FF5A00] font-bold text-base sm:text-lg ml-4 select-none" aria-hidden="true">
          &bull;
        </span>
      </div>
    );
  };

  return (
    <section
      aria-label="Verified Client Feedback"
      className={`relative w-full bg-[#0B0B0F] border-b border-[#FF5A00]/25 py-2.5 sm:py-3 overflow-hidden select-none sm:select-text z-30 ${className}`}
    >
      <div className="relative w-full flex items-center">
        
        {/* Left Edge Static Label & Accessible Pause Control */}
        <div className="flex items-center gap-2 pl-4 sm:pl-6 pr-3 sm:pr-4 shrink-0 border-r border-white/10 z-20 bg-[#0B0B0F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#FF5A00] uppercase whitespace-nowrap">
            CLIENT FEEDBACK
          </span>

          {/* Accessible Pause/Play Button */}
          {!prefersReducedMotion && (
            <button
              type="button"
              onClick={() => setIsManuallyPaused((prev) => !prev)}
              aria-label={isManuallyPaused ? "Resume reviews animation" : "Pause reviews animation"}
              className="ml-1.5 p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#FF5A00]"
              title={isManuallyPaused ? "Resume ticker" : "Pause ticker"}
            >
              {isManuallyPaused ? (
                <Play className="w-3 h-3 text-[#FF5A00]" />
              ) : (
                <Pause className="w-3 h-3" />
              )}
            </button>
          )}
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
          /* Marquee track with hover-to-pause and button pause interaction */
          <div className="relative w-full overflow-hidden group">
            <div
              className={`flex items-center w-max motion-safe:animate-ticker group-hover:[animation-play-state:paused] ${
                isManuallyPaused ? "[animation-play-state:paused!important]" : ""
              }`}
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
