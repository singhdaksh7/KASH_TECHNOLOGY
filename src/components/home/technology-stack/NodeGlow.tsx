"use client";

import React from "react";
import type { ArchitectureNode } from "./architecture-config";

interface NodeGlowProps {
  node: ArchitectureNode;
  active: boolean;
  isAmbientGlow?: boolean;
}

export function NodeGlow({ node, active, isAmbientGlow }: NodeGlowProps) {
  const nodeRadius = node.r || 18;
  const nodeColor = node.color || "#FF5A00";

  return (
    <g className="node-glow-group">
      {/* Outer Pulse Wave for Ambient or Active Nodes */}
      {active && (
        <circle
          cx={node.cx}
          cy={node.cy}
          r={nodeRadius * 2.2}
          fill={nodeColor}
          opacity="0.25"
          filter="url(#node-blur)"
          className={isAmbientGlow ? "animate-pulse" : ""}
        >
          <animate
            attributeName="r"
            values={`${nodeRadius * 1.4};${nodeRadius * 2.6};${nodeRadius * 1.4}`}
            dur="2.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.35;0.08;0.35"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Synchronized Node Ring Anchor - Brighter illumination */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={nodeRadius}
        fill="none"
        stroke={nodeColor}
        strokeWidth="2"
        strokeOpacity={active ? 0.9 : 0.25}
        className="transition-all duration-500"
      />

      {/* Internal Anchor Dot - High intensity beacon */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={nodeRadius * 0.5}
        fill={nodeColor}
        fillOpacity={active ? 0.95 : 0.3}
        className="transition-all duration-500"
      />
    </g>
  );
}
