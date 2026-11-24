import { NextResponse } from "next/server";
import { processScheduledContent, schedulerSecretMatches } from "@/lib/cms/scheduler";

export const dynamic = "force-dynamic";

/** POST /api/internal/scheduler/content — Authorization: Bearer $CMS_SCHEDULER_SECRET. 404 when no secret is configured. */
export async function POST(request: Request) {
  if (!process.env.CMS_SCHEDULER_SECRET) return new NextResponse(null, { status: 404 });
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? request.headers.get("x-scheduler-secret");
  if (!schedulerSecretMatches(provided)) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Invalid scheduler secret" } }, { status: 401 });
  try {
    return NextResponse.json({ success: true, data: await processScheduledContent() });
  } catch (e) {
    console.error("[scheduler]", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Scheduler run failed" } }, { status: 500 });
  }
}
