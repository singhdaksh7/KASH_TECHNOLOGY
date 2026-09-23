import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass, PhoneCall, Code2, Globe, Cpu } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-[#080808] text-white flex items-center justify-center relative overflow-hidden py-24">
      {/* Background technical styling */}
      <div className="absolute inset-0 circuit-pattern-dark opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e86024]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative concentric rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.03] pointer-events-none" />

      <Container className="relative z-10 max-w-3xl text-center">
        {/* Emblem */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-[#0c0c0e] border border-white/10 p-3 shadow-2xl flex items-center justify-center">
          <Image
            src="/images/logo/kash-logo-emblem.jpg"
            alt="KASH Technology"
            width={64}
            height={64}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e86024]/10 border border-[#e86024]/30 text-[#e86024] font-mono text-xs uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e86024] animate-ping" />
          <span>Error 404 // Route Not Resolved</span>
        </div>

        {/* Heading */}
        <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          404 — System Not Found
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#8e9aa8] max-w-xl mx-auto mb-10 leading-relaxed">
          The requested endpoint or resource does not exist in our system registry, may have been relocated, or is temporarily unavailable.
        </p>

        {/* Main CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#e86024] hover:bg-[#d35219] text-white font-bold text-sm transition-all shadow-[0_4px_20px_rgba(232,96,36,0.35)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-[#c5a880]" />
            <span>Contact Engineering</span>
          </Link>
        </div>

        {/* Quick Nav directory */}
        <div className="pt-10 border-t border-white/10">
          <span className="text-xs font-mono text-[#c5a880] uppercase tracking-wider block mb-6">
            Recommended Destinations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <Link
              href="/website-development"
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#e86024]/40 hover:bg-white/[0.06] transition-all group"
            >
              <Globe className="w-4 h-4 text-[#e86024] mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-bold text-white group-hover:text-[#e86024] transition-colors">
                Web Development
              </span>
              <span className="text-[11px] text-[#6b7280] block mt-0.5">Custom web systems</span>
            </Link>

            <Link
              href="/custom-software-development"
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#e86024]/40 hover:bg-white/[0.06] transition-all group"
            >
              <Code2 className="w-4 h-4 text-[#e86024] mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-bold text-white group-hover:text-[#e86024] transition-colors">
                Custom Software
              </span>
              <span className="text-[11px] text-[#6b7280] block mt-0.5">Enterprise platforms</span>
            </Link>

            <Link
              href="/portfolio"
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#e86024]/40 hover:bg-white/[0.06] transition-all group"
            >
              <Cpu className="w-4 h-4 text-[#e86024] mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-bold text-white group-hover:text-[#e86024] transition-colors">
                Case Studies
              </span>
              <span className="text-[11px] text-[#6b7280] block mt-0.5">Verified engineering</span>
            </Link>

            <Link
              href="/services"
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#e86024]/40 hover:bg-white/[0.06] transition-all group"
            >
              <Compass className="w-4 h-4 text-[#e86024] mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-bold text-white group-hover:text-[#e86024] transition-colors">
                All Capabilities
              </span>
              <span className="text-[11px] text-[#6b7280] block mt-0.5">Complete service index</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
