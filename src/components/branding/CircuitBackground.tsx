import React from "react";

interface CircuitBackgroundProps {
  variant?: "dark" | "ivory";
  className?: string;
}

export function CircuitBackground({ variant = "dark", className = "" }: CircuitBackgroundProps) {
  const isDark = variant === "dark";

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Grid Pattern overlay */}
      <div 
        className={`absolute inset-0 ${isDark ? 'circuit-pattern-dark' : 'circuit-pattern-ivory'} opacity-40`} 
      />

      {/* Decorative Circuit SVG paths in corners */}
      <svg
        className="absolute w-full h-full inset-0 pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`circuit-grid-${variant}`} width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 10 10 L 60 10 L 80 30 L 110 30 M 110 30 L 110 90 L 90 110 M 10 110 L 10 70 L 30 50"
              fill="none"
              stroke={isDark ? "#e86024" : "#e86024"}
              strokeWidth="1"
              strokeOpacity={isDark ? "0.3" : "0.2"}
            />
            <circle cx="10" cy="10" r="2" fill={isDark ? "#e86024" : "#c5a880"} />
            <circle cx="110" cy="90" r="2" fill={isDark ? "#c5a880" : "#e86024"} />
            <circle cx="30" cy="50" r="2" fill={isDark ? "#e86024" : "#c5a880"} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#circuit-grid-${variant})`} />
      </svg>
    </div>
  );
}
