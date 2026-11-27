"use client";

import React, { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { StudioButton } from "@/components/public-ui";

interface HeroTypewriterProps {
  onSequenceComplete?: () => void;
}

const STEP1_TEXT = "TECHNOLOGY • CREATIVE • GROWTH STUDIO";
const STEP2_WORDS = ["BUILD.", "CREATE.", "GROW."];
const STEP3_LINE1 = "We build digital products";
const STEP3_LINE2 = "that move businesses forward.";
const STEP4_TEXT =
  "KASH Technology is an integrated studio combining custom software engineering, premium creative content, and performance acquisition under one roof.";
const STEP4_WORDS = STEP4_TEXT.split(" ");

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
  // Step 1: Characters of eyebrow
  const [step1CharCount, setStep1CharCount] = useState(0);

  // Step 2: Words of BUILD. CREATE. GROW. (0..3)
  const [step2WordCount, setStep2WordCount] = useState(0);

  // Step 3: Characters of main headline Line 1 and Line 2
  const [step3Line1CharCount, setStep3Line1CharCount] = useState(0);
  const [step3Line2CharCount, setStep3Line2CharCount] = useState(0);

  // Step 4: Words of supporting paragraph (0..STEP4_WORDS.length)
  const [step4WordCount, setStep4WordCount] = useState(0);

  // CTA visibility (activates right when main headline finishes)
  const [showCta, setShowCta] = useState(false);

  // Cursor state
  const [cursorVisible, setCursorVisible] = useState(false);
  const [activeCursorTarget, setActiveCursorTarget] = useState<"step1" | "step3_1" | "step3_2" | null>(null);

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

    // Start typing
    addTimeout(() => {
      setActiveCursorTarget("step1");
      setCursorVisible(true);
    }, timeline);

    // STEP 1: TECHNOLOGY • CREATIVE • GROWTH STUDIO (char-by-char)
    for (let i = 1; i <= STEP1_TEXT.length; i++) {
      timeline += 22;
      const count = i;
      addTimeout(() => {
        setStep1CharCount(count);
      }, timeline);
    }

    // Pause after Step 1 completion
    timeline += 150;
    addTimeout(() => {
      setActiveCursorTarget(null);
    }, timeline);

    // STEP 2: BUILD. CREATE. GROW. (word-by-word)
    for (let w = 1; w <= STEP2_WORDS.length; w++) {
      timeline += 140;
      const wordIndex = w;
      addTimeout(() => {
        setStep2WordCount(wordIndex);
      }, timeline);
    }

    // Pause between Step 2 and Step 3
    timeline += 180;

    // STEP 3: Main Headline Line 1
    addTimeout(() => {
      setActiveCursorTarget("step3_1");
    }, timeline);

    for (let c1 = 1; c1 <= STEP3_LINE1.length; c1++) {
      timeline += 32;
      const count1 = c1;
      addTimeout(() => {
        setStep3Line1CharCount(count1);
      }, timeline);
    }

    // Switch cursor to line 2
    timeline += 80;
    addTimeout(() => {
      setActiveCursorTarget("step3_2");
    }, timeline);

    for (let c2 = 1; c2 <= STEP3_LINE2.length; c2++) {
      timeline += 32;
      const count2 = c2;
      addTimeout(() => {
        setStep3Line2CharCount(count2);
      }, timeline);
    }

    // Headline completes: reveal CTA buttons immediately to eliminate conversion friction
    timeline += 60;
    addTimeout(() => {
      setShowCta(true);
    }, timeline);

    // Keep cursor blinking for 500ms after headline completes, then fade out
    timeline += 500;
    addTimeout(() => {
      setCursorVisible(false);
      setActiveCursorTarget(null);
    }, timeline);

    // STEP 4: Supporting paragraph (word-by-word, 26ms per word)
    for (let pw = 1; pw <= STEP4_WORDS.length; pw++) {
      timeline += 26;
      const wordCount = pw;
      addTimeout(() => {
        setStep4WordCount(wordCount);
      }, timeline);
    }

    addTimeout(() => {
      onSequenceComplete?.();
    }, timeline + 100);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReducedMotion, onSequenceComplete]);

  // When prefersReducedMotion is true, instantly expose full text
  const effectiveStep1Count = prefersReducedMotion ? STEP1_TEXT.length : step1CharCount;
  const effectiveStep2Count = prefersReducedMotion ? STEP2_WORDS.length : step2WordCount;
  const effectiveStep3Line1Count = prefersReducedMotion ? STEP3_LINE1.length : step3Line1CharCount;
  const effectiveStep3Line2Count = prefersReducedMotion ? STEP3_LINE2.length : step3Line2CharCount;
  const effectiveStep4Count = prefersReducedMotion ? STEP4_WORDS.length : step4WordCount;
  const effectiveShowCta = prefersReducedMotion ? true : showCta;

  return (
    <div className="max-w-4xl space-y-6 select-none sm:select-text">
      
      {/* ============================================================== */}
      {/* 1. EYEBROW BADGE (Step 1)                                       */}
      {/* Zero layout shift: Full text rendered transparently as spacer   */}
      {/* ============================================================== */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E9] border border-[#FF5A00]/25 text-[#FF5A00] text-xs font-bold font-mono tracking-wider uppercase relative overflow-hidden"
        aria-label={STEP1_TEXT}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] shrink-0" />
        
        {/* Visual Layer */}
        <span aria-hidden="true" className="inline-block relative">
          {/* Reserved space container */}
          <span className="invisible opacity-0">{STEP1_TEXT}</span>
          
          {/* Visible typing overlay */}
          <span className="absolute left-0 top-0 whitespace-nowrap">
            {STEP1_TEXT.slice(0, effectiveStep1Count)}
            {cursorVisible && activeCursorTarget === "step1" && (
              <span className="inline-block ml-0.5 w-[2px] h-[1em] align-middle bg-[#FF5A00] animate-pulse" />
            )}
          </span>
        </span>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN HEADLINE (Step 2 & Step 3)                             */}
      {/* ============================================================== */}
      <h1
        className="text-5xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight leading-[1.08] text-[#0B0B0F]"
        aria-label="BUILD. CREATE. GROW. We build digital products that move businesses forward."
      >
        {/* STEP 2: BUILD. CREATE. GROW. (Word-by-word confident reveal) */}
        <span className="block mb-2 overflow-hidden" aria-hidden="true">
          {/* Word 1: BUILD. */}
          <span
            className={`inline-block mr-3 transition-all duration-300 transform ${
              effectiveStep2Count >= 1
                ? "opacity-100 translate-y-0 text-[#FF5A00]"
                : "opacity-0 translate-y-3"
            }`}
          >
            BUILD.
          </span>

          {/* Word 2: CREATE. */}
          <span
            className={`inline-block mr-3 transition-all duration-300 transform ${
              effectiveStep2Count >= 2
                ? "opacity-100 translate-y-0 text-[#0B0B0F]"
                : "opacity-0 translate-y-3"
            }`}
          >
            CREATE.
          </span>

          {/* Word 3: GROW. */}
          <span
            className={`inline-block transition-all duration-300 transform ${
              effectiveStep2Count >= 3
                ? "opacity-100 translate-y-0 text-[#FF5A00]"
                : "opacity-0 translate-y-3"
            }`}
          >
            GROW.
          </span>
        </span>

        {/* STEP 3: Controlled Two-Line Headline (Char-by-char with #FF5A00 caret) */}
        <span className="block" aria-hidden="true">
          {/* Line 1: We build digital products */}
          <span className="relative block text-[#FF5A00]">
            {/* Space reservation */}
            <span className="invisible opacity-0 select-none">{STEP3_LINE1}</span>
            {/* Typing overlay */}
            <span className="absolute left-0 top-0 whitespace-nowrap">
              {STEP3_LINE1.slice(0, effectiveStep3Line1Count)}
              {cursorVisible && activeCursorTarget === "step3_1" && (
                <span className="inline-block ml-1 w-[3px] h-[0.88em] align-middle bg-[#FF5A00] animate-pulse" />
              )}
            </span>
          </span>

          {/* Line 2: that move businesses forward. */}
          <span className="relative block text-[#0B0B0F]">
            {/* Space reservation */}
            <span className="invisible opacity-0 select-none">{STEP3_LINE2}</span>
            {/* Typing overlay */}
            <span className="absolute left-0 top-0 whitespace-nowrap">
              {STEP3_LINE2.slice(0, effectiveStep3Line2Count)}
              {cursorVisible && activeCursorTarget === "step3_2" && (
                <span className="inline-block ml-1 w-[3px] h-[0.88em] align-middle bg-[#FF5A00] animate-pulse" />
              )}
            </span>
          </span>
        </span>
      </h1>

      {/* ============================================================== */}
      {/* 3. SUPPORTING PARAGRAPH (Step 4: Word-by-word smooth reveal)   */}
      {/* ============================================================== */}
      <p
        className="text-lg sm:text-xl text-[#4B5563] max-w-2xl leading-relaxed font-normal relative"
        aria-label={STEP4_TEXT}
      >
        {/* Space reservation */}
        <span className="invisible opacity-0 select-none" aria-hidden="true">
          {STEP4_TEXT}
        </span>

        {/* Word-by-word visual overlay */}
        <span className="absolute left-0 top-0 block" aria-hidden="true">
          {STEP4_WORDS.map((word, idx) => {
            const isVisible = idx < effectiveStep4Count;
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
      {/* 4. HERO CTA BUTTONS (Fade-in directly as headline completes)   */}
      {/* ============================================================== */}
      <div
        className={`flex flex-wrap items-center gap-4 pt-4 transition-all duration-500 transform ${
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
