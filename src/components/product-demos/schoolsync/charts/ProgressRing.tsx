interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({ 
  percentage, 
  size = 120, 
  strokeWidth = 12, 
  color = "#22c55e",
  label,
  sublabel
}: Props) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black">{percentage}%</span>
        </div>
      </div>
      
      {(label || sublabel) && (
        <div className="mt-4 text-center">
          {label && <p className="font-bold text-sm">{label}</p>}
          {sublabel && <p className="text-xs text-muted">{sublabel}</p>}
        </div>
      )}
      
      <div className="sr-only">
        Progress ring showing {percentage}% {label ? `for ${label}` : ''}
      </div>
    </div>
  );
}
