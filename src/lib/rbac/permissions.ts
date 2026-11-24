import { currentSession } from "@/lib/auth/session";
import { fail } from "@/lib/server/http";
export async function requirePermission(permission:string){const session=await currentSession();if(!session)return {error:fail("UNAUTHENTICATED","Authentication required",401)};const roles=session.user.roles.map(x=>x.role);const allowed=roles.some(r=>r.name==="SUPER_ADMIN"||r.permissions.some(x=>x.permission.key===permission));if(!allowed)return {error:fail("FORBIDDEN","Insufficient permission",403)};return {session};}
