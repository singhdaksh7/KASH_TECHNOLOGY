/** Minimal RFC 4180 CSV reader/writer with spreadsheet-formula-injection protection. */

export const MAX_CSV_BYTES = 2_000_000;
export const MAX_CSV_ROWS = 2000;

/** Cells that spreadsheets would evaluate as formulas. Plain numbers / phone numbers (digits only after the sign) are fine. */
const TRIGGER = /^[=+\-@\t\r]/;
const NUMBER_LIKE = /^[+-]?\d[\d\s().-]*$/;
export const isFormulaLike = (s: string) => TRIGGER.test(s) && !NUMBER_LIKE.test(s);

/** Export-side protection: prefix a single quote so Excel/Sheets show the text instead of evaluating it. */
export const neutralizeFormula = (s: string) => (isFormulaLike(s) ? `'${s}` : s);
/** Import-side: undo our own export protection so a round-trip is lossless. */
export const restoreExported = (s: string) => (s.startsWith("'") && isFormulaLike(s.slice(1)) ? s.slice(1) : s);

export function parseCsv(input: string): string[][] {
  if (Buffer.byteLength(input) > MAX_CSV_BYTES) throw new Error(`CSV is larger than ${MAX_CSV_BYTES / 1_000_000} MB`);
  const text = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; } else cell += c;
    } else if (c === '"' && cell === "") quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x !== "") || row.length > 1) rows.push(row);
      row = [];
      if (rows.length > MAX_CSV_ROWS + 1) throw new Error(`CSV has more than ${MAX_CSV_ROWS} rows`);
    } else cell += c;
  }
  if (quoted) throw new Error("CSV has an unterminated quoted field");
  if (cell !== "" || row.length) { row.push(cell); if (row.some((x) => x !== "")) rows.push(row); }
  return rows;
}

/** Rows → objects keyed by the (lower-cased, trimmed) header row. */
export function csvToObjects(input: string): Array<Record<string, string>> {
  const [head, ...body] = parseCsv(input);
  if (!head) return [];
  const keys = head.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ""])));
}

export type CsvCell = string | number | boolean | Date | null | undefined;
const cellText = (v: CsvCell): string => {
  if (v == null) return "";
  if (typeof v === "number" || typeof v === "boolean") return String(v); // typed numbers cannot be formulas
  return neutralizeFormula(v instanceof Date ? v.toISOString() : String(v));
};
const quote = (s: string) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export const toCsv = (header: string[], rows: CsvCell[][]) => [header, ...rows.map((r) => r.map(cellText))].map((r) => r.map((c) => quote(c)).join(",")).join("\r\n") + "\r\n";
