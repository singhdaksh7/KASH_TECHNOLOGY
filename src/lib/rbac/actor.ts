import { HttpError } from "@/lib/server/api";

/** What a service needs to know about the caller. Built once per request from the session. */
export interface Actor {
  id: string;
  permissions: ReadonlySet<string>;
  isSuper: boolean;
}

interface SessionLike {
  userId: string;
  user: { roles: Array<{ role: { name: string; permissions: Array<{ permission: { key: string } }> } }> };
}

export function actorFromSession(session: SessionLike): Actor {
  const roles = session.user.roles.map((r) => r.role);
  return {
    id: session.userId,
    isSuper: roles.some((r) => r.name === "SUPER_ADMIN"),
    permissions: new Set(roles.flatMap((r) => r.permissions.map((p) => p.permission.key))),
  };
}

export const can = (actor: Actor, permission: string) => actor.isSuper || actor.permissions.has(permission);
export const canAny = (actor: Actor, permissions: string[]) => permissions.some((p) => can(actor, p));

/** Throws 403 unless the actor holds at least one of the permissions. */
export function assertCan(actor: Actor, ...permissions: string[]) {
  if (!canAny(actor, permissions)) throw new HttpError(403, "FORBIDDEN", "Insufficient permission", { required: permissions });
}
