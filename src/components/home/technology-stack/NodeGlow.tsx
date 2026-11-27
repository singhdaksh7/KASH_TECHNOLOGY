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
          r={nodeRadius * 1.8}
          fill={nodeColor}
          opacity="0.15"
          filter="url(#node-blur)"
          className={isAmbientGlow ? "animate-pulse" : ""}
        >
          <animate
            attributeName="r"
            values={`${nodeRadius * 1.2};${nodeRadius * 2.2};${nodeRadius * 1.2}`}
            dur="3.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.25;0.05;0.25"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Synchronized Node Ring Anchor */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={nodeRadius}
        fill="none"
        stroke={nodeColor}
        strokeWidth="1.5"
        strokeOpacity={active ? 0.7 : 0.2}
        className="transition-all duration-700"
      />

      {/* Internal Anchor Dot */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={nodeRadius * 0.45}
        fill={nodeColor}
        fillOpacity={active ? 0.85 : 0.25}
        className="transition-all duration-700"
      />
    </g>
  );
}
