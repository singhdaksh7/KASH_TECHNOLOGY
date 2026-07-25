import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface BrowserFrameProps {
  children: ReactNode;
  className?: string;
}

export function BrowserFrame({ children, className }: BrowserFrameProps) {
  return (
    <div className={cn("relative w-full max-w-5xl mx-auto group", className)}>
      <div className="w-full bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Browser Chrome */}
        <div className="bg-[#111] px-4 md:px-6 py-3 md:py-4 flex items-center gap-4 border-b border-white/10 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
          </div>
          <div className="bg-white/5 px-4 md:px-6 py-1.5 rounded-full text-[10px] md:text-xs text-muted flex-grow text-center font-medium border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap">
            {typeof window !== 'undefined' ? SITE_CONFIG.products.launchpad.externalUrl?.replace('https://', '') : 'crypto-launchedpad-mvp.vercel.app'}/v2/deployment
          </div>
        </div>
        
        {/* App Content Area */}
        <div className="relative w-full h-[600px] overflow-hidden flex flex-col bg-background">
          {children}
        </div>
        
        {/* Demo Watermark */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded pointer-events-none z-50 border border-white/10">
          Simulation
        </div>
      </div>
    </div>
  );
}
