import { ReactNode } from "react";
import { PlayCircle, ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
  disclaimer: string;
}

export function InteractiveDemoSection({ children, disclaimer }: Props) {
  return (
    <section id="demo" className="py-24 px-8 max-w-[1280px] mx-auto border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
          <PlayCircle className="text-primary w-8 h-8" />
          Interactive Prototype
        </h2>
        <p className="text-muted mb-6">Experience the user interface and interactions directly in your browser.</p>
        
        <div className="inline-flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-xl text-xs text-left max-w-lg">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{disclaimer}</span>
        </div>
      </div>

      <div className="w-full flex justify-center">
        {children}
      </div>
    </section>
  );
}
