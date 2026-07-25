import { Reveal } from "@/components/motion/Reveal";
import { Terminal, Smartphone, Cloud, Building2, Landmark, Bitcoin } from "lucide-react";

export function Capabilities() {
  return (
    <section className="py-16 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <Reveal>
        <div className="marquee-track">
          {/* First set */}
          <div className="flex gap-24 px-12 items-center">
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Terminal className="text-primary w-6 h-6" /> Web Apps
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Smartphone className="text-primary w-6 h-6" /> Mobile
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Cloud className="text-primary w-6 h-6" /> SaaS
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Building2 className="text-primary w-6 h-6" /> ERP
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Landmark className="text-primary w-6 h-6" /> Fintech
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Bitcoin className="text-primary w-6 h-6" /> Blockchain
            </span>
          </div>
          {/* Duplicated for seamless loop */}
          <div className="flex gap-24 px-12 items-center">
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Terminal className="text-primary w-6 h-6" /> Web Apps
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Smartphone className="text-primary w-6 h-6" /> Mobile
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Cloud className="text-primary w-6 h-6" /> SaaS
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Building2 className="text-primary w-6 h-6" /> ERP
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Landmark className="text-primary w-6 h-6" /> Fintech
            </span>
            <span className="text-muted font-bold text-lg flex items-center gap-3">
              <Bitcoin className="text-primary w-6 h-6" /> Blockchain
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
