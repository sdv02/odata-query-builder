import { renderFilter, type FilterNode } from "./filter";

export type OrderByItem =
  | string
  | { field: string; direction?: "asc" | "desc" };

export interface QueryOptions {
  top?: number;
  skip?: number;
  count?: boolean;
  select?: string[];
  orderBy?: OrderByItem[];
  filter?: FilterNode;
}

const top = (n?: number) => (n === undefined ? undefined : `$top=${n}`);
const skip = (n?: number) => (n === undefined ? undefined : `$skip=${n}`);
const count = (b?: boolean) => (b === undefined ? undefined : `$count=${b}`);

const select = (fields?: string[]) =>
  fields && fields.length ? `$select=${fields.join(",")}` : undefined;

const orderBy = (items?: OrderByItem[]) => {
  if (!items || !items.length) return undefined;
  const parts = items.map((item) =>
    typeof item === "string"
      ? item
      : item.direction
        ? `${item.field} ${item.direction}`
        : item.field,
  );
  return `$orderby=${parts.join(",")}`;
};

const filter = (node?: FilterNode) =>
  node === undefined ? undefined : `$filter=${renderFilter(node)}`;

export function build(options: QueryOptions = {}): string {
  const parts = [
    top(options.top),
    skip(options.skip),
    count(options.count),
    select(options.select),
    orderBy(options.orderBy),
    filter(options.filter),
  ].filter((p): p is string => p !== undefined);

  return parts.length ? `?${parts.join("&")}` : "";
}

export type { FilterNode, FilterValue, ComparisonOp, FilterFn } from "./filter";
export {
  eq,
  ne,
  gt,
  ge,
  lt,
  le,
  contains,
  startsWith,
  endsWith,
  and,
  or,
  not,
} from "./helpers";
