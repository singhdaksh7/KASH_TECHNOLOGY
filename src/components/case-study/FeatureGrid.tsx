import { CaseStudy } from "@/types/case-study";
import { Layers } from "lucide-react";

interface Props {
  caseStudy: CaseStudy;
}

export function FeatureGrid({ caseStudy }: Props) {
  return (
    <section className="py-24 px-8 max-w-[1280px] mx-auto border-t border-white/10 bg-white/[0.02]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-4">Core Features</h2>
        <p className="text-muted">Key capabilities engineered to solve the operational requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudy.features.map((feature, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
