"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

interface Client {
  id: string;
  name: string;
  logoUrl?: string | null;
  country: string;
  countryCode: string;
  websiteUrl?: string | null;
  showInMarquee: boolean;
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

export function ClientLogoMarquee() {
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<{
    enabled: boolean;
    speed: number;
    heading: string;
    grayscale: boolean;
  }>({
    enabled: true,
    speed: 25,
    heading: "Trusted by businesses we work with.",
    grayscale: true,
  });
  const [isPaused] = useState(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    fetch("/api/public/showcase")
      .then((r) => r.json())
      .then((data) => {
        if (data.clients && data.clients.length > 0) {
          setClients(data.clients);
        }
        if (data.settings) {
          setSettings({
            enabled: data.settings.marqueeEnabled ?? true,
            speed: data.settings.marqueeSpeed ?? 25,
            heading: data.settings.marqueeHeading || "Trusted by businesses we work with.",
            grayscale: data.settings.marqueeGrayscale ?? true,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  if (!settings.enabled || clients.length === 0) return null;

  // Repeat clients to form continuous infinite loop
  const repeatedClients = [...clients, ...clients, ...clients, ...clients];
  const totalWidth = repeatedClients.length * 240;
  const loopDuration = Math.max(16, Math.round(totalWidth / (settings.speed * 2)));

  return (
    <section 
      aria-label="Client company logos"
      className="py-12 sm:py-16 bg-[#FFF9F4] border-t border-stone-200/60 overflow-hidden select-none"
    >
      <Container className="mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="w-full text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A00] uppercase block mb-1">
              PROVEN PARTNERSHIPS
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#0B0B0F] tracking-tight">
              {settings.heading}
            </h3>
          </div>
        </div>
      </Container>

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Edge Gradient Masks for Soft Vignette */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FFF9F4] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FFF9F4] to-transparent z-10" />

        <div
          className={`flex items-center gap-8 sm:gap-14 shrink-0 ${
            !prefersReducedMotion ? "animate-ticker-marquee" : ""
          } hover:[animation-play-state:paused] ${
            isPaused ? "[animation-play-state:paused!important]" : ""
          }`}
          style={{
            animationDuration: `${loopDuration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {repeatedClients.map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className="flex items-center justify-center shrink-0 h-14 sm:h-16 px-4 group transition-all"
            >
              {client.logoUrl ? (
                <div
                  className={`relative w-28 sm:w-36 h-10 transition-all duration-300 ${
                    settings.grayscale
                      ? "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                      : "opacity-80 group-hover:opacity-100"
                  }`}
                >
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="px-5 py-2 rounded-xl bg-white/70 border border-stone-200/80 shadow-2xs group-hover:border-[#FF5A00]/40 group-hover:bg-white transition-all flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
                  <span className="text-xs sm:text-sm font-extrabold text-[#0B0B0F] tracking-tight whitespace-nowrap group-hover:text-[#FF5A00] transition-colors font-mono">
                    {client.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
