import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requirePermission } from "@/lib/rbac/permissions";
import { fail } from "@/lib/server/http";

type Session = NonNullable<Awaited<ReturnType<typeof requirePermission>>["session"]>;
export interface AdminCtx<P> {
  request: Request;
  session: Session;
  params: P;
}

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

function mapError(e: unknown) {
  if (e instanceof HttpError) return fail(e.code, e.message, e.status, e.details);
  if (e instanceof z.ZodError) return fail("VALIDATION_ERROR", "Invalid request", 400, e.flatten());
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return fail("CONFLICT", "A record with these unique values already exists", 409);
    if (e.code === "P2025") return fail("NOT_FOUND", "Record not found", 404);
  }
  console.error("[admin-api]", e instanceof Error ? e.message : e);
  return fail("INTERNAL_ERROR", "Unexpected server error", 500);
}

/** Wraps an admin route: authentication, 2FA enforcement, same-origin check, RBAC permission, uniform errors. */
export function admin<P = Record<string, string>>(permission: string | null, handler: (ctx: AdminCtx<P>) => Promise<Response>) {
  return async (request: Request, context?: { params: Promise<P> }) => {
    const a = await requirePermission(permission, { request });
    if (a.error) return a.error;
    try {
      return await handler({ request, session: a.session, params: (await context?.params) as P });
    } catch (e) {
      return mapError(e);
    }
  };
}

export async function body<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  const raw = await request.json().catch(() => null);
  return schema.parse(raw);
}

/** Refresh the public site after a content change (ISR pages, header/footer in the root layout, sitemap). */
export function refreshPublicSite() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
  } catch {
    /* outside a request context (tests/scripts) */
  }
}
