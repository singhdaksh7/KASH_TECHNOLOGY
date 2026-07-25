import { CaseStudy } from "@/types/case-study";
import { Network, ArrowDown } from "lucide-react";

interface Props {
  caseStudy: CaseStudy;
}

export function ArchitectureSection({ caseStudy }: Props) {
  return (
    <section className="py-24 px-8 max-w-[1024px] mx-auto border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
          <Network className="text-primary w-8 h-8" />
          Technical Architecture
        </h2>
        <p className="text-muted">A high-level view of the system components and data flow.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {caseStudy.architecture.map((node, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-center group-hover:border-primary/50 transition-colors">
                <h4 className="font-bold text-foreground mb-1">{node.label}</h4>
                {node.description && <p className="text-xs text-muted">{node.description}</p>}
              </div>
              {idx < caseStudy.architecture.length - 1 && (
                <div className="py-2 text-white/20 group-hover:text-primary/50 transition-colors">
                  <ArrowDown className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
