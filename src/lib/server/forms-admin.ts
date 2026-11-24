import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { FIELD_TYPE_TO_DB } from "@/lib/server/dto-content";
import { conditionalRulesSchema } from "@/lib/forms/rules";
import { safeRedirectUrl, validateFormConfig } from "@/lib/forms/config";
import { auditTx } from "@/lib/server/audit-tx";

export const formInclude = { fields: true, _count: { select: { submissions: true } } } as const;

export const formSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes").max(80),
  description: z.string().max(1000).default(""),
  submitButtonText: z.string().max(60).default("Submit"),
  successMessage: z.string().max(500).default("Thank you — we'll be in touch shortly."),
  fields: z.array(z.object({
    label: z.string().trim().min(1).max(120),
    name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Field name: letters, numbers, underscore").max(60),
    type: z.enum(Object.keys(FIELD_TYPE_TO_DB) as [string, ...string[]]),
    required: z.boolean().default(false),
    placeholder: z.string().max(200).optional(),
    options: z.array(z.string().max(200)).max(50).optional(),
    validation: z.string().max(300).optional(),
    description: z.string().max(500).optional(),
    step: z.number().int().min(1).max(10).default(1),
    section: z.string().max(120).optional(),
    /** Simple form of a rule ("show when <field> equals <value>"); `conditionalRules` wins when both are sent. */
    conditionalOn: z.object({ field: z.string().max(60), equals: z.string().max(500) }).optional(),
    conditionalRules: conditionalRulesSchema.nullish(),
  })).max(40),
  isMultiStep: z.boolean().default(false),
  stepTitles: z.array(z.string().trim().min(1).max(120)).max(10).default([]),
  active: z.boolean().optional(),
  redirectUrl: safeRedirectUrl.or(z.literal("")).optional(),
  createCrmLead: z.boolean().default(true),
  sendEmailNotification: z.boolean().default(true),
});

export async function saveForm(id: string | null, d: z.infer<typeof formSchema>, actorId?: string) {
  const names = new Set<string>();
  for (const f of d.fields) {
    if (names.has(f.name)) throw new HttpError(400, "VALIDATION_ERROR", `Duplicate field name "${f.name}"`);
    names.add(f.name);
  }
  const rulesOf = (f: (typeof d.fields)[number]) =>
    f.conditionalRules ?? (f.conditionalOn?.field ? { action: "show" as const, match: "all" as const, conditions: [{ field: f.conditionalOn.field, operator: "equals" as const, value: f.conditionalOn.equals }] } : null);
  // Shared Phase 2 validation: contiguous steps, options present, rules reference real fields, no self/circular references.
  const problems = validateFormConfig({
    fields: d.fields.map((f) => ({ name: f.name, label: f.label, type: FIELD_TYPE_TO_DB[f.type as keyof typeof FIELD_TYPE_TO_DB], required: f.required, options: f.options, step: d.isMultiStep ? f.step : 1, conditionalRules: rulesOf(f) })) as never,
    settings: { multiStep: d.isMultiStep, steps: d.stepTitles },
  });
  if (problems.length) throw new HttpError(400, "VALIDATION_ERROR", problems[0], { problems });
  const settings = {
    description: d.description, submitButtonText: d.submitButtonText, successMessage: d.successMessage,
    multiStep: d.isMultiStep, steps: d.isMultiStep ? d.stepTitles : undefined,
  } as Prisma.InputJsonValue;
  const fields = d.fields.map((f, i) => ({
    name: f.name, label: f.label, type: FIELD_TYPE_TO_DB[f.type as keyof typeof FIELD_TYPE_TO_DB], required: f.required, order: i,
    options: f.options ? (f.options as Prisma.InputJsonValue) : Prisma.JsonNull,
    validation: { placeholder: f.placeholder, pattern: f.validation } as Prisma.InputJsonValue,
    step: d.isMultiStep ? f.step : 1, section: f.section || null, description: f.description || null,
    conditionalRules: rulesOf(f) ? (rulesOf(f) as Prisma.InputJsonValue) : Prisma.JsonNull,
  }));
  const scalar = { successMessage: d.successMessage, successRedirectUrl: d.redirectUrl || null, createLead: d.createCrmLead, sendNotification: d.sendEmailNotification, ...(d.active === undefined ? {} : { active: d.active }) };
  return prisma.$transaction(async (tx) => {
    if (!id) {
      const f = await tx.form.create({ data: { name: d.title, slug: d.slug, settings, ...scalar, fields: { create: fields } }, include: formInclude });
      if (actorId) await auditTx(tx, { actorId, action: "form.create", entity: "Form", entityId: f.id, metadata: { slug: f.slug } });
      return f;
    }
    await tx.formField.deleteMany({ where: { formId: id } });
    const f = await tx.form.update({ where: { id }, data: { name: d.title, slug: d.slug, settings, ...scalar, fields: { create: fields } }, include: formInclude });
    if (actorId) await auditTx(tx, { actorId, action: "form.update", entity: "Form", entityId: id, metadata: { slug: f.slug } });
    return f;
  });
}
