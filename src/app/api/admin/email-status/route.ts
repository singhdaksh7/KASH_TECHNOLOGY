import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";

/** Whether outbound email can be sent from this server (never exposes any value). Leads are saved either way. */
export const GET = admin(null, async () => ok({
  configured: !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.CONTACT_RECEIVER_EMAIL),
}));
