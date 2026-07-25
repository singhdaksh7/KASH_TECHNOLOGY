interface Props {
  data: number[];
  color?: string;
  height?: number;
  labels?: string[];
  max?: number;
}

export function MiniBarChart({ data, color = "#FF5F1F", height = 100, labels, max }: Props) {
  const maxValue = max || Math.max(...data, 1);

  return (
    <div className="w-full flex flex-col justify-end" style={{ height }}>
      <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2">
        {data.map((val, i) => {
          const heightPct = (val / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
              {/* Tooltip equivalent (accessible) */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none whitespace-nowrap z-10">
                {labels ? `${labels[i]}: ` : ''}{val}
              </div>
              
              <div 
                className="w-full rounded-t-sm transition-all duration-500 ease-out hover:opacity-80 cursor-pointer"
                style={{ height: `${Math.max(heightPct, 2)}%`, backgroundColor: color }}
              />
            </div>
          );
        })}
      </div>
      
      {labels && (
        <div className="flex justify-between mt-2 text-[10px] text-muted">
          {labels.map((label, i) => (
            <div key={i} className="flex-1 text-center truncate px-0.5">{label}</div>
          ))}
        </div>
      )}
      
      {/* Screen reader only text */}
      <div className="sr-only">
        Bar chart showing values: {data.map((v, i) => `${labels?.[i] || i}: ${v}`).join(", ")}
      </div>
    </div>
  );
}
