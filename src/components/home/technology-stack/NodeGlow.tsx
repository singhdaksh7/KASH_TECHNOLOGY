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

      {/* Node Status Indicator Pill / Tag on Hover/Active */}
      {active && (
        <g className="transition-opacity duration-500 opacity-90">
          <rect
            x={node.cx - 50}
            y={node.cy + nodeRadius + 8}
            width="100"
            height="18"
            rx="9"
            fill="rgba(11, 11, 15, 0.85)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
          />
          <text
            x={node.cx}
            y={node.cy + nodeRadius + 20}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {node.name.split("/")[0].trim().slice(0, 16)}
          </text>
        </g>
      )}
    </g>
  );
}
