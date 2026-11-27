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
  prefersReducedMotion?: boolean;
}

export function AnimatedArchitecture({
  stageIndex,
  active,
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
    setMouseOffset({ x: xRatio * 10, y: yRatio * 10 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] lg:min-h-[520px] flex items-center justify-center overflow-hidden rounded-3xl select-none"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Subtle Dynamic Ambient Backlight */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 90, 0, ${active ? 0.12 : 0.02}), transparent 70%)`,
        }}
      />

      {/* Layer 1: Base 3D Architecture Illustration with Restrained Parallax */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) scale(${active ? 1.02 : 0.98})`,
        }}
      >
        <div className="relative w-full aspect-[1672/941] max-w-[720px] max-h-[500px]">
          {/* Base WebP/PNG 3D Architecture Image */}
          <picture className="w-full h-full block">
            <source srcSet={config.imageWebp} type="image/webp" />
            <Image
              src={config.imagePng}
              alt={config.title}
              fill
              priority={stageIndex === 0}
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-contain drop-shadow-2xl pointer-events-none"
            />
          </picture>

          {/* Layer 2 to 5: SVG Alignment Coordinate Overlay */}
          {!prefersReducedMotion && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${config.width} ${config.height}`}
              preserveAspectRatio="xMidYMid meet"
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
