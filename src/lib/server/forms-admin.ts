import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { FIELD_TYPE_TO_DB } from "@/lib/server/dto-content";

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
  })).max(40),
});

export async function saveForm(id: string | null, d: z.infer<typeof formSchema>) {
  const names = new Set<string>();
  for (const f of d.fields) {
    if (names.has(f.name)) throw new HttpError(400, "VALIDATION_ERROR", `Duplicate field name "${f.name}"`);
    names.add(f.name);
  }
  const settings = { description: d.description, submitButtonText: d.submitButtonText, successMessage: d.successMessage } as Prisma.InputJsonValue;
  const fields = d.fields.map((f, i) => ({
    name: f.name, label: f.label, type: FIELD_TYPE_TO_DB[f.type as keyof typeof FIELD_TYPE_TO_DB], required: f.required, order: i,
    options: f.options ? (f.options as Prisma.InputJsonValue) : Prisma.JsonNull,
    validation: { placeholder: f.placeholder, pattern: f.validation } as Prisma.InputJsonValue,
  }));
  return prisma.$transaction(async (tx) => {
    if (!id) {
      return tx.form.create({ data: { name: d.title, slug: d.slug, settings, fields: { create: fields } }, include: formInclude });
    }
    await tx.formField.deleteMany({ where: { formId: id } });
    return tx.form.update({ where: { id }, data: { name: d.title, slug: d.slug, settings, fields: { create: fields } }, include: formInclude });
  });
}
