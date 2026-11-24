import { z } from "zod";

/**
 * Conditional form logic. Rules are plain data validated by Zod and evaluated by a fixed set of comparison
 * operators — there is no expression language and no JavaScript is ever executed.
 */
export const FIELD_NAME_RE = /^[A-Za-z][A-Za-z0-9_]{0,59}$/;
export const OPERATORS = ["equals", "not_equals", "contains", "not_contains", "is_empty", "is_not_empty", "greater_than", "less_than"] as const;
export type Operator = (typeof OPERATORS)[number];
const NEEDS_VALUE: Operator[] = ["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than"];

export const conditionSchema = z.object({
  field: z.string().regex(FIELD_NAME_RE),
  operator: z.enum(OPERATORS),
  value: z.union([z.string().max(500), z.number(), z.boolean()]).optional(),
}).strict().refine((c) => !NEEDS_VALUE.includes(c.operator) || c.value !== undefined, { message: "This operator needs a value", path: ["value"] });

export const conditionalRulesSchema = z.object({
  /** show: visible only when the conditions hold · hide: hidden when they hold · require: required when they hold. */
  action: z.enum(["show", "hide", "require"]),
  match: z.enum(["all", "any"]).default("all"),
  conditions: z.array(conditionSchema).min(1).max(10),
}).strict();
export type ConditionalRules = z.infer<typeof conditionalRulesSchema>;

const asString = (v: unknown) => (v === undefined || v === null ? "" : Array.isArray(v) ? v.join(",") : String(v));
const isEmpty = (v: unknown) => v === undefined || v === null || v === "" || v === false || (Array.isArray(v) && v.length === 0);

export function evaluateCondition(c: z.infer<typeof conditionSchema>, values: Record<string, unknown>): boolean {
  const v = values[c.field];
  switch (c.operator) {
    case "equals": return asString(v) === asString(c.value);
    case "not_equals": return asString(v) !== asString(c.value);
    case "contains": return asString(v).toLowerCase().includes(asString(c.value).toLowerCase());
    case "not_contains": return !asString(v).toLowerCase().includes(asString(c.value).toLowerCase());
    case "is_empty": return isEmpty(v);
    case "is_not_empty": return !isEmpty(v);
    case "greater_than": return Number(v) > Number(c.value) && !isEmpty(v);
    case "less_than": return Number(v) < Number(c.value) && !isEmpty(v);
  }
}
export const rulesMatch = (r: ConditionalRules, values: Record<string, unknown>) =>
  r.match === "any" ? r.conditions.some((c) => evaluateCondition(c, values)) : r.conditions.every((c) => evaluateCondition(c, values));

export interface FieldDef { name: string; type: string; required: boolean; step?: number; options?: unknown; conditionalRules?: unknown }

/** Validates cross-field rules: references exist, no self-reference, no cycles, rules only point at earlier-resolvable fields. */
export function validateFieldRules(fields: Array<Pick<FieldDef, "name" | "conditionalRules">>): string[] {
  const errors: string[] = [];
  const names = new Set(fields.map((f) => f.name));
  const deps = new Map<string, string[]>();
  for (const f of fields) {
    if (f.conditionalRules == null) continue;
    const parsed = conditionalRulesSchema.safeParse(f.conditionalRules);
    if (!parsed.success) { errors.push(`Field "${f.name}": ${parsed.error.issues.map((i) => i.message).join("; ")}`); continue; }
    const refs = parsed.data.conditions.map((c) => c.field);
    for (const r of refs) {
      if (r === f.name) errors.push(`Field "${f.name}" cannot depend on itself`);
      else if (!names.has(r)) errors.push(`Field "${f.name}" depends on unknown field "${r}"`);
    }
    deps.set(f.name, refs.filter((r) => names.has(r) && r !== f.name));
  }
  const state = new Map<string, 1 | 2>();
  const visit = (n: string, trail: string[]): void => {
    if (state.get(n) === 2) return;
    if (state.get(n) === 1) { errors.push(`Circular rule dependency: ${[...trail, n].join(" → ")}`); return; }
    state.set(n, 1);
    for (const d of deps.get(n) ?? []) visit(d, [...trail, n]);
    state.set(n, 2);
  };
  for (const n of deps.keys()) visit(n, []);
  return [...new Set(errors)];
}

/** Dependency-first ordering so each field is evaluated after the fields its rules read. */
export function evaluationOrder<T extends { name: string; conditionalRules?: unknown }>(fields: T[]): T[] {
  const by = new Map(fields.map((f) => [f.name, f]));
  const out: T[] = [], seen = new Set<string>();
  const visit = (f: T, depth: number) => {
    if (seen.has(f.name) || depth > fields.length) return;
    seen.add(f.name);
    const parsed = f.conditionalRules ? conditionalRulesSchema.safeParse(f.conditionalRules) : null;
    for (const c of parsed?.success ? parsed.data.conditions : []) { const d = by.get(c.field); if (d) visit(d, depth + 1); }
    out.push(f);
  };
  fields.forEach((f) => visit(f, 0));
  return out;
}

export function fieldState(rules: unknown, values: Record<string, unknown>): { visible: boolean; requiredByRule: boolean } {
  const parsed = rules ? conditionalRulesSchema.safeParse(rules) : null;
  if (!parsed?.success) return { visible: true, requiredByRule: false };
  const hit = rulesMatch(parsed.data, values);
  return { visible: parsed.data.action === "show" ? hit : parsed.data.action === "hide" ? !hit : true, requiredByRule: parsed.data.action === "require" && hit };
}
