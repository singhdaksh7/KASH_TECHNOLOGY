"use client";

import { useState, type FormEvent } from "react";
import { ContactFormCard } from "@/components/sections/ContactFormCard";
import { submitCmsForm } from "@/lib/cms/forms-client";
import type { FormDefinition } from "@/lib/cms/types";

interface FormEmbedProps {
  /** Form identifier managed in the admin Form Builder, e.g. "free-digital-audit". "contact" reuses the approved contact form. */
  formSlug: string;
  /** Definition loaded server-side (published form). When absent a minimal enquiry form is shown. */
  definition?: FormDefinition | null;
  heading?: string;
  subheading?: string;
}

const DEFAULT_FIELDS: FormDefinition["fields"] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "phone", required: false },
  { name: "message", label: "Message", type: "textarea", required: false },
];

const input = "w-full rounded-[var(--radius-button)] border border-[#E8E5E2] bg-white px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[var(--color-primary)] focus:outline-none";

/** Client integration boundary for CMS forms: UI + submit only; persistence/email live behind /api/forms/<slug>/submit. */
export function FormEmbed({ formSlug, definition, heading, subheading }: FormEmbedProps) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  if (formSlug === "contact") return <ContactFormCard />;

  const fields = (definition?.fields ?? DEFAULT_FIELDS).filter((f) => f.type !== "file"); // file upload is not supported on public forms yet

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") values[k] = values[k] ? `${values[k]}, ${v}` : v;
    });
    setState("sending");
    const r = await submitCmsForm(formSlug, values, definition?.successMessage);
    setState(r.ok ? "done" : "error");
    setMessage(r.message);
  }

  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-[#E8E5E2] bg-white p-6 text-[#0B0B0F] shadow-sm sm:p-8">
      {(heading ?? definition?.title) && <h2 className="text-2xl font-bold">{heading ?? definition?.title}</h2>}
      {(subheading ?? definition?.description) && <p className="mt-2 text-sm text-[#4B5563]">{subheading ?? definition?.description}</p>}
      {state === "done" ? (
        <p role="status" className="mt-6 font-semibold text-[var(--color-primary)]">{message}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {fields.map((f) => {
            const common = { name: f.name, required: f.required, placeholder: f.placeholder, id: `f-${formSlug}-${f.name}` };
            if (f.type === "hidden") return <input key={f.name} type="hidden" name={f.name} defaultValue={f.placeholder ?? ""} />;
            if (f.type === "checkbox") {
              return (
                <label key={f.name} className="flex items-start gap-2 text-sm font-medium">
                  <input type="checkbox" name={f.name} value="yes" required={f.required} className="mt-1" /> <span>{f.label}</span>
                </label>
              );
            }
            if (f.type === "radio") {
              return (
                <fieldset key={f.name} className="text-sm font-semibold">
                  <legend className="mb-1">{f.label}{f.required && " *"}</legend>
                  <div className="space-y-1 font-normal">
                    {(f.options ?? []).map((o) => (
                      <label key={o} className="flex items-center gap-2"><input type="radio" name={f.name} value={o} required={f.required} /> {o}</label>
                    ))}
                  </div>
                </fieldset>
              );
            }
            return (
              <div key={f.name}>
                <label htmlFor={common.id} className="mb-1 block text-sm font-semibold">{f.label}{f.required && " *"}</label>
                {f.type === "textarea" ? (
                  <textarea {...common} rows={4} maxLength={4000} className={input} />
                ) : f.type === "select" ? (
                  <select {...common} className={input} defaultValue="">
                    <option value="" disabled>{f.placeholder ?? "Select…"}</option>
                    {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input {...common} type={f.type === "phone" ? "tel" : f.type === "email" ? "email" : f.type === "date" ? "date" : "text"} maxLength={300}
                    autoComplete={f.type === "email" ? "email" : f.type === "phone" ? "tel" : f.name === "name" ? "name" : undefined} className={input} />
                )}
              </div>
            );
          })}
          {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button type="submit" disabled={state === "sending"}
            className="w-full rounded-[var(--radius-button)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60">
            {state === "sending" ? "Sending…" : definition?.submitButtonText ?? "Submit"}
          </button>
          {state === "error" && <p role="alert" className="text-sm text-red-600">{message}</p>}
        </form>
      )}
    </div>
  );
}
