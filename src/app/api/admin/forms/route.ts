import { prisma } from "@/lib/db/prisma";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { saveForm, formSchema, formInclude } from "@/lib/server/forms-admin";
import { toFormItem } from "@/lib/server/dto-content";

export const GET = admin("forms.view", async () => ok((await prisma.form.findMany({ include: formInclude, orderBy: { createdAt: "asc" } })).map(toFormItem)));

export const POST = admin("forms.edit", async ({ request, session }) => {
  const d = await body(request, formSchema);
  const saved = await saveForm(null, d);
  await audit({ actorId: session.userId, action: "form.create", entity: "Form", entityId: saved.id });
  return ok(toFormItem(saved), 201);
});
