import { prisma } from "@/lib/db/prisma";
import type { LeadItem } from "@/lib/admin-client/types";

export const lead = noteInclude();
function noteInclude() {
  return { notes: { orderBy: { createdAt: "desc" as const }, include: { author: { select: { name: true, email: true } } } } };
}

export function toLeadItem(l: Awaited<ReturnType<typeof loadOne>>): LeadItem {
  return {
    id: l.id, name: l.name ?? "(no name)", company: l.company ?? "", email: l.email ?? "", phone: l.phone ?? "", service: l.service ?? "",
    source: l.source ?? "", landingPage: l.landingPage ?? "", campaign: l.utmCampaign ?? undefined, message: l.message ?? undefined,
    referrer: l.referrer ?? undefined,
    utm: { source: l.utmSource ?? undefined, medium: l.utmMedium ?? undefined, campaign: l.utmCampaign ?? undefined, term: l.utmTerm ?? undefined, content: l.utmContent ?? undefined },
    statusHistory: Array.isArray(l.statusHistory) ? (l.statusHistory as LeadItem["statusHistory"]) : [],
    date: l.createdAt.toISOString().replace("T", " ").slice(0, 16), status: l.status,
    notes: l.notes.map((n) => ({ id: n.id, author: n.author?.name || n.author?.email || "—", text: n.body, date: n.createdAt.toISOString().replace("T", " ").slice(0, 16) })),
  };
}
export const loadOne = (id: string) => prisma.lead.findFirstOrThrow({ where: { id, deletedAt: null }, include: lead });

