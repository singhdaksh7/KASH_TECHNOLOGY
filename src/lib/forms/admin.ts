import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import type { FormTemplateDefinition } from "@/lib/cms/builtin-templates";
import { formBaseSchema, validateFormConfig, type FieldInput, type FormInput } from "./config";

const json = (v: unknown) => v as Prisma.InputJsonValue;
const nullable = (v: unknown) => (v == null ? Prisma.JsonNull : json(v));
const fieldRows = (fields: FieldInput[]) => fields.map((f, i) => ({
  name: f.name, label: f.label, type: f.type, required: f.required, options: f.options ? json(f.options) : Prisma.JsonNull, validation: nullable(f.validation),
  order: i, step: f.step, section: f.section ?? null, description: f.description ?? null, conditionalRules: nullable(f.conditionalRules),
}));

function assertValid(input: { fields: FieldInput[]; settings?: FormInput["settings"] }) {
  const problems = validateFormConfig(input);
  if (problems.length) throw new HttpError(400, "VALIDATION_ERROR", "The form configuration is invalid", { problems });
}

const include = { fields: { orderBy: { order: "asc" as const } } };

export async function listForms(actor: Actor) {
  assertCan(actor, "forms.view");
  const forms = await prisma.form.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { submissions: true, fields: true } } } });
  return forms;
}
export async function getForm(actor: Actor, id: string) {
  assertCan(actor, "forms.view");
  const f = await prisma.form.findUnique({ where: { id }, include });
  if (!f) throw new HttpError(404, "NOT_FOUND", "Form not found");
  return f;
}

export async function createForm(actor: Actor, input: FormInput) {
  assertCan(actor, "forms.edit");
  assertValid(input);
  try {
    return await prisma.$transaction(async (tx) => {
      const f = await tx.form.create({
        data: {
          name: input.name, slug: input.slug, active: input.active ?? true, settings: nullable(input.settings), successMessage: input.successMessage ?? null,
          successRedirectUrl: input.successRedirectUrl ?? null, createLead: input.createLead ?? true, sendNotification: input.sendNotification ?? true,
          fields: { create: fieldRows(input.fields) },
        },
        include,
      });
      await auditTx(tx, { actorId: actor.id, action: "form.create", entity: "Form", entityId: f.id, metadata: { slug: f.slug, fields: f.fields.length } });
      return f;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A form with that slug already exists");
    throw e;
  }
}

/** Partial update. When `fields` is supplied it replaces the whole field set atomically (old submissions keep their stored values). */
export async function updateForm(actor: Actor, id: string, input: Partial<FormInput>) {
  assertCan(actor, "forms.edit");
  const cur = await prisma.form.findUnique({ where: { id }, include });
  if (!cur) throw new HttpError(404, "NOT_FOUND", "Form not found");
  const settings = input.settings !== undefined ? input.settings : (cur.settings as FormInput["settings"]);
  if (input.fields) assertValid({ fields: input.fields, settings });
  try {
    return await prisma.$transaction(async (tx) => {
      if (input.fields) {
        await tx.formField.deleteMany({ where: { formId: id } });
        await tx.formField.createMany({ data: fieldRows(input.fields).map((r) => ({ ...r, formId: id })) });
      }
      const f = await tx.form.update({
        where: { id },
        data: {
          name: input.name, slug: input.slug, active: input.active, settings: input.settings === undefined ? undefined : nullable(input.settings),
          successMessage: input.successMessage, successRedirectUrl: input.successRedirectUrl, createLead: input.createLead, sendNotification: input.sendNotification,
        },
        include,
      });
      await auditTx(tx, { actorId: actor.id, action: "form.update", entity: "Form", entityId: id, metadata: { fields: Object.keys(input) } });
      return f;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A form with that slug already exists");
    throw e;
  }
}

/** Forms with submissions are deactivated instead of deleted (FormSubmission.formId is RESTRICT). */
export async function deleteForm(actor: Actor, id: string) {
  assertCan(actor, "forms.edit");
  const f = await prisma.form.findUnique({ where: { id }, include: { _count: { select: { submissions: true } } } });
  if (!f) throw new HttpError(404, "NOT_FOUND", "Form not found");
  if (f._count.submissions) throw new HttpError(409, "FORM_HAS_SUBMISSIONS", "This form has submissions and cannot be deleted. Deactivate it instead.", { submissions: f._count.submissions });
  await prisma.$transaction(async (tx) => { await tx.form.delete({ where: { id } }); await auditTx(tx, { actorId: actor.id, action: "form.delete", entity: "Form", entityId: id, metadata: { slug: f.slug } }); });
}

// ── Templates ──────────────────────────────────────────────────────────────
export async function listFormTemplates(actor: Actor) {
  assertCan(actor, "forms.view");
  return prisma.formTemplate.findMany({ orderBy: [{ isSystem: "desc" }, { name: "asc" }] });
}

/** Clones a template into a real Form + FormField rows. A custom slug that is taken is a conflict; a default slug gets a numeric suffix. */
export async function createFormFromTemplate(actor: Actor, templateId: string, opts: { name?: string; slug?: string } = {}) {
  assertCan(actor, "forms.edit");
  const t = await prisma.formTemplate.findUnique({ where: { id: templateId } });
  if (!t) throw new HttpError(404, "NOT_FOUND", "Form template not found");
  const def = t.definition as unknown as FormTemplateDefinition;
  let slug = opts.slug ?? def.slug;
  if (!opts.slug) { for (let n = 2; await prisma.form.findUnique({ where: { slug }, select: { id: true } }); n++) slug = `${def.slug}-${n}`; }
  const parsed = formBaseSchema.safeParse({
    name: opts.name ?? t.name, slug, settings: def.settings ?? null, successMessage: def.successMessage ?? null, successRedirectUrl: def.successRedirectUrl ?? null,
    createLead: def.createLead ?? true, sendNotification: def.sendNotification ?? true,
    fields: def.fields.map((f) => ({ ...f, required: f.required ?? false, step: f.step ?? 1 })),
  });
  if (!parsed.success) throw new HttpError(422, "INVALID_TEMPLATE", "This template's definition is invalid", parsed.error.flatten());
  const form = await createForm(actor, parsed.data);
  await prisma.auditLog.create({ data: { actorId: actor.id, action: "form.create_from_template", entity: "Form", entityId: form.id, metadata: { template: t.key } } }).catch(() => undefined);
  return form;
}
