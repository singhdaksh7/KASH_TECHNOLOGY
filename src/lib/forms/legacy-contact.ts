import { prisma } from "@/lib/db/prisma";
import { notifyLead, leadToMailData } from "@/lib/email/lead-mail";
import { sha256 } from "@/lib/auth/crypto";
import { onLeadCreated } from "@/lib/crm/leads";

type Contact = { fullName: string; email: string; phone?: string; company?: string; serviceInterested?: string; message: string; projectBudget?: string };

/**
 * Compatibility bridge for the public contact form.
 * Order: (duplicate guard) → persist Lead → LeadActivity + in-app Notification → ONLY THEN emails.
 * Email problems are recorded in EmailDelivery and can never roll back or lose the lead.
 */
export async function persistLegacyContact(data: Contact, request: Request) {
  // Double-click / client-retry guard: the same enquiry within 2 minutes reuses the saved lead and sends nothing again.
  const recent = await prisma.lead.findFirst({
    where: { email: data.email, message: data.message, source: "legacy_contact", createdAt: { gte: new Date(Date.now() - 2 * 60_000) } },
    orderBy: { createdAt: "desc" },
  });
  if (recent) return { lead: recent, email: {}, duplicate: true };

  const lead = await prisma.lead.create({
    data: {
      name: data.fullName, email: data.email, phone: data.phone || null, company: data.company || null, service: data.serviceInterested || null,
      budget: data.projectBudget || null, message: data.message, source: "legacy_contact",
      landingPage: request.headers.get("referer") || null, referrer: request.headers.get("referer") || null,
    },
  });
  await onLeadCreated(lead);
  const email = await notifyLead({ type: "Lead", id: lead.id }, leadToMailData(lead));
  await prisma.auditLog.create({
    data: { action: "lead.created", entity: "Lead", entityId: lead.id, metadata: { source: "legacy_contact", internalEmail: email.internal?.status ?? "NONE", visitorEmail: email.confirmation?.status ?? "NONE" }, ipHash: sha256(request.headers.get("x-forwarded-for") || "") },
  }).catch(() => undefined);
  return { lead, email, duplicate: false };
}
