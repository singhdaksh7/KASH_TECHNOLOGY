
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Wallet, Settings2, Rocket, Coins } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { LaunchpadDemo } from "@/components/product-demos/launchpad/LaunchpadDemo";

export function LaunchpadShowcase() {
  const product = SITE_CONFIG.products.launchpad;

  return (
    <section className="py-24 max-w-[1280px] mx-auto px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <Reveal className="lg:col-span-4 space-y-8">
          <div className="inline-flex px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            Blockchain Engineering
          </div>
          <h2 className="text-5xl font-black leading-tight">Decentralized Launchpad</h2>
          <p className="text-lg text-muted">
            Automated smart contract deployment and liquidity locking for BSC-based projects with enterprise-grade security audits.
          </p>
          <div className="space-y-4">
            <button className="w-full p-5 border-l-4 border-primary bg-white/5 flex gap-5 items-center transition-all text-left">
              <Wallet className="text-primary w-8 h-8" />
              <div>
                <p className="font-black text-sm uppercase tracking-wider text-primary">Step 01</p>
                <h4 className="font-bold text-foreground">Connect Wallet</h4>
              </div>
            </button>
            <button className="w-full p-5 border-l-4 border-transparent hover:bg-white/5 flex gap-5 items-center transition-all text-left">
              <Coins className="text-muted w-8 h-8" />
              <div>
                <p className="font-black text-sm uppercase tracking-wider opacity-50 text-muted">Step 02</p>
                <h4 className="font-bold text-foreground">Token Creation</h4>
              </div>
            </button>
            <button className="w-full p-5 border-l-4 border-transparent hover:bg-white/5 flex gap-5 items-center transition-all text-left">
              <Settings2 className="text-muted w-8 h-8" />
              <div>
                <p className="font-black text-sm uppercase tracking-wider opacity-50 text-muted">Step 03</p>
                <h4 className="font-bold text-foreground">Configure Presale</h4>
              </div>
            </button>
            <button className="w-full p-5 border-l-4 border-transparent hover:bg-white/5 flex gap-5 items-center transition-all text-left">
              <Rocket className="text-muted w-8 h-8" />
              <div>
                <p className="font-black text-sm uppercase tracking-wider opacity-50 text-muted">Step 04</p>
                <h4 className="font-bold text-foreground">Launch to Mainnet</h4>
              </div>
            </button>
          </div>
          <div className="pt-2">
            <LinkButton href={product.caseStudyPath} variant="primary">
              View Case Study
            </LinkButton>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="lg:col-span-8 w-full">
          <div className="relative">
            <div className="absolute w-[500px] h-[500px] glow-blob -z-10 top-0 right-0 opacity-30"></div>
            <LaunchpadDemo />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
