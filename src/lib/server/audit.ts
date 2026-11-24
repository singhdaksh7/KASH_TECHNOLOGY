import { prisma } from "@/lib/db/prisma";
export const audit=(data:{actorId?:string;action:string;entity:string;entityId?:string;metadata?:object})=>prisma.auditLog.create({data}).catch(()=>undefined);
