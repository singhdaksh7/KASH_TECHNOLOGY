import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export function MetricCard({ title, value, icon, trend, trendPositive, className }: MetricCardProps) {
  return (
    <div className={cn("bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors cursor-default", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-primary">
          {icon}
        </div>
        {trend && (
          <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trendPositive ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error")}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted mb-1">{title}</p>
        <h3 className="text-2xl font-black text-foreground">{value}</h3>
      </div>
    </div>
  );
}
