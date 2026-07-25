import { useMemo } from "react";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DataPoint[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ data, size = 120, strokeWidth = 16 }: Props) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data.reduce((acc, item, index) => {
      const percentage = item.value / total;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      
      const previousOffset = index === 0 ? 0 : acc[index - 1].nextOffset;
      const strokeDashoffset = -previousOffset;
      const nextOffset = previousOffset + (percentage * circumference);

      acc.push({
        ...item,
        percentage,
        strokeDasharray,
        strokeDashoffset,
        nextOffset
      });
      
      return acc;
    }, [] as Array<DataPoint & { percentage: number; strokeDasharray: string; strokeDashoffset: number; nextOffset: number }>);
  }, [data, circumference]);

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          
          {/* Data Segments */}
          {segments.map((segment, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[10px] text-muted">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Screen reader only text */}
      <div className="sr-only">
        Donut chart showing: {data.map(d => `${d.label} ${d.value}`).join(", ")}
      </div>
    </div>
  );
}
