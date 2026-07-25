import { CaseStudy } from "@/types/case-study";
import { Cpu } from "lucide-react";

interface Props {
  caseStudy: CaseStudy;
}

export function TechnologyStack({ caseStudy }: Props) {
  return (
    <section className="py-24 px-8 max-w-[1280px] mx-auto border-t border-white/10 bg-white/[0.02]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
          <Cpu className="text-primary w-8 h-8" />
          Technology Stack
        </h2>
        <p className="text-muted">The core technologies and frameworks utilized to build this platform.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {caseStudy.technologies.map((tech, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-center hover:border-primary/50 transition-colors">
            <span className="font-bold text-foreground">{tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
