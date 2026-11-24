import { prisma } from "@/lib/db/prisma"; import { requirePermission } from "@/lib/rbac/permissions"; import { ok } from "@/lib/server/http";
export async function GET(){const a=await requirePermission("audit.view");if(a.error)return a.error;return ok(await prisma.auditLog.findMany({take:200,orderBy:{createdAt:"desc"},include:{actor:{select:{email:true,name:true}}}}));}
