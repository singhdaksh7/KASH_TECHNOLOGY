import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { actorFromSession } from "@/lib/rbac/actor";
import { addLeadNote } from "@/lib/crm/leads";

/** V1 contract: body { text } → { id }. Also records a NOTE_ADDED activity (Phase 2). */
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => {
  const d = await body(request, z.object({ text: z.string().trim().min(1).max(5000) }));
  const note = await addLeadNote(actorFromSession(session), params.id, d.text);
  await audit({ actorId: session.userId, action: "lead.note_add", entity: "Lead", entityId: params.id, metadata: { noteId: note.id } });
  return ok({ id: note.id }, 201);
});
