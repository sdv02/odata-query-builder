export type FilterValue = string | number | boolean | null | Date;

export type ComparisonOp = "eq" | "ne" | "gt" | "ge" | "lt" | "le";
export type FilterFn = "contains" | "startswith" | "endswith";

export type FilterNode =
  | { type: "comparison"; field: string; op: ComparisonOp; value: FilterValue }
  | { type: "function"; name: FilterFn; field: string; value: string }
  | { type: "group"; op: "and" | "or"; conditions: FilterNode[] }
  | { type: "not"; condition: FilterNode };

export function formatValue(value: FilterValue): string {
  if (value === null) return "null";
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new Error("Invalid Date");
    return value.toISOString();
  }
  switch (typeof value) {
    case "string":
      return `'${value.replace(/'/g, "''")}'`;
    case "number":
      if (!Number.isFinite(value)) throw new Error(`Invalid number: ${value}`);
      return String(value);
    case "boolean":
      return String(value);
  }
}

export function renderFilter(node: FilterNode): string {
  switch (node.type) {
    case "comparison":
      return `${node.field} ${node.op} ${formatValue(node.value)}`;

    case "function":
      return `${node.name}(${node.field},${formatValue(node.value)})`;

    case "not":
      return `not (${renderFilter(node.condition)})`;

    case "group": {
      if (node.conditions.length === 0) {
        throw new Error("Filter group must contain at least one condition");
      }
      const parts = node.conditions.map((child) => {
        const text = renderFilter(child);
        const needsParens = child.type === "group" && child.op !== node.op;
        return needsParens ? `(${text})` : text;
      });
      return parts.join(` ${node.op} `);
    }
  }
}
