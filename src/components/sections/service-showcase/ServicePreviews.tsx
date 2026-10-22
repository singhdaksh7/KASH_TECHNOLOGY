"use client";

import React from "react";
import { 
  Globe, 
  Zap, 
  Terminal, 
  Cpu, 
  Database, 
  Activity, 
  Sparkles, 
  Bot, 
  GitBranch, 
  CheckCircle2, 
  Lock,
  Play,
  Film,
  Scissors,
  Layers,
  Target,
  Smartphone
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

interface PreviewProps {
  activeIndex: number;
}

export function ServicePreviews({ activeIndex }: PreviewProps) {
  return (
    <div className="relative w-full aspect-[4/3] max-w-[540px] flex items-center justify-center">
      {/* Ambient background glow matching current active service */}
      <div 
        className="absolute inset-0 rounded-3xl blur-3xl opacity-20 transition-colors duration-700 pointer-events-none"
        style={{
          backgroundColor: activeIndex % 2 === 0 ? "#f36b21" : "#c5a880"
        }}
      />

      {/* Container for the 6 stage previews with smooth cross-fade */}
      <div className="relative w-full h-full">
        {/* 01: Websites & Digital Products Preview */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform ${
            activeIndex === 0 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <WebPreview />
        </div>

        {/* 02: Apps & Custom Software Preview */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform ${
            activeIndex === 1 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <CustomSoftwarePreview />
        </div>

        {/* 03: Social Media Management Preview */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform ${
            activeIndex === 2 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <SocialMediaPreview />
        </div>

        {/* 04: Video & Content Creation Preview */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform ${
            activeIndex === 3 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <VideoContentPreview />
        </div>

        {/* 05: Marketing & Lead Generation Preview */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform ${
            activeIndex === 4 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <MarketingLeadGenPreview />
        </div>

        {/* 06: AI & Business Automation Preview */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform ${
            activeIndex === 5 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <AiAutomationPreview />
        </div>
      </div>
    </div>
  );
}

/* 01: Websites & Digital Products Mockup */
export function WebPreview() {
  return (
    <div className="w-full h-full bg-[#0a0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Browser Chrome Header */}
      <div className="bg-[#12151b] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-1 rounded-md text-[11px] font-mono text-white/70 flex items-center gap-2">
          <Lock className="w-3 h-3 text-[#f36b21]" />
          <span>kash.tech/digital-products</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <Globe className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 p-5 flex flex-col justify-between relative bg-gradient-to-b from-[#0e1117] to-[#07090c] overflow-hidden">
        <div className="absolute inset-0 circuit-pattern-dark opacity-30 pointer-events-none" />

        {/* Top telemetry bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f36b21]/20 text-[#f36b21] border border-[#f36b21]/30">
              BUILD // WEB
            </span>
            <span className="text-xs text-white/80 font-medium">Enterprise Web Architecture</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Score: 99/100</span>
          </div>
        </div>

        {/* Hero Banner Mock */}
        <div className="relative z-10 my-auto py-2">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#c5a880] tracking-wider uppercase">Conversion Engine</span>
              <span className="text-[10px] font-mono text-white/50">24ms TTFB</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
              High-Speed Web Applications Built for Maximum Conversion
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SEO Optimized</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#f36b21] font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>Vercel Edge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Grid Footer */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
            <div className="text-[10px] font-mono text-white/40">FCP</div>
            <div className="text-sm font-mono font-bold text-white">0.4s</div>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
            <div className="text-[10px] font-mono text-white/40">LCP</div>
            <div className="text-sm font-mono font-bold text-emerald-400">0.8s</div>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
            <div className="text-[10px] font-mono text-white/40">UPTIME</div>
            <div className="text-sm font-mono font-bold text-[#c5a880]">99.99%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 02: Apps & Custom Software Mockup */
export function CustomSoftwarePreview() {
  return (
    <div className="w-full h-full bg-[#080a0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#101319] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#c5a880]" />
          <span className="font-mono font-bold text-white tracking-wide text-xs">KASH_APPS // CUSTOM_ENGINE</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          HEALTH: NOMINAL
        </span>
      </div>

      {/* Main Control Viewport */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-br from-[#0c0f14] to-[#06080a] relative">
        <div className="absolute inset-0 circuit-pattern-dark opacity-25 pointer-events-none" />

        {/* Top metrics summary */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
              <span>SYSTEM THROUGHPUT</span>
              <Activity className="w-3.5 h-3.5 text-[#f36b21]" />
            </div>
            <div className="text-xl font-mono font-bold text-white">4,820 <span className="text-xs font-normal text-white/40">req/s</span></div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Native iOS &bull; Android &bull; Web
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
              <span>DB CLUSTER SYNC</span>
              <Database className="w-3.5 h-3.5 text-[#c5a880]" />
            </div>
            <div className="text-xl font-mono font-bold text-white">12ms <span className="text-xs font-normal text-white/40">latency</span></div>
            <div className="text-[10px] font-mono text-[#c5a880] mt-1">Multi-Region Active</div>
          </div>
        </div>

        {/* Live telemetry visual curve */}
        <div className="relative z-10 my-auto p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-white/60">OPERATIONAL WORKFLOW STREAM</span>
            <span className="text-[10px] font-mono text-[#f36b21]">0 PENDING ERRORS</span>
          </div>
          <svg className="w-full h-14 overflow-visible" viewBox="0 0 300 60" fill="none">
            <path
              d="M0,45 Q30,15 60,30 T120,20 T180,35 T240,15 T300,25"
              fill="none"
              stroke="#f36b21"
              strokeWidth="2.5"
            />
            <circle cx="240" cy="15" r="4" fill="#f36b21" className="animate-ping" />
            <circle cx="240" cy="15" r="3" fill="#ffffff" />
          </svg>
        </div>

        {/* System audit log */}
        <div className="relative z-10 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] font-mono text-white/60 flex items-center justify-between">
          <span className="text-white/40">Custom Stack:</span>
          <span className="text-white">React Native &bull; Postgres &bull; Secure Microservices</span>
        </div>
      </div>
    </div>
  );
}

/* 03: Social Media Management Mockup */
export function SocialMediaPreview() {
  return (
    <div className="w-full h-full bg-[#0a0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-[#12161f] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <InstagramIcon className="w-4 h-4 text-[#f36b21]" />
          <span className="font-mono font-bold text-white text-xs">SOCIAL_PRESENCE // MULTI_CHANNEL</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f36b21]/20 text-[#f36b21] border border-[#f36b21]/30">
          ACTIVE CALENDAR
        </span>
      </div>

      {/* Main Content Calendar & Feed */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-br from-[#0c0e14] to-[#06080a] relative">
        <div className="absolute inset-0 circuit-pattern-dark opacity-25 pointer-events-none" />

        {/* Channel Status Ribbon */}
        <div className="relative z-10 grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-[9px] font-mono text-white/40 block">INSTAGRAM</span>
            <span className="text-xs font-bold text-white font-mono">Scheduled</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-[9px] font-mono text-white/40 block">LINKEDIN</span>
            <span className="text-xs font-bold text-[#c5a880] font-mono">Published</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-[9px] font-mono text-white/40 block">FACEBOOK</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">Sync Active</span>
          </div>
        </div>

        {/* Content Publishing Queue Preview */}
        <div className="relative z-10 my-auto space-y-2">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f36b21] to-[#b3470b] flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Brand Story Reel #14</div>
                <div className="text-[9px] font-mono text-white/50">Captions &bull; Audio Sync &bull; Tags Ready</div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Queued 6 PM</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c5a880]/20 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">LinkedIn Carousel // Authority</div>
                <div className="text-[9px] font-mono text-white/50">8 Custom Slides &bull; Brand Typography</div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#c5a880] bg-[#c5a880]/10 px-2 py-0.5 rounded">Approved</span>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/50 border-t border-white/5 pt-2">
          <span>Cadence: 5x Weekly</span>
          <span className="text-[#f36b21]">Community Management Active</span>
        </div>
      </div>
    </div>
  );
}

/* 04: Video & Content Creation Mockup */
export function VideoContentPreview() {
  return (
    <div className="w-full h-full bg-[#08090d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Studio Header */}
      <div className="bg-[#10121a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#c5a880]" />
          <span className="font-mono font-bold text-white text-xs">CREATIVE_STUDIO // VIDEO_TIMELINE</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30">
          4K TIMELINE
        </span>
      </div>

      {/* Video Studio Timeline Canvas */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-b from-[#0b0d14] to-[#050608] relative">
        <div className="absolute inset-0 circuit-pattern-dark opacity-30 pointer-events-none" />

        {/* Video Player Preview Window */}
        <div className="relative z-10 p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 rounded bg-[#1e222e] border border-white/10 flex items-center justify-center relative overflow-hidden">
              <Play className="w-4 h-4 text-[#f36b21] fill-current" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#f36b21]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">Reel_Campaign_Master_v2.mp4</div>
              <div className="text-[9px] font-mono text-[#c5a880]">00:32 / 00:60 &bull; Dynamic Subtitles &bull; Sound Design</div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Rendered</span>
        </div>

        {/* Multi-Track Editor Timeline Mock */}
        <div className="relative z-10 my-auto p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          {/* Track 1: Video cuts */}
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
            <span className="w-12 text-white/40">V1 CUTS</span>
            <div className="flex-1 flex gap-1 h-4">
              <div className="w-1/3 bg-[#f36b21]/40 border border-[#f36b21]/60 rounded-sm flex items-center justify-center text-[7px] text-white">Hook (3s)</div>
              <div className="w-1/2 bg-[#f36b21]/30 border border-[#f36b21]/50 rounded-sm flex items-center justify-center text-[7px] text-white">Value Story</div>
              <div className="flex-1 bg-[#f36b21]/50 border border-[#f36b21]/70 rounded-sm flex items-center justify-center text-[7px] text-white">CTA</div>
            </div>
          </div>

          {/* Track 2: Motion Graphics & Subtitles */}
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
            <span className="w-12 text-[#c5a880]">GFX / SUB</span>
            <div className="flex-1 flex gap-1 h-3">
              <div className="w-1/4 bg-[#c5a880]/30 rounded-sm" />
              <div className="w-1/3 bg-[#c5a880]/40 rounded-sm" />
              <div className="flex-1 bg-[#c5a880]/30 rounded-sm" />
            </div>
          </div>

          {/* Track 3: Audio Waveform */}
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
            <span className="w-12 text-emerald-400">AUDIO</span>
            <div className="flex-1 bg-emerald-500/20 border border-emerald-500/30 rounded-sm h-3 flex items-center px-1">
              <div className="w-full flex gap-0.5 items-center justify-between">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[2px] bg-emerald-400 rounded-full"
                    style={{ height: `${(i % 5 + 1) * 2}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/50 border-t border-white/5 pt-2">
          <span className="flex items-center gap-1.5">
            <Scissors className="w-3 h-3 text-[#f36b21]" /> Short-form Repurposing
          </span>
          <span className="text-white">Studio-Grade Export</span>
        </div>
      </div>
    </div>
  );
}

/* 05: Marketing & Lead Generation Mockup */
export function MarketingLeadGenPreview() {
  return (
    <div className="w-full h-full bg-[#0a0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Console Topbar */}
      <div className="bg-[#12161f] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#f36b21]" />
          <span className="font-mono font-bold text-white text-xs">GROWTH_ENGINE // LEAD_CAPTURE</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          CONVERSION LIVE
        </span>
      </div>

      {/* Main Campaign Canvas */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-br from-[#0c0f16] to-[#06080c] relative">
        <div className="absolute inset-0 circuit-pattern-dark opacity-25 pointer-events-none" />

        {/* Lead Generation Funnel Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[9px] font-mono text-white/40">CAMPAIGNS</div>
            <div className="text-base font-bold font-mono text-white">Meta + Google</div>
            <div className="text-[9px] font-mono text-emerald-400">Active Retargeting</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[9px] font-mono text-white/40">LANDING PAGE</div>
            <div className="text-base font-bold font-mono text-[#f36b21]">Fast Capture</div>
            <div className="text-[9px] font-mono text-white/50">Zero Friction</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[9px] font-mono text-white/40">DISPATCH</div>
            <div className="text-base font-bold font-mono text-[#c5a880]">CRM + WhatsApp</div>
            <div className="text-[9px] font-mono text-white/50">Instant Alert</div>
          </div>
        </div>

        {/* Multi-Channel Capture Pipeline */}
        <div className="relative z-10 my-auto p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/80 font-medium">Lead Routing &amp; Verification</span>
            <span className="text-[10px] font-mono text-[#f36b21]">REAL-TIME SYNC</span>
          </div>

          <div className="space-y-1.5 text-[10px] font-mono">
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-white">Ad Click &rarr; Tailored Landing Page</span>
              <span className="text-emerald-400">Captured</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-white">Lead Qualification &amp; Phone Verification</span>
              <span className="text-[#c5a880]">Automated</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-white">Direct CRM Push + WhatsApp Notification</span>
              <span className="text-emerald-400">Dispatched (&lt;10s)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/50 border-t border-white/5 pt-2">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3 h-3 text-[#f36b21]" /> Marketing + Tech + Automation
          </span>
          <span className="text-emerald-400">Qualified Pipeline</span>
        </div>
      </div>
    </div>
  );
}

/* 06: AI & Business Automation Mockup */
export function AiAutomationPreview() {
  return (
    <div className="w-full h-full bg-[#08090d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-[#10121a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#f36b21]" />
          <span className="font-mono font-bold text-white text-xs">KASH_AI // AUTONOMOUS_WORKFLOW</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f36b21]/20 text-[#f36b21] border border-[#f36b21]/30">
          PIPELINE ACTIVE
        </span>
      </div>

      {/* Visual Workflow Canvas */}
      <div className="flex-1 p-5 flex flex-col justify-between relative bg-gradient-to-b from-[#0b0d14] to-[#050608]">
        <div className="absolute inset-0 circuit-pattern-dark opacity-30 pointer-events-none" />

        {/* Flow Nodes Diagram */}
        <div className="relative z-10 space-y-2.5 my-auto">
          {/* Step 1: Input Trigger */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#f36b21]/20 border border-[#f36b21]/40 flex items-center justify-center text-[#f36b21]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Event Trigger: Lead or Customer Action</div>
                <div className="text-[9px] font-mono text-white/50">Multi-Channel Ingestion &bull; 0.2s</div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Triggered</span>
          </div>

          {/* Connection Vector */}
          <div className="flex justify-center -my-1 text-[#f36b21]">
            <GitBranch className="w-3.5 h-3.5 rotate-90 opacity-60" />
          </div>

          {/* Step 2: Intelligent Reasoning */}
          <div className="p-3 rounded-xl bg-white/[0.05] border border-[#c5a880]/30 shadow-[0_0_15px_rgba(197,168,128,0.1)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">AI Agent: Classification &amp; Routing</div>
                <div className="text-[9px] font-mono text-white/50">Context Validation &bull; Schema Mapping</div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#c5a880] bg-[#c5a880]/15 px-2 py-0.5 rounded">Processing</span>
          </div>

          {/* Connection Vector */}
          <div className="flex justify-center -my-1 text-[#c5a880]">
            <GitBranch className="w-3.5 h-3.5 rotate-90 opacity-60" />
          </div>

          {/* Step 3: Automated Dispatch */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">System Sync: CRM, WhatsApp &amp; ERP</div>
                <div className="text-[9px] font-mono text-white/50">Zero repetitive manual work</div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Complete</span>
          </div>
        </div>

        {/* Live execution telemetry */}
        <div className="relative z-10 pt-2 flex items-center justify-between border-t border-white/5 text-[10px] font-mono text-white/50">
          <span>Throughput: Autonomous Pipeline</span>
          <span className="text-[#f36b21]">Scalable Business Workflows</span>
        </div>
      </div>
    </div>
  );
}
