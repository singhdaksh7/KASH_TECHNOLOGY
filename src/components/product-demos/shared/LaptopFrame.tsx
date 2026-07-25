import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LaptopFrameProps {
  children: ReactNode;
  className?: string;
}

export function LaptopFrame({ children, className }: LaptopFrameProps) {
  return (
    <div className={cn("relative w-full max-w-5xl mx-auto flex flex-col items-center group", className)}>
      {/* Laptop Screen Frame */}
      <div className="w-full aspect-[16/10] bg-[#111] rounded-t-3xl border-[14px] border-[#222] shadow-2xl relative overflow-hidden flex flex-col">
        {/* Webcam Mock */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#000] border border-[#333] rounded-full mt-1.5 z-50"></div>
        
        {/* App Content Area */}
        <div className="relative flex-1 w-full h-full bg-background overflow-hidden flex">
          {children}
        </div>
        
        {/* Demo Watermark */}
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded pointer-events-none z-50">
          Interactive Demo
        </div>
      </div>
      
      {/* Laptop Base Mock */}
      <div className="w-[104%] h-5 bg-[#1a1a1a] rounded-b-xl relative shadow-2xl border-t border-white/10 flex justify-center z-10">
        <div className="w-32 h-2 bg-[#0f0f0f] rounded-b-md"></div>
      </div>
    </div>
  );
}
