import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { LeadItem } from "@/lib/admin-client/types";

export const lead = {
  notes: { orderBy: { createdAt: "desc" as const }, include: { author: { select: { name: true, email: true } } } },
  assignedTo: { select: { id: true, name: true, email: true } },
};
export type LeadRow = Prisma.LeadGetPayload<{ include: typeof lead }>;
type TaskRow = { id: string; title: string; dueAt: Date | null; status: string; assignedTo: { name: string | null; email: string } | null };

const stamp = (d: Date | null | undefined) => (d ? d.toISOString().replace("T", " ").slice(0, 16) : undefined);

export function toLeadItem(l: LeadRow, tasks: TaskRow[] = []): LeadItem {
  const formName = l.source?.startsWith("form:") ? l.source.slice(5) : undefined;
  return {
    id: l.id, name: l.name ?? "(no name)", company: l.company ?? "", email: l.email ?? "", phone: l.phone ?? "", service: l.service ?? "",
    source: l.source ?? "", landingPage: l.landingPage ?? "", campaign: l.utmCampaign ?? undefined, message: l.message ?? undefined,
    referrer: l.referrer ?? undefined,
    utm: { source: l.utmSource ?? undefined, medium: l.utmMedium ?? undefined, campaign: l.utmCampaign ?? undefined, term: l.utmTerm ?? undefined, content: l.utmContent ?? undefined },
    statusHistory: Array.isArray(l.statusHistory) ? (l.statusHistory as LeadItem["statusHistory"]) : [],
    date: l.createdAt.toISOString().replace("T", " ").slice(0, 16), status: l.status,
    priority: l.priority, assignedToId: l.assignedToId ?? undefined, assignedTo: l.assignedTo ? l.assignedTo.name || l.assignedTo.email : undefined,
    leadValue: l.estimatedValue == null ? undefined : Number(l.estimatedValue), nextFollowUp: l.nextFollowUpAt?.toISOString(), tags: l.tags,
    lastActivity: stamp(l.lastActivityAt),
    attribution: { utmSource: l.utmSource ?? undefined, utmMedium: l.utmMedium ?? undefined, utmCampaign: l.utmCampaign ?? undefined, landingPage: l.landingPage ?? undefined, referrer: l.referrer ?? undefined, formName },
    notes: l.notes.map((n) => ({ id: n.id, author: n.author?.name || n.author?.email || "—", text: n.body, date: n.createdAt.toISOString().replace("T", " ").slice(0, 16) })),
    tasks: tasks.map((t) => ({ id: t.id, title: t.title, dueDate: t.dueAt?.toISOString() ?? "", assignedTo: t.assignedTo ? t.assignedTo.name || t.assignedTo.email : "", completed: t.status === "DONE" })),
  };
}

/** Related tasks for a batch of leads in one query. */
export async function loadLeadTasks(ids: string[]) {
  const rows = ids.length ? await prisma.task.findMany({ where: { relatedType: "LEAD", relatedId: { in: ids } }, orderBy: { createdAt: "desc" }, include: { assignedTo: { select: { name: true, email: true } } } }) : [];
  const by = new Map<string, TaskRow[]>();
  for (const t of rows) by.set(t.relatedId!, [...(by.get(t.relatedId!) ?? []), t]);
  return by;
}

export const loadOne = (id: string) => prisma.lead.findFirstOrThrow({ where: { id, deletedAt: null }, include: lead });

/** Full lead as the admin UI expects, with its activity timeline. */
export async function toLeadDetail(id: string) {
  const l = await loadOne(id);
  const [tasks, activities] = await Promise.all([
    loadLeadTasks([id]),
    prisma.leadActivity.findMany({ where: { leadId: id }, orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  const actors = await prisma.user.findMany({ where: { id: { in: [...new Set(activities.map((a) => a.actorId).filter((x): x is string => !!x))] } }, select: { id: true, name: true, email: true } });
  const who = (aid: string | null) => (aid ? (() => { const u = actors.find((x) => x.id === aid); return u ? u.name || u.email : "—"; })() : "System");
  return {
    ...toLeadItem(l, tasks.get(id) ?? []),
    activities: activities.map((a) => ({ id: a.id, type: a.type, actor: who(a.actorId), at: a.createdAt.toISOString(), metadata: (a.metadata ?? {}) as Record<string, unknown> })),
  };
}
