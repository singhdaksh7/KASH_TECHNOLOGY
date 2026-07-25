import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default";

interface Props {
  status: string;
  type?: StatusType;
}

export function StatusBadge({ status, type = "default" }: Props) {
  const getColors = () => {
    switch (type) {
      case "success": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "error": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-white/10 text-muted border-white/10";
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      getColors()
    )}>
      {status}
    </span>
  );
}
