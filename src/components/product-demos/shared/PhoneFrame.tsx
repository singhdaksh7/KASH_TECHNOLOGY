import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[320px] aspect-[9/19.5]",
        "border-[12px] border-[#1a1a1a] rounded-[3rem] bg-background shadow-2xl overflow-hidden",
        "flex flex-col",
        className
      )}
    >
      {/* Dynamic Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-2xl z-50"></div>
      
      {/* App Content Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col bg-background">
        {children}
      </div>
    </div>
  );
}
