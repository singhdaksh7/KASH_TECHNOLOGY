import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { getEmailConfig } from "@/lib/email/provider";

/** Whether outbound email is live (never exposes any value). Leads are saved either way. */
export const GET = admin(null, async () => ok({ configured: (await getEmailConfig()).enabled }));
