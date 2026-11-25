import { prisma } from "@/lib/db/prisma";

/**
 * Admin-editable transactional email templates.
 *
 * Merge syntax is deliberately tiny: `{{ variableName }}` and nothing else. Every variable must be on the
 * template's allow-list; there are no expressions, helpers, conditionals or property access, so a template
 * can never execute code or read data it was not explicitly handed.
 */
import { EMAIL_TEMPLATE_DEFS, TEMPLATE_DEF_BY_KEY, isLegacyDefault } from "./template-defs";
export { EMAIL_TEMPLATE_DEFS, TEMPLATE_DEF_BY_KEY };
export type { TemplateDef } from "./template-defs";

const TOKEN = /\{\{\s*([A-Za-z][A-Za-z0-9_]*)\s*\}\}/g;

/** Variables referenced by `source` (valid tokens only). */
export const referencedVariables = (source: string) => [...new Set([...source.matchAll(TOKEN)].map((m) => m[1]))];

/** Returns human-readable problems; empty array means the template is safe to store. */
export function validateTemplateText(text: string, allowed: string[]): string[] {
  const problems: string[] = [];
  for (const v of referencedVariables(text)) if (!allowed.includes(v)) problems.push(`Variable "${v}" is not allowed`);
  // Whatever is left after removing valid tokens must not contain merge/expression syntax.
  if (/\{\{|\}\}/.test(text.replace(TOKEN, ""))) problems.push("Only simple {{variableName}} placeholders are supported");
  return problems;
}

export class TemplateError extends Error {}

/** Renders `source`, substituting only allow-listed variables. Throws TemplateError on anything else. */
export function renderTemplate(source: string, vars: Record<string, unknown>, allowed: string[], opts: { singleLine?: boolean } = {}): string {
  const problems = validateTemplateText(source, allowed);
  if (problems.length) throw new TemplateError(problems.join("; "));
  return source.replace(TOKEN, (_m, name: string) => {
    let v = vars[name] == null ? "" : String(vars[name]).slice(0, 5000);
    if (opts.singleLine) v = v.replace(/[\r\n]+/g, " "); // no header injection through subjects
    return v;
  });
}

export interface ResolvedTemplate { key: string; subject: string; body: string; variables: string[]; source: "database" | "default" }

/** The stored template when present and enabled; otherwise the built-in default. Never throws for a known key. */
export async function resolveTemplate(key: string): Promise<ResolvedTemplate> {
  const def = TEMPLATE_DEF_BY_KEY.get(key);
  if (!def) throw new TemplateError(`Unknown email template "${key}"`);
  const row = await prisma.emailTemplate.findUnique({ where: { key } }).catch(() => null);
  if (row?.enabled && !isLegacyDefault(key, row) && !validateTemplateText(row.subject, def.variables).length && !validateTemplateText(row.body, def.variables).length) {
    return { key, subject: row.subject, body: row.body, variables: def.variables, source: "database" };
  }
  return { key, subject: def.subject, body: def.body, variables: def.variables, source: "default" };
}

export async function renderEmail(key: string, vars: Record<string, unknown>) {
  const t = await resolveTemplate(key);
  return { subject: renderTemplate(t.subject, vars, t.variables, { singleLine: true }), text: renderTemplate(t.body, vars, t.variables), source: t.source };
}
