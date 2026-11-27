"use client";

import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StudioButton } from "@/components/public-ui";
import { SITE_CONFIG } from "@/lib/constants";

export function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceInterested: "Website Development",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          serviceInterested: formData.serviceInterested,
          message: formData.message,
          source: "contact_page",
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to submit. Please contact us directly via WhatsApp or Phone.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please reach out directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-20">
      
      {/* ============================================================== */}
      {/* 1. CONTACT HERO & DIRECT CONVERSION CHANNELS                   */}
      {/* ============================================================== */}
      <section className="py-14 lg:py-24 bg-white border-b border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Direct Info & Alternate Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3E9] text-[#FF5A00] text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
                  <span>Start a Conversation</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#0B0B0F]">
                  Let&apos;s talk about your next project.
                </h1>

                <p className="text-base text-[#4B5563] leading-relaxed">
                  Have a specific technical requirement or seeking long-term creative and growth support? Fill out the brief or connect directly through our founders desk.
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-4 pt-2">
                <a
                  href={`tel:${SITE_CONFIG.contactPhonePrimary.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5E2] flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 block">Phone</span>
                    <span className="text-sm font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                      {SITE_CONFIG.contactPhonePrimary}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5E2] flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 block">Email</span>
                    <span className="text-sm font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors">
                      {SITE_CONFIG.contactEmail}
                    </span>
                  </div>
                </a>

                {SITE_CONFIG.whatsappUrl && (
                  <a
                    href={SITE_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-emerald-500 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5E2] flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 block">WhatsApp</span>
                      <span className="text-sm font-bold text-[#0B0B0F] group-hover:text-emerald-600 transition-colors">
                        Instant WhatsApp Chat &rarr;
                      </span>
                    </div>
                  </a>
                )}
              </div>

              {/* Assurances */}
              <div className="pt-4 border-t border-[#E8E5E2] space-y-2.5 text-xs text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF5A00]" />
                  <span>Responses within 24 business hours guaranteed.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                  <span>Strict NDA and data privacy protection.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean, Low-Friction Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#FFF9F4] p-8 sm:p-10 rounded-3xl border border-[#E8E5E2]">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B0B0F]">Inquiry Received</h3>
                  <p className="text-sm text-[#4B5563] max-w-md mx-auto">
                    Thank you. We have logged your project brief into our CRM and our technical team will review your requirements within 24 hours.
                  </p>
                  <div className="pt-4">
                    <StudioButton href="/" variant="secondary" size="md">
                      Return to Homepage
                    </StudioButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="pb-2 border-b border-[#E8E5E2]">
                    <h3 className="text-xl font-bold text-[#0B0B0F]">Project Brief</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">Please share your contact details and a short description of what you need.</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B0B0F] mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5E2] text-sm focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0B0B0F] mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5E2] text-sm focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B0B0F] mb-1.5">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5E2] text-sm focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0B0B0F] mb-1.5">Primary Service</label>
                      <select
                        value={formData.serviceInterested}
                        onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5E2] text-sm focus:outline-none focus:border-[#FF5A00]"
                      >
                        <option value="Website Development">Website Development (Next.js)</option>
                        <option value="Custom Software & CRM">Custom Software & CRM Systems</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="ERP / CRM Systems">ERP / Operations Software</option>
                        <option value="SaaS Development">SaaS Platform Development</option>
                        <option value="AI & Automation">AI Automation & Custom Agents</option>
                        <option value="Content & Video">Content Creation & Video Studio</option>
                        <option value="Digital Marketing & SEO">Digital Marketing & SEO Growth</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0F] mb-1.5">Project Overview & Goals *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Briefly describe what you want to build or improve, timeline expectations, or links to current platforms..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5E2] text-sm focus:outline-none focus:border-[#FF5A00] leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white font-bold text-sm shadow-md hover:brightness-105 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? "Transmitting Brief…" : "Send Project Inquiry"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </Container>
      </section>

    </div>
  );
}
