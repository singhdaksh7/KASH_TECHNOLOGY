import { z } from "zod";
import { ok, fail, requestIp } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { saveSubmission } from "@/lib/forms/submissions";

const bodySchema = z.record(z.string(), z.unknown());

/** Public form endpoint: rate limit → honeypot → validate against the form definition → persist (Lead + FormSubmission) → email. */
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!rateLimit(`form:${requestIp(request)}`, 6, 10 * 60_000)) return fail("RATE_LIMITED", "Please wait before submitting again.", 429);
  const raw = await request.json().catch(() => null);
  const body = bodySchema.safeParse(raw);
  if (!body.success || JSON.stringify(raw).length > 60_000) return fail("VALIDATION_ERROR", "Invalid form payload", 400);
  if (body.data.honeypot) return ok({ accepted: true }); // silent success for bots
  const { slug } = await params;
  try {
    const result = await saveSubmission(slug, body.data, request);
    return ok({ accepted: true, emailStatus: result.submission.emailStatus, successMessage: result.successMessage, successRedirectUrl: result.successRedirectUrl }, 201);
  } catch (e) {
    const m = e instanceof Error ? e.message : "Submission failed";
    if (m === "FORM_NOT_FOUND") return fail("NOT_FOUND", "Form not found", 404);
    if (m.startsWith("REQUIRED") || m.startsWith("INVALID")) return fail("VALIDATION_ERROR", m.replace(/^[A-Z]+:/, "Check field: "), 400);
    console.error("[forms] submission error", m);
    return fail("INTERNAL_ERROR", "We could not save your submission. Please try again or email us.", 500);
  }
}
