import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { saveForm, formSchema, formInclude } from "@/lib/server/forms-admin";
import { toFormItem } from "@/lib/server/dto-content";

export const GET = admin<{ id: string }>("forms.view", async ({ params }) => {
  const f = await prisma.form.findUnique({ where: { id: params.id }, include: formInclude });
  if (!f) throw new HttpError(404, "NOT_FOUND", "Form not found");
  return ok(toFormItem(f));
});

export const PUT = admin<{ id: string }>("forms.edit", async ({ request, session, params }) => {
  const d = await body(request, formSchema);
  const saved = await saveForm(params.id, d);
  await audit({ actorId: session.userId, action: "form.update", entity: "Form", entityId: saved.id });
  return ok(toFormItem(saved));
});

/** Forms that already received submissions are deactivated instead of deleted (submissions are retained). */
export const DELETE = admin<{ id: string }>("forms.edit", async ({ session, params }) => {
  const count = await prisma.formSubmission.count({ where: { formId: params.id } });
  if (count > 0) await prisma.form.update({ where: { id: params.id }, data: { active: false } });
  else await prisma.form.delete({ where: { id: params.id } });
  await audit({ actorId: session.userId, action: count ? "form.deactivate" : "form.delete", entity: "Form", entityId: params.id });
  return ok({ deleted: count === 0, deactivated: count > 0 });
});
