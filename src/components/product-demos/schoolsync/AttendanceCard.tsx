import { CheckSquare } from "lucide-react";


interface Props {
  percentage: number;
}

export function AttendanceCard({ percentage }: Props) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg flex items-center gap-2 mb-1">
          <CheckSquare className="w-5 h-5 text-primary" />
          Attendance
        </h3>
        <p className="text-xs text-muted">Current Term</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              className="stroke-primary fill-none"
              strokeWidth="4"
              strokeDasharray="100"
              strokeDashoffset={100 - percentage}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm font-bold">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
