"use client";

import React, { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { StudioButton } from "@/components/public-ui";

interface HeroTypewriterProps {
  onSequenceComplete?: () => void;
}

const STEP1_LINE1 = "We build digital products";
const STEP1_LINE2 = "that move businesses forward.";
const STEP2_TEXT =
  "KASH Technology is an integrated studio combining custom software engineering, premium creative content, and performance acquisition under one roof.";
const STEP2_WORDS = STEP2_TEXT.split(" ");

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

export function HeroTypewriter({ onSequenceComplete }: HeroTypewriterProps) {
  // Respect prefers-reduced-motion without cascading effect state updates
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Progressive reveal counts:
  // Step 1: Characters of main headline Line 1 and Line 2
  const [line1CharCount, setLine1CharCount] = useState(0);
  const [line2CharCount, setLine2CharCount] = useState(0);

  // Step 2: Words of supporting paragraph
  const [paraWordCount, setParaWordCount] = useState(0);

  // CTA visibility (activates right when main headline finishes)
  const [showCta, setShowCta] = useState(false);

  // Cursor state
  const [cursorVisible, setCursorVisible] = useState(false);
  const [activeCursorTarget, setActiveCursorTarget] = useState<"line1" | "line2" | null>(null);

  // Sequence completion tracker to prevent re-running
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      onSequenceComplete?.();
      return;
    }

    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const timeouts: NodeJS.Timeout[] = [];
    const addTimeout = (fn: () => void, delayMs: number) => {
      const id = setTimeout(fn, delayMs);
      timeouts.push(id);
      return id;
    };

    let timeline = 50;

    // Start typing immediately: Line 1
    addTimeout(() => {
      setActiveCursorTarget("line1");
      setCursorVisible(true);
    }, timeline);

    for (let c1 = 1; c1 <= STEP1_LINE1.length; c1++) {
      timeline += 28;
      const count1 = c1;
      addTimeout(() => {
        setLine1CharCount(count1);
      }, timeline);
    }

    // Switch cursor to line 2
    timeline += 60;
    addTimeout(() => {
      setActiveCursorTarget("line2");
    }, timeline);

    for (let c2 = 1; c2 <= STEP1_LINE2.length; c2++) {
      timeline += 28;
      const count2 = c2;
      addTimeout(() => {
        setLine2CharCount(count2);
      }, timeline);
    }

    // Headline completes: reveal CTA buttons immediately to eliminate conversion friction
    timeline += 40;
    addTimeout(() => {
      setShowCta(true);
    }, timeline);

    // Keep cursor blinking for 400ms after headline completes, then fade out
    timeline += 400;
    addTimeout(() => {
      setCursorVisible(false);
      setActiveCursorTarget(null);
    }, timeline);

    // Step 2: Supporting paragraph (smooth word-by-word reveal)
    timeline += 60;
    for (let p = 1; p <= STEP2_WORDS.length; p++) {
      timeline += 24;
      const wordIdx = p;
      addTimeout(() => {
        setParaWordCount(wordIdx);
      }, timeline);
    }

    // Notify parent on complete
    addTimeout(() => {
      onSequenceComplete?.();
    }, timeline + 100);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReducedMotion, onSequenceComplete]);

  // Fallback values for reduced-motion users (render everything immediately)
  const effectiveLine1Count = prefersReducedMotion ? STEP1_LINE1.length : line1CharCount;
  const effectiveLine2Count = prefersReducedMotion ? STEP1_LINE2.length : line2CharCount;
  const effectiveParaCount = prefersReducedMotion ? STEP2_WORDS.length : paraWordCount;
  const effectiveShowCta = prefersReducedMotion ? true : showCta;

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-center flex flex-col items-center">
      {/* ============================================================== */}
      {/* 1. MAIN HEADLINE (Begins directly with We build digital...)    */}
      {/* ============================================================== */}
      <h1
        className="text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-extrabold tracking-tight leading-[1.12] sm:leading-[1.08] text-[#0B0B0F] max-w-4xl mx-auto text-center"
        aria-label="We build digital products that move businesses forward."
      >
        <span className="block text-center" aria-hidden="true">
          {/* Line 1: We build digital products */}
          <span className="relative block text-[#0B0B0F]">
            {/* Space reservation */}
            <span className="invisible opacity-0 select-none">{STEP1_LINE1}</span>
            {/* Typing overlay */}
            <span className="absolute inset-x-0 top-0 text-center whitespace-normal">
              {STEP1_LINE1.slice(0, effectiveLine1Count)}
              {cursorVisible && activeCursorTarget === "line1" && (
                <span className="inline-block ml-1 w-[3px] h-[0.88em] align-middle bg-[#FF5A00] animate-pulse" />
              )}
            </span>
          </span>

          {/* Line 2: that move businesses forward. */}
          <span className="relative block text-[#FF5A00]">
            {/* Space reservation */}
            <span className="invisible opacity-0 select-none">{STEP1_LINE2}</span>
            {/* Typing overlay */}
            <span className="absolute inset-x-0 top-0 text-center whitespace-normal">
              {STEP1_LINE2.slice(0, effectiveLine2Count)}
              {cursorVisible && activeCursorTarget === "line2" && (
                <span className="inline-block ml-1 w-[3px] h-[0.88em] align-middle bg-[#FF5A00] animate-pulse" />
              )}
            </span>
          </span>
        </span>
      </h1>

      {/* ============================================================== */}
      {/* 2. SUPPORTING PARAGRAPH (Word-by-word smooth reveal)           */}
      {/* ============================================================== */}
      <p
        className="text-lg sm:text-xl text-[#4B5563] max-w-2xl mx-auto text-center leading-relaxed font-normal relative"
        aria-label={STEP2_TEXT}
      >
        {/* Space reservation */}
        <span className="invisible opacity-0 select-none" aria-hidden="true">
          {STEP2_TEXT}
        </span>

        {/* Word-by-word visual overlay */}
        <span className="absolute inset-x-0 top-0 block text-center" aria-hidden="true">
          {STEP2_WORDS.map((word, idx) => {
            const isVisible = idx < effectiveParaCount;
            return (
              <span
                key={idx}
                className={`inline-block mr-1.5 transition-all duration-200 transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1"
                }`}
              >
                {word}
              </span>
            );
          })}
        </span>
      </p>

      {/* ============================================================== */}
      {/* 3. HERO CTA BUTTONS (Fade-in directly as headline completes)   */}
      {/* ============================================================== */}
      <div
        className={`flex flex-wrap items-center justify-center gap-4 pt-2 transition-all duration-500 transform ${
          effectiveShowCta
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <StudioButton href="/contact" size="lg" variant="primary">
          Start Your Project
        </StudioButton>
        <StudioButton href="/portfolio" size="lg" variant="secondary">
          Explore Our Work
        </StudioButton>
      </div>
    </div>
  );
}
