"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  ArrowRight, 
  Clock, 
  Users, 
  ShieldCheck, 
  Send, 
  CheckCircle2
} from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
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
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          source: "contact_page",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send inquiry. Please try again.");
      }

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong. Please reach out via WhatsApp or phone.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-16">
      
      {/* ============================================================== */}
      {/* 1. CONTACT HERO                                                */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 overflow-hidden">
        {/* Diagonal orange background on the right */}
        <div className="hidden lg:block hero-diagonal-bg" />
        <div className="hidden lg:block hero-diagonal-soft" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3.5 py-1.5 rounded-md">
                Let&apos;s Work Together
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.12] text-[#0B0B0F]">
                Get in Touch with<br />
                <span className="text-[#FF5A00]">KASH Technology</span>
              </h1>

              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl leading-relaxed">
                Have a project, idea or business goal in mind? Tell us about it — our team will get back to you quickly.
              </p>

              {/* 3 Value Propositions */}
              <div className="grid grid-cols-3 gap-3 max-w-xl pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Clock className="w-4 h-4 text-[#FF5A00]" />
                    <span>Prompt Response</span>
                  </div>
                  <p className="text-[10px] text-[#4B5563]">As soon as possible</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <Users className="w-4 h-4 text-[#FF5A00]" />
                    <span>Expert Consultation</span>
                  </div>
                  <p className="text-[10px] text-[#4B5563]">Understand · Plan · Execute</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B0F]">
                    <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                    <span>End-to-End Support</span>
                  </div>
                  <p className="text-[10px] text-[#4B5563]">From idea to growth</p>
                </div>
              </div>
            </div>

            {/* Right Reception Office Image (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[480px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
                <Image
                  src="/images/about/contact-hero-office.png"
                  alt="KASH Technology Headquarters"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. MAIN CONTACT DETAILS & INQUIRY FORM                         */}
      {/* ============================================================== */}
      <section className="py-12 bg-white border-t border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Contact Channels & Location (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Contact Information Cards */}
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-[#0B0B0F]">
                  Contact Information
                </h2>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Reach out to us through any of the following channels. We&apos;re here to help you build, create and grow.
                </p>

                <div className="space-y-3 pt-2">
                  
                  {/* Phone */}
                  <a
                    href={`tel:${SITE_CONFIG.contactPhonePrimary.replace(/\s+/g, "")}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shrink-0 shadow-2xs">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B0B0F]">{SITE_CONFIG.contactPhonePrimary}</div>
                      <div className="text-[11px] text-[#4B5563]">Mon – Sat, 10:00 AM – 7:00 PM</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${SITE_CONFIG.contactEmail}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shrink-0 shadow-2xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B0B0F]">{SITE_CONFIG.contactEmail}</div>
                      <div className="text-[11px] text-[#4B5563]">We&apos;ll get back to you as soon as possible</div>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={SITE_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] hover:border-[#FF5A00] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5A00] shrink-0 shadow-2xs">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0B0B0F]">Chat on WhatsApp</div>
                        <div className="text-[11px] text-[#4B5563]">Quick queries & project discussions</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#FF5A00]" />
                  </a>

                </div>
              </div>

              {/* Follow Us */}
              {(SITE_CONFIG.social.linkedin || SITE_CONFIG.social.github || SITE_CONFIG.social.instagram || SITE_CONFIG.social.youtube) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#0B0B0F]">Follow Us</h3>
                  <p className="text-xs text-[#4B5563]">
                    Stay connected for the latest work, updates and digital tips.
                  </p>
                  <div className="flex items-center gap-2.5">
                    {SITE_CONFIG.social.linkedin && (
                      <a
                        href={SITE_CONFIG.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="w-9 h-9 rounded-full bg-[#FFF9F4] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors"
                      >
                        <SocialIcon name="linkedin" className="w-4 h-4" />
                      </a>
                    )}
                    {SITE_CONFIG.social.github && (
                      <a
                        href={SITE_CONFIG.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="w-9 h-9 rounded-full bg-[#FFF9F4] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors"
                      >
                        <SocialIcon name="github" className="w-4 h-4" />
                      </a>
                    )}
                    {SITE_CONFIG.social.instagram && (
                      <a
                        href={SITE_CONFIG.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="w-9 h-9 rounded-full bg-[#FFF9F4] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors"
                      >
                        <SocialIcon name="instagram" className="w-4 h-4" />
                      </a>
                    )}
                    {SITE_CONFIG.social.youtube && (
                      <a
                        href={SITE_CONFIG.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="w-9 h-9 rounded-full bg-[#FFF9F4] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors"
                      >
                        <SocialIcon name="youtube" className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Areas We Serve */}
              <div className="rounded-2xl border border-[#E8E5E2] bg-[#FFF9F4] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-bold text-[#0B0B0F]">Areas We Serve</span>
                </div>
                <p className="text-xs text-[#4B5563]">
                  Serving businesses across Delhi NCR &amp; Western Uttar Pradesh, as well as remote clients internationally:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { name: "Delhi NCR", href: "/delhi-ncr" },
                    { name: "Noida", href: "/noida" },
                    { name: "Greater Noida", href: "/greater-noida" },
                    { name: "Ghaziabad", href: "/ghaziabad" },
                    { name: "Meerut", href: "/meerut" },
                    { name: "Baghpat", href: "/baghpat" },
                    { name: "Baraut", href: "/baraut" },
                    { name: "Western UP", href: "/western-up" },
                  ].map((area) => (
                    <a
                      key={area.name}
                      href={area.href}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E5E2] text-[11px] font-semibold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors text-center"
                    >
                      {area.name}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Tell Us About Your Project Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#FFF9F4] rounded-3xl border border-[#E8E5E2] p-6 sm:p-8 space-y-6">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A00]">
                  <Send className="w-3.5 h-3.5" />
                  <span>Send an Inquiry</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                  Tell Us About <span className="text-[#FF5A00]">Your Project</span>
                </h2>
                <p className="text-xs text-[#4B5563]">
                  Fill out the form below and our team will get in touch with you shortly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-white border border-[#E8E5E2] text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#FF5A00] mx-auto" />
                  <h3 className="text-lg font-bold text-[#0B0B0F]">Thank You for Reaching Out!</h3>
                  <p className="text-xs text-[#4B5563] max-w-md mx-auto">
                    We&apos;ve received your project details. One of our specialists will review it and get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-lg bg-[#FF5A00] text-white text-xs font-semibold hover:bg-[#FF8A3D] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B0B0F]">
                        Full Name <span className="text-[#FF5A00]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E5E2] rounded-xl text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B0B0F]">
                        Email Address <span className="text-[#FF5A00]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E5E2] rounded-xl text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B0B0F]">
                        Phone Number <span className="text-[#FF5A00]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E5E2] rounded-xl text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>

                    {/* Service Interested In */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B0B0F]">
                        Service Interested In <span className="text-[#FF5A00]">*</span>
                      </label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E5E2] rounded-xl text-[#0B0B0F] focus:outline-none focus:border-[#FF5A00]"
                      >
                        <option value="">Select a service</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Software & CRM / ERP">Software & CRM / ERP</option>
                        <option value="Branding & Design">Branding & Design</option>
                        <option value="Content & Video Editing">Content & Video Editing</option>
                        <option value="Digital Marketing & SEO">Digital Marketing & SEO</option>
                        <option value="Free Digital Audit">Free Digital Audit</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B0B0F]">
                      Project Details <span className="text-[#FF5A00]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project, goals and any specific requirements..."
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E5E2] rounded-xl text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
                    />
                  </div>

                  {/* Submit Button & Trust */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 transition-all shadow-md shadow-[#FF5A00]/25 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      <span>{loading ? "Sending..." : "Send Inquiry"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-[11px] text-[#4B5563]">
                      <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
                      <span>Your information is safe with us. We never share it with anyone.</span>
                    </div>
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
