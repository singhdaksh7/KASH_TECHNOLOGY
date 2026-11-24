import { prisma } from "@/lib/db/prisma"; import { ok } from "@/lib/server/http"; export async function GET(){return ok(await prisma.themeSetting.findMany());}
