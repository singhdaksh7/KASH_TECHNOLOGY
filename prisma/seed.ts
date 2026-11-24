import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedPhase2 } from "./seed-phase2";
const prisma = new PrismaClient();
const permissions = ["pages.view","pages.create","pages.edit","pages.publish","pages.delete","portfolio.view","portfolio.edit","portfolio.publish","articles.view","articles.edit","articles.publish","seo.view","seo.edit","media.view","media.upload","media.delete","forms.view","forms.edit","leads.view","leads.edit","users.view","users.manage","settings.view","settings.manage","audit.view"];
async function main() {
  for (const key of permissions) await prisma.permission.upsert({ where:{key}, update:{}, create:{key} });
  const role = await prisma.role.upsert({ where:{name:"SUPER_ADMIN"}, update:{}, create:{name:"SUPER_ADMIN",description:"Unrestricted platform administrator"} });
  const all = await prisma.permission.findMany();
  await prisma.rolePermission.createMany({ data: all.map(permission => ({roleId:role.id,permissionId:permission.id})), skipDuplicates:true });
  const email=process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase(), password=process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (email && password) { const user=await prisma.user.upsert({where:{email},update:{},create:{email,passwordHash:await bcrypt.hash(password,12)}}); await prisma.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},update:{},create:{userId:user.id,roleId:role.id}}); }
  else console.log("Roles and permissions seeded. Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD only for a one-time initial administrator.");
}
main().then(() => seedPhase2(prisma)).finally(() => prisma.$disconnect());
