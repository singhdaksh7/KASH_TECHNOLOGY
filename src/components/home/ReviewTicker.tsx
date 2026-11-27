"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { Star, Pause, Play, X, Quote } from "lucide-react";
import { VERIFIED_REVIEWS } from "@/data/testimonials";

interface RawReview {
  id?: string;
  name?: string;
  clientName?: string;
  company?: string | null;
  companyName?: string | null;
  location?: string | null;
  country?: string;
  countryCode?: string;
  photoUrl?: string | null;
  fullReview?: string;
  quote?: string;
  shortReview?: string | null;
  rating?: number | null;
  source?: string;
  reviewDate?: string | Date | null;
}

interface ReviewTickerProps {
  className?: string;
}

interface ReviewModalData {
  name: string;
  company?: string | null;
  location?: string | null;
  country: string;
  countryCode: string;
  photoUrl?: string | null;
  fullReview: string;
  rating?: number | null;
  source?: string;
  date?: string | null;
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

function CountryFlag({ code }: { code: string }) {
  if (code === "IN") {
    return (
      <svg className="w-3.5 h-2.5 rounded-[2px] shadow-2xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="India flag">
        <path fill="#f93" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#128807" d="M0 320h640v160H0z"/>
        <circle cx="320" cy="240" r="56" fill="none" stroke="#008" strokeWidth="12"/>
      </svg>
    );
  }
  if (code === "US") {
    return (
      <svg className="w-3.5 h-2.5 rounded-[2px] shadow-2xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="United States flag">
        <path fill="#bd3d44" d="M0 0h640v480H0z"/>
        <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
        <path fill="#192f5d" d="M0 0h260v260H0z"/>
      </svg>
    );
  }
  if (code === "UK" || code === "GB") {
    return (
      <svg className="w-3.5 h-2.5 rounded-[2px] shadow-2xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="United Kingdom flag">
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M640 0 0 480"/>
        <path stroke="#c8102e" strokeWidth="40" d="m0 0 640 480M640 0 0 480"/>
        <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
        <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
      </svg>
    );
  }
  if (code === "AE") {
    return (
      <svg className="w-3.5 h-2.5 rounded-[2px] shadow-2xs shrink-0 inline-block" viewBox="0 0 640 480" aria-label="UAE flag">
        <path fill="#00732f" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#000" d="M0 320h640v160H0z"/>
        <path fill="#f00" d="M0 0h213v480H0z"/>
      </svg>
    );
  }
  return null;
}

function ClientAvatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    return (
      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#FF5A00]/40 shrink-0">
        <Image src={photoUrl} alt={name} fill className="object-cover" />
      </div>
    );
  }

  const initials = name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E1E2A] to-[#14141F] border border-[#FF5A00]/40 flex items-center justify-center shrink-0">
      <span className="text-[10px] font-mono font-bold text-[#FF8A3D]">{initials}</span>
    </div>
  );
}

export function ReviewTicker({ className = "" }: ReviewTickerProps) {
  const [reviews, setReviews] = useState<RawReview[]>(VERIFIED_REVIEWS);
  const [settings, setSettings] = useState<{
    enabled: boolean;
    speed: number;
    pauseOnHover: boolean;
    showFlags: boolean;
    showRatings: boolean;
  }>({
    enabled: true,
    speed: 30,
    pauseOnHover: true,
    showFlags: true,
    showRatings: true,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewModalData | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    fetch("/api/public/showcase")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
        if (data.settings) {
          setSettings({
            enabled: data.settings.tickerEnabled ?? true,
            speed: data.settings.tickerSpeed ?? 30,
            pauseOnHover: data.settings.tickerPauseHover ?? true,
            showFlags: data.settings.showCountryFlags ?? true,
            showRatings: data.settings.showStarRatings ?? true,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  if (!settings.enabled || reviews.length === 0) return null;

  // We repeat items 4 times to guarantee continuous loop filling wide monitors
  const repeatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  // Calculate dynamic animation duration so speed remains constant in px/second
  // Average compact item with separator is ~340px
  const totalWidth = repeatedReviews.length * 340;
  const loopDuration = Math.max(18, Math.round(totalWidth / (settings.speed * 2)));

  const handleOpenReview = (r: RawReview) => {
    setSelectedReview({
      name: r.clientName || r.name || "Client",
      company: r.companyName || r.company,
      location: r.location,
      country: r.country || "India",
      countryCode: r.countryCode || "IN",
      photoUrl: r.photoUrl,
      fullReview: r.fullReview || r.quote || "",
      rating: r.rating ?? 5,
      source: r.source || "Verified Delivery",
      date: r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : null,
    });
  };

  return (
    <>
      <aside
        aria-label="Client testimonials ticker"
        className={`relative w-full bg-[#0B0B0F] text-white border-y border-white/10 overflow-hidden select-none z-20 ${className}`}
      >
        <div className="relative flex items-center h-12 sm:h-13">
          {/* Edge Blur Mask Gradient */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#0B0B0F] to-transparent z-10" />
          <div className="pointer-events-none absolute right-12 sm:right-16 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0B0B0F] to-transparent z-10" />

          {/* Continuous Moving Track */}
          <div
            className={`flex items-center shrink-0 ${
              !prefersReducedMotion ? "animate-ticker-marquee" : ""
            } ${settings.pauseOnHover ? "hover:[animation-play-state:paused]" : ""} ${
              isPaused || selectedReview !== null ? "[animation-play-state:paused!important]" : ""
            }`}
            style={{
              animationDuration: `${loopDuration}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {repeatedReviews.map((r, idx) => {
              const name = r.clientName || r.name || "Client";
              const excerpt = r.shortReview || r.quote || r.fullReview || "";
              const code = r.countryCode || "IN";
              const rating = r.rating ?? 5;

              return (
                <button
                  type="button"
                  key={`${r.id || name}-${idx}`}
                  onClick={() => handleOpenReview(r)}
                  className="flex items-center gap-2.5 px-4 text-xs tracking-normal shrink-0 text-left cursor-pointer hover:bg-white/5 py-1.5 rounded-lg transition-colors group"
                  title="Click to read complete verified review"
                >
                  <ClientAvatar name={name} photoUrl={r.photoUrl} />

                  <span className="font-bold text-white whitespace-nowrap text-xs group-hover:text-[#FF8A3D] transition-colors">
                    {name}
                  </span>

                  {settings.showFlags && <CountryFlag code={code} />}

                  {settings.showRatings && (
                    <span className="flex items-center text-[#FF5A00] shrink-0" aria-label={`${rating} stars`}>
                      {Array.from({ length: Math.min(rating, 5) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </span>
                  )}

                  <span className="text-stone-300 font-normal italic whitespace-nowrap text-xs max-w-[260px] sm:max-w-[340px] truncate">
                    &ldquo;{excerpt}&rdquo;
                  </span>

                  <span className="text-[#FF5A00] font-bold ml-1 text-xs opacity-70 group-hover:opacity-100">
                    &rarr;
                  </span>

                  <span className="text-stone-600 px-3 select-none text-xs">&bull;</span>
                </button>
              );
            })}
          </div>

          {/* Accessible Play/Pause Toggle Control */}
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pl-2 bg-[#0B0B0F] z-20 border-l border-white/10">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume reviews animation" : "Pause reviews animation"}
              className="p-1.5 rounded-md text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* FULL TESTIMONIAL MODAL POPUP */}
      {selectedReview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-[#101018] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative space-y-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close review"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reviewer Header */}
            <div className="flex items-center gap-4">
              <ClientAvatar name={selectedReview.name} photoUrl={selectedReview.photoUrl} />
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedReview.name}</span>
                  <CountryFlag code={selectedReview.countryCode} />
                </h4>
                <div className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5 font-mono">
                  {selectedReview.company && <span>{selectedReview.company}</span>}
                  {selectedReview.location && <span>&bull; {selectedReview.location}</span>}
                  <span>&bull; {selectedReview.country}</span>
                </div>
              </div>
            </div>

            {/* Star Rating */}
            {selectedReview.rating && (
              <div className="flex items-center gap-1 text-[#FF5A00]">
                {Array.from({ length: selectedReview.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-mono text-stone-400 ml-2">
                  {selectedReview.rating}.0 Verified Rating
                </span>
              </div>
            )}

            {/* Complete Testimonial Quote */}
            <div className="relative pl-6 border-l-2 border-[#FF5A00]/50 space-y-2">
              <Quote className="w-6 h-6 text-[#FF5A00]/30 absolute -top-1 -left-3 fill-current" />
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-normal italic">
                &ldquo;{selectedReview.fullReview}&rdquo;
              </p>
            </div>

            {/* Footer Verification Meta */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-500">
              <span>Origin: {selectedReview.source}</span>
              {selectedReview.date && <span>Delivered: {selectedReview.date}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
