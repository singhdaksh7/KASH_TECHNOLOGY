import { prisma } from "@/lib/db/prisma";
import { notifyLead } from "@/lib/email/resend";
import { sha256 } from "@/lib/auth/crypto";
type Contact={fullName:string;email:string;phone?:string;company?:string;serviceInterested?:string;message:string;projectBudget?:string};
/** Compatibility bridge for the existing public form. Database persistence always precedes email. */
export async function persistLegacyContact(data:Contact,request:Request){const lead=await prisma.lead.create({data:{name:data.fullName,email:data.email,phone:data.phone||null,company:data.company||null,service:data.serviceInterested||null,message:data.message,source:"legacy_contact",landingPage:request.headers.get("referer")||null,referrer:request.headers.get("referer")||null}});const email=await notifyLead({name:lead.name,email:lead.email,service:lead.service,message:lead.message});await prisma.auditLog.create({data:{action:"lead.created",entity:"Lead",entityId:lead.id,metadata:{source:"legacy_contact",emailStatus:email.sent?"SENT":"FAILED"},ipHash:sha256(request.headers.get("x-forwarded-for")||"")}});return {lead,email};}
