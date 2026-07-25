import { useMemo } from "react";

interface Props {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  labels?: string[];
}

export function MiniLineChart({ data, color = "#FF5F1F", height = 100, width = 300, labels }: Props) {
  const points = useMemo(() => {
    if (data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1);
      return `${x},${y}`;
    }).join(" ");
  }, [data, height, width]);

  return (
    <div className="w-full relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-lg"
        />
        {data.map((val, i) => {
          const min = Math.min(...data);
          const max = Math.max(...data);
          const range = max - min || 1;
          const x = (i / (data.length - 1)) * width;
          const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#131313"
              stroke={color}
              strokeWidth="2"
            />
          );
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-2 text-[10px] text-muted">
          {labels.map((label, i) => <span key={i}>{label}</span>)}
        </div>
      )}
      
      {/* Screen reader only text */}
      <div className="sr-only">
        Line chart showing values: {data.join(", ")}
      </div>
    </div>
  );
}
