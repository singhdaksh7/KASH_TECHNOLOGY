import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="bg-black text-slate-100 min-h-screen py-28 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-900/5 blur-[120px] pointer-events-none" />

      <Container className="max-w-3xl relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors mb-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>

        {/* Header */}
        <header className="border-b border-white/10 pb-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            {title}
          </h1>
          <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <main className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-black prose-p:leading-relaxed prose-p:text-slate-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
          {children}
        </main>

        {/* Legal Contact CTA near bottom */}
        <footer className="mt-20 pt-10 border-t border-white/10 text-center sm:text-left">
          <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Questions about our policies?</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              If you have any questions or concerns regarding our terms or how we process your information, please contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                {SITE_CONFIG.contactEmail}
              </a>
              <a 
                href={`tel:${SITE_CONFIG.contactPhonePrimary.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                {SITE_CONFIG.contactPhonePrimary}
              </a>
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
}
