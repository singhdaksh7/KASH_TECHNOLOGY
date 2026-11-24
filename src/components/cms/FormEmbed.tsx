"use client";

import { useState, type FormEvent } from "react";
import { ContactFormCard } from "@/components/sections/ContactFormCard";
import { submitCmsForm } from "@/lib/cms/forms-client";

interface FormEmbedProps {
  /** Form identifier managed in the CMS, e.g. "free-digital-audit". "contact" reuses the existing contact form. */
  formSlug: string;
  heading?: string;
  subheading?: string;
}

/**
 * Client integration boundary for CMS forms. This component owns UI + submit
 * only; the submission backend lives behind `submitCmsForm` (see forms-client.ts).
 */
export function FormEmbed({ formSlug, heading, subheading }: FormEmbedProps) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  if (formSlug === "contact") return <ContactFormCard />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    const result = await submitCmsForm(formSlug, Object.fromEntries(fd.entries()) as Record<string, string>);
    setState(result.ok ? "done" : "error");
    setMessage(result.message);
  }

  const field = "w-full rounded-[var(--radius-button)] border border-current/20 bg-transparent px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none";

  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-current/10 bg-white/5 p-6 sm:p-8">
      {heading && <h2 className="font-serif-heading text-2xl font-bold">{heading}</h2>}
      {subheading && <p className="mt-2 text-sm opacity-75">{subheading}</p>}
      {state === "done" ? (
        <p role="status" className="mt-6 font-semibold text-[var(--color-primary)]">{message}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate={false}>
          <label className="block text-sm font-semibold">Name
            <input name="name" required maxLength={120} autoComplete="name" className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">Email
            <input name="email" type="email" required maxLength={200} autoComplete="email" className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">Phone
            <input name="phone" type="tel" maxLength={30} autoComplete="tel" className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">Message
            <textarea name="message" rows={4} maxLength={4000} className={`${field} mt-1`} />
          </label>
          {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60 rounded-[var(--radius-button)]"
          >
            {state === "sending" ? "Sending…" : "Submit"}
          </button>
          {state === "error" && <p role="alert" className="text-sm text-red-400">{message}</p>}
        </form>
      )}
    </div>
  );
}
