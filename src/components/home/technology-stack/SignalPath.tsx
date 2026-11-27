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
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Active Glowing Bus Line */}
      <path
        d={pathConfig.path}
        fill="none"
        stroke={packetColor}
        strokeWidth="1.5"
        strokeOpacity={active ? 0.35 : 0.05}
        strokeLinecap="round"
        className="transition-all duration-700"
      />

      {/* Moving Signal Packet with Core and Glow Trail */}
      {active && (
        <g>
          {/* Outer Soft Light Glow */}
          <circle r="9" fill={packetColor} opacity="0.4" filter="url(#node-blur)">
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
          <circle r="5" fill={packetColor} opacity="0.8">
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
          <circle r="2.5" fill={coreColor}>
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
