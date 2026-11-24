import { destroySession,SESSION_COOKIE,cookieOptions } from "@/lib/auth/session"; import { ok } from "@/lib/server/http"; import { cookies } from "next/headers";
export async function POST(){await destroySession();(await cookies()).set(SESSION_COOKIE,"",{...cookieOptions,maxAge:0});return ok({loggedOut:true});}
