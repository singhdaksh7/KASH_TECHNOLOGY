"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { submitCmsForm } from "@/lib/cms/forms-client";

/** Newsletter signup (redesigned look). Persists through the CMS form backend when a formSlug is configured. */
export function FooterNewsletter({ formSlug }: { formSlug?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (!formSlug) {
      setState("done");
      setEmail("");
      return;
    }
    setState("sending");
    const r = await submitCmsForm(formSlug, { email });
    setState(r.ok ? "done" : "error");
    if (r.ok) setEmail("");
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex items-center gap-1.5 pt-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          aria-label="Email address"
          className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E8E5E2] rounded-lg text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={state === "sending"}
          className="p-2 bg-[#FF5A00] text-white rounded-lg hover:bg-[#FF8A3D] transition-colors shrink-0 disabled:opacity-60"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
      {state === "done" && <p role="status" className="text-[11px] text-[#FF5A00] font-medium">Thank you for subscribing!</p>}
      {state === "error" && <p role="alert" className="text-[11px] text-red-600">Could not subscribe right now. Please try again later.</p>}
    </>
  );
}
