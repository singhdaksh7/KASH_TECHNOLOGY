"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Calendar, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  serviceInterested?: string;
  projectBudget?: string;
  message?: string;
}

export function ContactFormCard() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceInterested: "",
    projectBudget: "",
    message: "",
    honeypot: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validateClient = (): boolean => {
    const errors: FieldErrors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.serviceInterested) {
      errors.serviceInterested = "Please select a service";
    }

    if (!formData.message.trim()) {
      errors.message = "Project details are required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Please provide at least 10 characters of details";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (loading || hasSubmitted) return;

    if (!validateClient()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setHasSubmitted(true);
        trackEvent("contact_form_submit", { service: formData.serviceInterested });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          serviceInterested: "",
          projectBudget: "",
          message: "",
          honeypot: "",
        });
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setServerError(data.message || "Unable to send enquiry. Please email founder@kash-technology.com directly.");
      }
    } catch {
      setServerError("Network connection issue. Please email founder@kash-technology.com directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Send Us a Message Form (col-span-7) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-black/5 shadow-xl">
        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-[#f36b21]/10 flex items-center justify-center text-[#f36b21] text-xs font-bold">✉</span>
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#111827]">
              Tell Us About Your Project
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6b7280]">
            Share a few details and we&apos;ll get back to you.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#111827]">
              Thank you! Your enquiry has been received. We&apos;ll get back to you shortly.
            </h3>
            <p className="text-xs sm:text-sm text-[#6b7280] max-w-md mx-auto">
              A confirmation email has been sent to your inbox. You can also message us directly on WhatsApp for quick inquiries.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "contact_form_success" })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Chat</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setHasSubmitted(false);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#050708] text-white text-xs font-bold hover:bg-[#f36b21] transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="hidden" aria-hidden="true">
              <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex={-1} />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Full Name <span className="text-[#f36b21]">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border ${fieldErrors.fullName ? 'border-red-500 bg-red-50/30' : 'border-black/10'} focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all`}
              />
              {fieldErrors.fullName && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Email Address <span className="text-[#f36b21]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border ${fieldErrors.email ? 'border-red-500 bg-red-50/30' : 'border-black/10'} focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all`}
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border border-black/10 focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border border-black/10 focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all"
              />
            </div>

            {/* Service & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Service Interested In <span className="text-[#f36b21]">*</span>
                </label>
                <select
                  name="serviceInterested"
                  value={formData.serviceInterested}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border ${fieldErrors.serviceInterested ? 'border-red-500 bg-red-50/30' : 'border-black/10'} focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all`}
                >
                  <option value="">Select a service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Custom Software">Custom Software</option>
                  <option value="AI Automation">AI Automation</option>
                  <option value="ERP / CRM Systems">ERP / CRM Systems</option>
                  <option value="E-commerce Solutions">E-commerce Solutions</option>
                </select>
                {fieldErrors.serviceInterested && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.serviceInterested}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Project Budget
                </label>
                <select
                  name="projectBudget"
                  value={formData.projectBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border border-black/10 focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all"
                >
                  <option value="">Select your budget range</option>
                  <option value="< $5,000 / < ₹4 Lakhs">&lt; $5,000 / &lt; ₹4 Lakhs</option>
                  <option value="$5,000 - $15,000 / ₹4 - 12 Lakhs">$5,000 - $15,000 / ₹4 - 12 Lakhs</option>
                  <option value="$15,000 - $30,000 / ₹12 - 25 Lakhs">$15,000 - $30,000 / ₹12 - 25 Lakhs</option>
                  <option value="$30,000+ / ₹25+ Lakhs">$30,000+ / ₹25+ Lakhs</option>
                </select>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Project Details <span className="text-[#f36b21]">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Tell us about your project, goals, and requirements..."
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#fbf8f2] border ${fieldErrors.message ? 'border-red-500 bg-red-50/30' : 'border-black/10'} focus:border-[#f36b21] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#111827] transition-all resize-none`}
              />
              {fieldErrors.message && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || hasSubmitted}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_4px_14px_rgba(243,107,33,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Right Column: Contact Information (col-span-5) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white rounded-3xl p-7 border border-black/5 shadow-xl space-y-4">
          <div className="space-y-0.5">
            <h3 className="font-serif-heading text-lg font-bold text-[#111827]">
              Contact Information
            </h3>
            <p className="text-xs text-[#6b7280]">
              Reach us directly through any channel below.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Email Us */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#fbf8f2] border border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#f36b21] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] block">Email Us</span>
                <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-xs font-semibold text-[#f36b21] hover:underline break-all block">
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#fbf8f2] border border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#f36b21] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] block">Call Us</span>
                <div className="text-xs font-semibold text-[#111827] space-x-1.5">
                  <a href={`tel:${SITE_CONFIG.contactPhonePrimary.replace(/\s+/g, '')}`} className="hover:text-[#f36b21]">
                    {SITE_CONFIG.contactPhonePrimary}
                  </a>
                  <span>/</span>
                  <a href={`tel:${SITE_CONFIG.contactPhoneAlternate.replace(/\s+/g, '')}`} className="hover:text-[#f36b21]">
                    {SITE_CONFIG.contactPhoneAlternate}
                  </a>
                </div>
              </div>
            </div>

            {/* Our Location */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#fbf8f2] border border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#f36b21] flex items-center justify-center text-white shrink-0 shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] block">Our Location</span>
                <p className="text-xs text-[#4b5563]">
                  Serving clients across India &amp; internationally.
                </p>
              </div>
            </div>
          </div>

          {/* Prefer a Quick Chat Card */}
          <div className="bg-[#050708] text-white rounded-2xl p-5 border border-white/10 shadow-xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="font-serif-heading text-sm font-bold text-white">
                Need to Talk?
              </h4>
              <p className="text-[11px] text-[#9ca3af] leading-tight">
                Book a quick project discussion.
              </p>
            </div>
            <a
              href={SITE_CONFIG.bookingUrl}
              onClick={() => trackEvent("book_call_click", { location: "contact_quick_chat" })}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-[#f36b21] text-white text-xs font-bold border border-white/20 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Call</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
