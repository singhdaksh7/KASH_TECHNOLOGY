import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "lucide-react";

interface CapabilityItem {
  id: string;
  title: string;
  description: string;
}

export function Capabilities() {
  const items: CapabilityItem[] = [
    {
      id: "01",
      title: "Product Engineering",
      description: "Web platforms, SaaS products and complex business systems.",
    },
    {
      id: "02",
      title: "AI & Automation",
      description: "AI workflows, intelligent agents and business automation.",
    },
    {
      id: "03",
      title: "Backend Systems",
      description: "APIs, databases, authentication and scalable infrastructure.",
    },
    {
      id: "04",
      title: "Cloud & DevOps",
      description: "Deployment, infrastructure, AWS and production systems.",
    },
    {
      id: "05",
      title: "Fintech & Web3",
      description: "Trading systems, smart contracts, wallets and blockchain infrastructure.",
    },
  ];

  return (
    <section id="capabilities" className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />
      
      <Container className="relative z-10 max-w-[1520px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-20 text-left">
          <Reveal>
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#3b82f6] uppercase font-bold mb-4 block">
              Core Capabilities
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
              Engineering across the stack.
            </h2>
          </Reveal>
        </div>

        {/* Typographic Rows */}
        <div className="border-b border-white/5">
          {items.map((item, idx) => (
            <Reveal key={item.id} delay={0.05 * idx} y={10} className="w-full">
              <div className="group border-t border-white/5 py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-default transition-all duration-200 hover:bg-white/[0.01] px-4 md:px-6 relative">
                
                {/* Subtle technical glow indicator on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />

                {/* Left side: Id & Title */}
                <div className="flex items-start md:items-center gap-6 md:gap-8">
                  <span className="text-xs font-mono font-bold text-[#8e9aa8]/40 group-hover:text-primary transition-colors duration-200 pt-1 md:pt-0">
                    {item.id}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-white transition-colors duration-200">
                    {item.title}
                  </h3>
                </div>

                {/* Right side: Description & Action arrow */}
                <div className="flex items-center justify-between md:justify-end gap-8 md:gap-12 w-full md:w-auto">
                  <p className="text-[#8e9aa8] text-sm md:text-base max-w-md group-hover:text-[#f3f4f6] transition-colors duration-200 text-left">
                    {item.description}
                  </p>
                  <ArrowRight className="w-5 h-5 text-[#8e9aa8]/40 group-hover:text-primary transition-all duration-200 transform group-hover:translate-x-1.5" />
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
