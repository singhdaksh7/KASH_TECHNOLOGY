import { z } from "zod";
import { FIELD_NAME_RE, conditionalRulesSchema, validateFieldRules } from "./rules";

export const FIELD_TYPES = ["TEXT", "EMAIL", "PHONE", "TEXTAREA", "SELECT", "CHECKBOX", "RADIO", "DATE", "FILE", "HIDDEN"] as const;
export const MAX_STEPS = 10;
export const MAX_FIELDS = 60;

/** A redirect after success must stay on-site (path) or use https. javascript:/data: and protocol-relative URLs are rejected. */
export const safeRedirectUrl = z.string().max(2048).refine((u) => (u.startsWith("/") && !u.startsWith("//") && !/[\\\s]/.test(u)) || /^https:\/\/[^\s]+$/i.test(u), "Use a local path (/thank-you) or an https URL");

export const fieldSchema = z.object({
  name: z.string().regex(FIELD_NAME_RE, "Start with a letter; letters, numbers and underscores only"),
  label: z.string().trim().min(1).max(200),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().default(false),
  options: z.array(z.string().min(1).max(200)).max(100).nullish(),
  validation: z.record(z.string(), z.unknown()).nullish(),
  step: z.number().int().min(1).max(MAX_STEPS).default(1),
  section: z.string().trim().max(120).nullish(),
  description: z.string().trim().max(500).nullish(),
  conditionalRules: conditionalRulesSchema.nullish(),
});
export type FieldInput = z.infer<typeof fieldSchema>;

export const settingsSchema = z.object({
  multiStep: z.boolean().optional(),
  steps: z.array(z.string().trim().min(1).max(120)).max(MAX_STEPS).optional(),
  submitButtonText: z.string().max(80).optional(),
  description: z.string().max(1000).optional(),
}).passthrough();

export const formBaseSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  active: z.boolean().optional(),
  settings: settingsSchema.nullish(),
  successMessage: z.string().max(1000).nullish(),
  successRedirectUrl: safeRedirectUrl.nullish(),
  createLead: z.boolean().optional(),
  sendNotification: z.boolean().optional(),
  fields: z.array(fieldSchema).min(1).max(MAX_FIELDS),
});
export const formCreateSchema = formBaseSchema;
export const formUpdateSchema = formBaseSchema.partial();
export type FormInput = z.infer<typeof formBaseSchema>;

/** Cross-field validation shared by the admin API and template cloning. Returns a list of problems. */
export function validateFormConfig(input: { fields: FieldInput[]; settings?: z.infer<typeof settingsSchema> | null }): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const f of input.fields) {
    if (seen.has(f.name.toLowerCase())) errors.push(`Duplicate field name "${f.name}"`);
    seen.add(f.name.toLowerCase());
    if ((f.type === "SELECT" || f.type === "RADIO") && !f.options?.length) errors.push(`Field "${f.name}" needs at least one option`);
  }
  const steps = [...new Set(input.fields.map((f) => f.step))].sort((a, b) => a - b);
  if (steps.some((s, i) => s !== i + 1)) errors.push("Steps must be numbered 1, 2, 3… without gaps");
  if (input.settings?.steps && input.settings.steps.length < steps.length) errors.push("settings.steps needs a title for every step used by the fields");
  if (steps.length > 1 && input.settings && input.settings.multiStep === false) errors.push("Fields use several steps but settings.multiStep is false");
  errors.push(...validateFieldRules(input.fields));
  return errors;
}
