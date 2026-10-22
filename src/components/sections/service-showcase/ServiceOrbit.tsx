"use client";

import React from "react";
import Image from "next/image";
import { SHOWCASE_SERVICES } from "./showcase-data";

interface ServiceOrbitProps {
  activeIndex: number;
  rotationAngle: number;
  onSelectService?: (index: number) => void;
  shouldReduceMotion?: boolean | null;
}

export function ServiceOrbit({
  activeIndex,
  rotationAngle,
  onSelectService,
  shouldReduceMotion = false,
}: ServiceOrbitProps) {
  // We place 6 nodes around the orbit ring at 60 degree increments
  const nodes = SHOWCASE_SERVICES.map((service, index) => {
    const baseAngle = index * 60 - 90; // Start 01 at the top (-90deg)
    return {
      index,
      service,
      baseAngle,
    };
  });

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] lg:w-[400px] lg:h-[400px] flex items-center justify-center select-none shrink-0">
      {/* Background Soft Radial Glow */}
      <div 
        className="absolute inset-0 bg-radial from-[#f36b21]/20 via-[#c5a880]/5 to-transparent blur-3xl pointer-events-none transition-all duration-700" 
      />

      {/* Outer Technical Circuit Traces SVG */}
      <svg
        className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)] pointer-events-none"
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-Right Circuit Trace */}
        <path
          d="M 240 30 L 370 30 L 420 80 L 420 180"
          stroke="#f36b21"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          fill="none"
        />
        <circle cx="240" cy="30" r="3" fill="#f36b21" />
        <circle cx="420" cy="180" r="3.5" fill="#c5a880" />

        {/* Bottom-Left Circuit Trace */}
        <path
          d="M 60 300 L 60 400 L 150 450 L 240 450"
          stroke="#c5a880"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          fill="none"
        />
        <circle cx="60" cy="300" r="3.5" fill="#f36b21" />
        <circle cx="240" cy="450" r="3" fill="#c5a880" />

        {/* Diagonal Crosshair Accents */}
        <line x1="80" y1="100" x2="130" y2="50" stroke="#f36b21" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
        <line x1="400" y1="380" x2="350" y2="430" stroke="#c5a880" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
      </svg>

      {/* Outer Static Track Ring with Gold & Bronze Ticks */}
      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none">
        {/* 12 Clock-style Tick Marks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 origin-bottom pointer-events-none"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-2px)`,
              backgroundColor: i % 3 === 0 ? "#f36b21" : "rgba(197, 168, 128, 0.3)",
            }}
          />
        ))}
      </div>

      {/* Rotating Orbit Ring (Carries the 6 Service Nodes) */}
      <div
        className="absolute inset-[4%] rounded-full border border-dashed border-[#f36b21]/40 transition-transform duration-500 ease-out"
        style={{
          transform: shouldReduceMotion ? "none" : `rotate(${rotationAngle}deg)`,
        }}
      >
        {/* 6 Orbit Nodes */}
        {nodes.map(({ index, service, baseAngle }) => {
          const isActive = activeIndex === index;
          // Calculate node position in percentage coordinates around the circle
          const rad = (baseAngle * Math.PI) / 180;
          const radiusPercent = 50; // on the perimeter of this 100% circle
          const leftPercent = 50 + radiusPercent * Math.cos(rad);
          const topPercent = 50 + radiusPercent * Math.sin(rad);

          return (
            <button
              key={service.id}
              onClick={() => onSelectService && onSelectService(index)}
              title={`Switch to ${service.title}`}
              aria-label={`Service ${service.number}: ${service.title}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21] group ${
                isActive
                  ? "w-8 h-8 z-30"
                  : "w-6 h-6 z-20 hover:scale-125"
              }`}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                // Counter-rotate the node text so it remains upright and readable
                transform: `translate(-50%, -50%) rotate(${shouldReduceMotion ? 0 : -rotationAngle}deg)`,
              }}
            >
              {/* Outer pulsing ring for active node */}
              {isActive && (
                <span className="absolute -inset-1.5 rounded-full bg-[#f36b21]/30 animate-ping pointer-events-none" />
              )}

              {/* Node Body */}
              <div
                className={`w-full h-full rounded-full flex items-center justify-center font-mono font-bold transition-all ${
                  isActive
                    ? "bg-[#f36b21] text-white shadow-[0_0_15px_#f36b21] border-2 border-white text-xs"
                    : "bg-[#0b0e14] text-[#c5a880] border border-[#c5a880]/60 hover:border-[#f36b21] hover:text-[#f36b21] text-[10px]"
                }`}
              >
                {service.number}
              </div>

              {/* Subtle hover tooltip showing service title */}
              <span className="sr-only sm:not-sr-only opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] font-mono text-white shadow-lg">
                {service.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Middle Counter-Rotating Decorative Ring */}
      <div
        className="absolute inset-[15%] rounded-full border border-[#c5a880]/30 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: shouldReduceMotion ? "none" : `rotate(${-rotationAngle * 0.6}deg)`,
        }}
      >
        <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-[#c5a880]" />
        <span className="absolute bottom-2 left-6 w-2 h-2 rounded-full bg-[#f36b21]" />
        <span className="absolute top-1/2 -left-1 w-1.5 h-1.5 rounded-full bg-white/60" />
      </div>

      {/* Inner Fixed High-Contrast Glow Ring */}
      <div className="absolute inset-[24%] rounded-full border-2 border-[#f36b21]/60 pointer-events-none shadow-[0_0_25px_rgba(243,107,33,0.35)]" />

      {/* Inner Thin Gold Guide Ring */}
      <div className="absolute inset-[26%] rounded-full border border-[#c5a880]/40 pointer-events-none" />

      {/* Central Circular Official KASH Emblem */}
      <div className="relative z-10 w-[42%] h-[42%] rounded-full overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(243,107,33,0.3)] border-2 border-[#f36b21]/50 bg-white flex items-center justify-center group">
        <Image
          src="/images/logo/kash-logo-emblem.jpg"
          alt="KASH Technology Official Emblem"
          fill
          sizes="(max-width: 768px) 140px, 180px"
          className="object-cover scale-105"
          priority
        />
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
