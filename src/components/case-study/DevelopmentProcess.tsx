import { Workflow } from "lucide-react";

export function DevelopmentProcess() {
  const steps = [
    { num: "01", title: "Discover", desc: "Requirements analysis and operational scoping." },
    { num: "02", title: "Design", desc: "Architecture planning and secure interface design." },
    { num: "03", title: "Architect", desc: "Data modeling and infrastructure setup." },
    { num: "04", title: "Build", desc: "Iterative full-stack engineering." },
    { num: "05", title: "Test", desc: "Automated testing and security validation." },
    { num: "06", title: "Deploy", desc: "CI/CD pipeline execution to production." },
    { num: "07", title: "Improve", desc: "Continuous monitoring and optimization." },
  ];

  return (
    <section className="py-24 px-8 max-w-[1280px] mx-auto border-t border-white/10 bg-white/[0.02]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
          <Workflow className="text-primary w-8 h-8" />
          Development Process
        </h2>
        <p className="text-muted">The structured KASH engineering lifecycle applied to this project.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {steps.map((step) => (
          <div key={step.num} className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full max-w-[280px] hover:bg-white/10 transition-colors">
            <span className="text-primary font-black text-2xl mb-2 block">{step.num}</span>
            <h3 className="font-bold mb-2">{step.title}</h3>
            <p className="text-xs text-muted">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
