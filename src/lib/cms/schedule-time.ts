/**
 * Timezone-safe conversion between a wall-clock date/time in an IANA zone and a UTC instant.
 * The database only ever stores UTC instants (Page.publishAt / unpublishAt); zones are a UI concern.
 */
export const DEFAULT_TIMEZONE = "Asia/Kolkata";

export function isValidTimezone(tz: string): boolean {
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); return true; } catch { return false; }
}

/** Offset (zone minus UTC) in ms at the given UTC instant. */
function offsetMs(utcMs: number, tz: string): number {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
    .formatToParts(new Date(utcMs)).filter((x) => x.type !== "literal").map((x) => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(utcMs / 1000) * 1000;
}

/** "2026-12-01" + "09:30" in `tz` → the UTC instant. Throws RangeError on bad input. */
export function zonedToUtc(date: string, time: string, tz: string = DEFAULT_TIMEZONE): Date {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date), t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) throw new RangeError("Expected date YYYY-MM-DD and time HH:mm");
  if (!isValidTimezone(tz)) throw new RangeError(`Unknown timezone "${tz}"`);
  const wall = Date.UTC(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]);
  if (Number.isNaN(wall) || new Date(wall).getUTCDate() !== +d[3] || new Date(wall).getUTCMonth() !== +d[2] - 1 || +t[1] > 23 || +t[2] > 59) throw new RangeError("Invalid date or time");
  let utc = wall - offsetMs(wall, tz);
  utc = wall - offsetMs(utc, tz); // second pass settles DST boundaries
  return new Date(utc);
}

/** UTC instant → wall-clock date/time in `tz`. */
export function utcToZoned(instant: Date, tz: string = DEFAULT_TIMEZONE): { date: string; time: string } {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    .formatToParts(instant).filter((x) => x.type !== "literal").map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
