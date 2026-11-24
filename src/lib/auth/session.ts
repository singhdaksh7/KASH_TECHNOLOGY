import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { randomToken,sha256 } from "./crypto";
export const SESSION_COOKIE="kash_admin_session"; const ttl=1000*60*60*24*7;
export async function createSession(userId:string, request:Request){const raw=randomToken();await prisma.session.create({data:{userId,tokenHash:sha256(raw),expiresAt:new Date(Date.now()+ttl),ipHash:sha256(request.headers.get("x-forwarded-for")||""),userAgent:request.headers.get("user-agent")?.slice(0,500)}});return raw;}
export async function currentSession(){const raw=(await cookies()).get(SESSION_COOKIE)?.value;if(!raw)return null;const session=await prisma.session.findUnique({where:{tokenHash:sha256(raw)},include:{user:{include:{twoFactor:true,roles:{include:{role:{include:{permissions:{include:{permission:true}}}}}}}}}});if(!session||session.expiresAt<new Date()||session.user.deletedAt||session.user.status!=="ACTIVE")return null;await prisma.session.update({where:{id:session.id},data:{lastUsedAt:new Date()}});return session;}
export async function destroySession(){const raw=(await cookies()).get(SESSION_COOKIE)?.value;if(raw)await prisma.session.deleteMany({where:{tokenHash:sha256(raw)}});}
export const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax" as const,path:"/",maxAge:ttl/1000};
