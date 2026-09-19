import type {
  ComparisonOp,
  FilterFn,
  FilterNode,
  FilterValue,
} from "./filter.js";

const cmp =
  (op: ComparisonOp) =>
  (field: string, value: FilterValue): FilterNode => ({
    type: "comparison",
    field,
    op,
    value,
  });

export const eq = cmp("eq");
export const ne = cmp("ne");
export const gt = cmp("gt");
export const ge = cmp("ge");
export const lt = cmp("lt");
export const le = cmp("le");

const fn =
  (name: FilterFn) =>
  (field: string, value: string): FilterNode => ({
    type: "function",
    name,
    field,
    value,
  });

export const contains = fn("contains");
export const startsWith = fn("startswith");
export const endsWith = fn("endswith");

export const and = (...conditions: FilterNode[]): FilterNode => ({
  type: "group",
  op: "and",
  conditions,
});

export const or = (...conditions: FilterNode[]): FilterNode => ({
  type: "group",
  op: "or",
  conditions,
});

export const not = (condition: FilterNode): FilterNode => ({
  type: "not",
  condition,
});
