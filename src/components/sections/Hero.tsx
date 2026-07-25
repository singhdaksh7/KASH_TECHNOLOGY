import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="min-h-[100dvh] pt-32 pb-24 flex flex-col justify-center relative px-8 overflow-hidden max-w-[1440px] mx-auto">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>
      
      <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8 z-10 w-full relative">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl text-center xl:text-left pt-10">
          <Reveal>
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight text-foreground mb-8 leading-[1.05]">
              From an idea to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">production-ready</span> digital product.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xl md:text-2xl text-muted max-w-xl mx-auto xl:mx-0 mb-12 leading-relaxed">
              KASH Technologies builds secure SaaS platforms, business automation systems, fintech products, ERP solutions and blockchain applications.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center xl:justify-start">
              <LinkButton
                href="/#work"
                className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(var(--primary),0.3)] text-lg border border-primary"
              >
                Explore Our Work
              </LinkButton>
              <LinkButton
                href="/#contact"
                variant="outline"
                className="px-10 py-5 rounded-full font-bold backdrop-blur-md transition-all text-lg border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
              >
                Start a Project
              </LinkButton>
            </div>
          </Reveal>
        </div>

        {/* Right Content - Product Composition */}
        <div className="flex-1 w-full relative h-[400px] sm:h-[500px] lg:h-[600px] perspective-[1200px]">
          <Reveal delay={0.4} className="w-full h-full absolute inset-0">
            {/* Background Layer: Crypto Launchpad */}
            <div className="absolute top-4 sm:top-12 right-0 sm:right-12 w-[85%] h-[70%] bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden translate-z-[-100px] rotate-y-[-10deg] opacity-60 hidden sm:flex flex-col">
              <div className="h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-black/40">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                <div className="ml-4 h-4 w-48 bg-white/10 rounded flex-1 max-w-xs"></div>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="h-10 w-32 bg-primary/20 rounded-lg self-end"></div>
                <div className="h-48 bg-white/5 rounded-xl w-full"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white/5 rounded-xl"></div>
                  <div className="h-24 bg-white/5 rounded-xl"></div>
                  <div className="h-24 bg-white/5 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Middle Layer: SchoolSync ERP */}
            <div className="absolute top-10 sm:top-20 left-0 w-[95%] sm:w-[85%] h-[80%] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex transform transition-transform hover:-translate-y-2 duration-500">
              <div className="w-16 sm:w-48 border-r border-white/5 h-full flex flex-col p-4 gap-3 bg-black/40">
                <div className="h-8 w-8 sm:w-24 bg-primary/20 rounded-lg mb-4"></div>
                <div className="h-8 w-full bg-white/10 rounded-lg"></div>
                <div className="h-8 w-full bg-white/5 rounded-lg"></div>
                <div className="h-8 w-full bg-white/5 rounded-lg"></div>
                <div className="h-8 w-full bg-white/5 rounded-lg"></div>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-white/10 rounded"></div>
                  <div className="h-8 w-8 rounded-full bg-white/10"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl border border-white/5 mt-2"></div>
              </div>
            </div>

            {/* Foreground Layer: Exora Mobile */}
            <div className="absolute -bottom-4 sm:bottom-0 right-4 sm:right-10 w-[140px] sm:w-[220px] h-[300px] sm:h-[460px] bg-black border-4 sm:border-8 border-[#1a1a1a] rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transform transition-transform hover:-translate-y-4 duration-500 rotate-[5deg]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 sm:h-6 bg-[#1a1a1a] rounded-b-xl z-20"></div>
              
              <div className="flex-1 bg-[#131313] p-4 flex flex-col gap-4 relative">
                <div className="absolute top-[-100px] left-[-50px] w-48 h-48 bg-primary/30 rounded-full blur-[50px] opacity-50"></div>
                
                <div className="h-10 mt-6 flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-white/10"></div>
                  <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                </div>
                
                <div className="h-24 sm:h-32 bg-gradient-to-br from-primary/40 to-blue-500/20 rounded-2xl border border-white/10 mt-2"></div>
                
                <div className="flex justify-between gap-3">
                  <div className="flex-1 h-12 bg-white/5 rounded-xl"></div>
                  <div className="flex-1 h-12 bg-white/5 rounded-xl"></div>
                </div>
                
                <div className="flex-1 bg-white/5 rounded-t-2xl border border-white/10 mt-2"></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
