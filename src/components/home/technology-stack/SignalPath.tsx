"use client";

import React from "react";
import type { ConnectionPath, PacketSequence } from "./architecture-config";

interface SignalPathProps {
  pathConfig: ConnectionPath;
  packet?: PacketSequence;
  active: boolean;
}

export function SignalPath({ pathConfig, packet, active }: SignalPathProps) {
  const pathId = `path-${pathConfig.id}`;
  const packetColor = packet?.color || pathConfig.color || "#FF5A00";
  const coreColor = packet?.coreColor || "#FFFFFF";
  const duration = packet?.duration || 1.8;
  const delay = packet?.delay || 0;

  return (
    <g className="signal-path-group">
      {/* Background Cable Guide Line */}
      <path
        d={pathConfig.path}
        id={pathId}
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Active Glowing Bus Line */}
      <path
        d={pathConfig.path}
        fill="none"
        stroke={packetColor}
        strokeWidth="2"
        strokeOpacity={active ? 0.45 : 0.08}
        strokeLinecap="round"
        className="transition-all duration-500"
      />

      {/* Moving Signal Packet with Core and Visible Glow Trail */}
      {active && (
        <g>
          {/* Outer Soft Light Glow with bloom filter */}
          <circle r="14" fill={packetColor} opacity="0.45" filter="url(#node-blur)">
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
              rotate="auto"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>

          {/* Medium Aura Glow */}
          <circle r="7.5" fill={packetColor} opacity="0.85" filter="url(#signal-bloom)">
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
              rotate="auto"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>

          {/* Sharp High-Intensity Core */}
          <circle r="3.5" fill={coreColor}>
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
              rotate="auto"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        </g>
      )}
    </g>
  );
}
