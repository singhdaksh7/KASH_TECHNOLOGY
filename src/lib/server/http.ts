import { NextResponse } from "next/server";

export const ok = <T>(data: T, status = 200, requestId?: string) => {
  const headers: Record<string, string> = {};
  if (requestId) headers["x-request-id"] = requestId;
  return NextResponse.json({ success: true, data }, { status, headers });
};

export const fail = (code: string, message: string, status = 400, details?: unknown, requestId?: string) => {
  const headers: Record<string, string> = {};
  if (requestId) headers["x-request-id"] = requestId;
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
        requestId,
      },
    },
    { status, headers }
  );
};

export const requestIp = (r: Request) =>
  r.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || r.headers.get("x-real-ip") || "unknown";

export const hash = (value: string) => {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return String(h);
};
