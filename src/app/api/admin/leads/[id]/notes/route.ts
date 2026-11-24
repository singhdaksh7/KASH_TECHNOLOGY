import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";

export const POST = admin<{ id: string }>("leads.edit", async ({ request, session, params }) => {
  const d = await body(request, z.object({ text: z.string().trim().min(1).max(5000) }));
  if (!(await prisma.lead.findFirst({ where: { id: params.id, deletedAt: null }, select: { id: true } }))) throw new HttpError(404, "NOT_FOUND", "Lead not found");
  const note = await prisma.leadNote.create({ data: { leadId: params.id, authorId: session.userId, body: d.text } });
  await audit({ actorId: session.userId, action: "lead.note_add", entity: "Lead", entityId: params.id, metadata: { noteId: note.id } });
  return ok({ id: note.id }, 201);
});
