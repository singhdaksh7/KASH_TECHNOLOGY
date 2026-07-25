"use client";

import { useState } from "react";
import { ContactFormValues, PROJECT_TYPES, ESTIMATED_BUDGETS, ContactResponse } from "@/types/contact";
import { validateContactForm } from "@/lib/contact-validation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormValues>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    estimatedBudget: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    // Client side validation
    const clientErrors = validateContactForm(formData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ContactResponse = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          fullName: "", email: "", phone: "", company: "", 
          projectType: "", estimatedBudget: "", message: "", honeypot: ""
        });
      } else {
        setServerError(data.message || "Something went wrong.");
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch {
      setServerError("Network error. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12 text-center" aria-live="polite">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black mb-4">Inquiry Received</h3>
        <p className="text-muted mb-8">Thank you for reaching out. We will review your project details and get back to you shortly.</p>
        <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors">
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl" noValidate>
      {serverError && (
        <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex gap-3 text-error" aria-live="assertive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{serverError}</p>
        </div>
      )}

      {/* Honeypot field - visually hidden, removed from tab order */}
      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
        <label htmlFor="honeypot">Do not fill this out if you are human</label>
        <input type="text" id="honeypot" name="honeypot" tabIndex={-1} value={formData.honeypot} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-bold mb-2">Full Name <span className="text-error">*</span></label>
          <input 
            type="text" id="fullName" name="fullName" required 
            aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.fullName ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
            value={formData.fullName} onChange={handleChange} autoComplete="name"
          />
          {errors.fullName && <p id="fullName-error" className="text-error text-xs mt-2">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email Address <span className="text-error">*</span></label>
          <input 
            type="email" id="email" name="email" required 
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.email ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
            value={formData.email} onChange={handleChange} autoComplete="email"
          />
          {errors.email && <p id="email-error" className="text-error text-xs mt-2">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-bold mb-2">Phone Number</label>
          <input 
            type="tel" id="phone" name="phone" 
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.phone ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
            value={formData.phone} onChange={handleChange} autoComplete="tel"
          />
          {errors.phone && <p id="phone-error" className="text-error text-xs mt-2">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-bold mb-2">Company Name</label>
          <input 
            type="text" id="company" name="company" 
            aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined}
            className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.company ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
            value={formData.company} onChange={handleChange} autoComplete="organization"
          />
          {errors.company && <p id="company-error" className="text-error text-xs mt-2">{errors.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectType" className="block text-sm font-bold mb-2">Project Type <span className="text-error">*</span></label>
          <select 
            id="projectType" name="projectType" required 
            aria-invalid={!!errors.projectType} aria-describedby={errors.projectType ? "projectType-error" : undefined}
            className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none ${errors.projectType ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
            value={formData.projectType} onChange={handleChange}
          >
            <option value="" disabled>Select a project type...</option>
            {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.projectType && <p id="projectType-error" className="text-error text-xs mt-2">{errors.projectType}</p>}
        </div>
        <div>
          <label htmlFor="estimatedBudget" className="block text-sm font-bold mb-2">Estimated Budget <span className="text-error">*</span></label>
          <select 
            id="estimatedBudget" name="estimatedBudget" required 
            aria-invalid={!!errors.estimatedBudget} aria-describedby={errors.estimatedBudget ? "estimatedBudget-error" : undefined}
            className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none ${errors.estimatedBudget ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
            value={formData.estimatedBudget} onChange={handleChange}
          >
            <option value="" disabled>Select a budget range...</option>
            {ESTIMATED_BUDGETS.map(budget => <option key={budget} value={budget}>{budget}</option>)}
          </select>
          {errors.estimatedBudget && <p id="estimatedBudget-error" className="text-error text-xs mt-2">{errors.estimatedBudget}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-bold mb-2">Project Description <span className="text-error">*</span></label>
        <textarea 
          id="message" name="message" required rows={5}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors resize-y min-h-[120px] ${errors.message ? 'border-error focus:border-error' : 'border-white/10 focus:border-primary'}`}
          value={formData.message} onChange={handleChange}
        ></textarea>
        {errors.message && <p id="message-error" className="text-error text-xs mt-2">{errors.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
        ) : (
          "Start the Conversation"
        )}
      </button>
    </form>
  );
}
