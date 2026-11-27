"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { 
  ARCHITECTURE_CONFIGS, 
  type ArchitectureStageConfig 
} from "./architecture-config";
import { SignalPath } from "./SignalPath";
import { NodeGlow } from "./NodeGlow";

interface AnimatedArchitectureProps {
  stageIndex: number;
  active: boolean;
  scrollFactor?: number; // Normalized progress within this stage [0, 1]
  prefersReducedMotion?: boolean;
}

export function AnimatedArchitecture({
  stageIndex,
  active,
  scrollFactor = 0.5,
  prefersReducedMotion = false,
}: AnimatedArchitectureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const config: ArchitectureStageConfig =
    ARCHITECTURE_CONFIGS[stageIndex] || ARCHITECTURE_CONFIGS[0];

  // Subtle pointer-responsive parallax on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    // Keep parallax subtle (+- 6px) to avoid exposing edges
    setMouseOffset({ x: xRatio * 6, y: yRatio * 6 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Continuous scroll-linked zoom and vertical travel
  // Base scale starts at 1.03 (edge-to-edge safe margin) and smoothly travels to 1.06
  // scrollY offset travels smoothly by -8px to +8px
  const scrollScale = prefersReducedMotion ? 1.03 : 1.03 + (scrollFactor * 0.035);
  const scrollTranslateY = prefersReducedMotion ? 0 : (scrollFactor - 0.5) * -12;
  const scrollTranslateX = prefersReducedMotion ? 0 : (scrollFactor - 0.5) * 6;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[1672/941] select-none overflow-hidden"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Subtle Dynamic Ambient Backlight synced to scroll factor */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${50 + (scrollFactor - 0.5) * 20}% ${50 + (scrollFactor - 0.5) * 20}%, rgba(255, 90, 0, ${active ? 0.16 + scrollFactor * 0.08 : 0.02}), transparent 70%)`,
        }}
      />

      {/* Layer 1: Base 3D Architecture Illustration with Unified Continuous Scroll Transform */}
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x + scrollTranslateX}px, ${mouseOffset.y + scrollTranslateY}px, 0) scale(${scrollScale})`,
        }}
      >
        <div className="relative w-full h-full aspect-[1672/941]">
          {/* Base WebP/PNG 3D Architecture Image - Edge to Edge */}
          <picture className="w-full h-full block">
            <source srcSet={config.imageWebp} type="image/webp" />
            <Image
              src={config.imagePng}
              alt={config.title}
              fill
              priority={stageIndex === 0}
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 750px"
              className="object-cover drop-shadow-2xl pointer-events-none block w-full h-full"
            />
          </picture>

          {/* Layer 2 to 5: SVG Alignment Coordinate Overlay */}
          {!prefersReducedMotion && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${config.width} ${config.height}`}
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Reusable Glow Filters */}
                <filter id="node-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="signal-bloom" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="3.5" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Layer 2 & 3: Connection Paths & Moving Signals */}
              {config.paths.map((p, idx) => {
                const packet = config.packets[idx % config.packets.length];
                return (
                  <SignalPath
                    key={p.id}
                    pathConfig={p}
                    packet={packet}
                    active={active}
                  />
                );
              })}

              {/* Layer 4 & 5: Node Illumination & Status Rings */}
              {config.nodes.map((node) => {
                const isAmbient = config.ambientGlowNodes.includes(node.id);
                return (
                  <NodeGlow
                    key={node.id}
                    node={node}
                    active={active}
                    isAmbientGlow={isAmbient}
                  />
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
