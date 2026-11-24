"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { ContactFormCard } from "@/components/sections/ContactFormCard";
import { submitCmsForm } from "@/lib/cms/forms-client";
import type { FormDefinition } from "@/lib/cms/types";
import { evaluationOrder, fieldState } from "@/lib/forms/rules";

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
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState<Record<string, unknown>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const fields = useMemo(() => (definition?.fields ?? DEFAULT_FIELDS).filter((f) => f.type !== "file"), [definition]); // file upload is not supported on public forms yet
  // Advanced forms: conditional rules are plain data evaluated with fixed operators (no code is executed).
  const visible = useMemo(() => {
    const eff: Record<string, unknown> = {};
    const out = new Map<string, { visible: boolean; requiredByRule: boolean }>();
    for (const f of evaluationOrder(fields)) {
      const st = fieldState(f.conditionalRules, eff);
      out.set(f.name, st);
      if (st.visible && vals[f.name] !== undefined && vals[f.name] !== "") eff[f.name] = vals[f.name];
    }
    return out;
  }, [fields, vals]);
  const stepNumbers = useMemo(() => [...new Set(fields.map((f) => f.step ?? 1))].sort((a, b) => a - b), [fields]);
  const multi = stepNumbers.length > 1;
  const activeStep = stepNumbers[Math.min(step, stepNumbers.length - 1)] ?? 1;
  const isLast = step >= stepNumbers.length - 1;

  if (formSlug === "contact") return <ContactFormCard />;

  const syncValues = () => {
    if (!formRef.current) return;
    const o: Record<string, unknown> = {};
    new FormData(formRef.current).forEach((v, k) => { if (typeof v === "string") o[k] = o[k] ? `${o[k]}, ${v}` : v; });
    setVals(o);
  };
  const next = () => {
    const els = formRef.current?.querySelectorAll<HTMLInputElement>(`[data-step="${activeStep}"] input, [data-step="${activeStep}"] select, [data-step="${activeStep}"] textarea`);
    for (const el of els ?? []) if (!el.reportValidity()) return;
    setStep((n) => Math.min(n + 1, stepNumbers.length - 1));
  };

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
    if (r.ok && r.redirectUrl) window.location.assign(r.redirectUrl);
  }

  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-[#E8E5E2] bg-white p-6 text-[#0B0B0F] shadow-sm sm:p-8">
      {(heading ?? definition?.title) && <h2 className="text-2xl font-bold">{heading ?? definition?.title}</h2>}
      {(subheading ?? definition?.description) && <p className="mt-2 text-sm text-[#4B5563]">{subheading ?? definition?.description}</p>}
      {state === "done" ? (
        <p role="status" className="mt-6 font-semibold text-[var(--color-primary)]">{message}</p>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} onChange={syncValues} className="mt-6 space-y-4">
          {multi && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B5563]" aria-live="polite">
              Step {step + 1} of {stepNumbers.length}{definition?.steps?.[step] ? ` — ${definition.steps[step]}` : ""}
            </p>
          )}
          {fields.map((f, idx) => {
            const st = visible.get(f.name);
            if (st && !st.visible) return null; // hidden by a conditional rule: not rendered, so not submitted
            const onStep = (f.step ?? 1) === activeStep;
            const req = (f.required || !!st?.requiredByRule) && (!multi || onStep);
            const prev = fields.slice(0, idx).reverse().find((x) => (x.step ?? 1) === (f.step ?? 1) && visible.get(x.name)?.visible !== false);
            const heading = f.section && f.section !== prev?.section ? f.section : null;
            const common = { name: f.name, required: req, placeholder: f.placeholder, id: `f-${formSlug}-${f.name}` };
            const wrap = (node: React.ReactNode) => (
              <div key={f.name} data-step={f.step ?? 1} hidden={multi && !onStep} className="space-y-4">
                {heading && <h3 className="pt-2 text-sm font-bold uppercase tracking-wide text-[#4B5563]">{heading}</h3>}
                {node}
              </div>
            );
            const desc = f.description ? <p className="-mt-1 text-xs text-[#4B5563]">{f.description}</p> : null;
            if (f.type === "hidden") return <input key={f.name} type="hidden" name={f.name} defaultValue={f.placeholder ?? ""} />;
            if (f.type === "checkbox") {
              return wrap(
                <label className="flex items-start gap-2 text-sm font-medium">
                  <input type="checkbox" name={f.name} value="yes" required={req} className="mt-1" /> <span>{f.label}</span>
                </label>,
              );
            }
            if (f.type === "radio") {
              return wrap(
                <fieldset className="text-sm font-semibold">
                  <legend className="mb-1">{f.label}{req && " *"}</legend>
                  {desc}
                  <div className="space-y-1 font-normal">
                    {(f.options ?? []).map((o) => (
                      <label key={o} className="flex items-center gap-2"><input type="radio" name={f.name} value={o} required={req} /> {o}</label>
                    ))}
                  </div>
                </fieldset>,
              );
            }
            return wrap(
              <div>
                <label htmlFor={common.id} className="mb-1 block text-sm font-semibold">{f.label}{req && " *"}</label>
                {desc}
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
              </div>,
            );
          })}
          {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          {multi && step > 0 && (
            <button type="button" onClick={() => setStep((n) => Math.max(n - 1, 0))} className="w-full rounded-[var(--radius-button)] border border-[#E8E5E2] px-6 py-3 text-sm font-bold text-[#0B0B0F] transition hover:bg-[#FFF9F4]">
              Back
            </button>
          )}
          {multi && !isLast ? (
            <button type="button" onClick={next}
              className="w-full rounded-[var(--radius-button)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-105">
              Next
            </button>
          ) : (
            <button type="submit" disabled={state === "sending"}
              className="w-full rounded-[var(--radius-button)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60">
              {state === "sending" ? "Sending…" : definition?.submitButtonText ?? "Submit"}
            </button>
          )}
          {state === "error" && <p role="alert" className="text-sm text-red-600">{message}</p>}
        </form>
      )}
    </div>
  );
}
