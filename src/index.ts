import { renderFilter, type FilterNode } from "./filter.js";
import { encodeQuery } from "./encode.js";

export interface BuildConfig {
  /** Percent-encode the result (default: true). */
  encode?: boolean;
}
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
  expand?: ExpandItem[];
}

export type ExpandItem = string | { path: string; options?: QueryOptions };

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

const expand = (items?: ExpandItem[]) =>
  items?.length
    ? `$expand=${items.map(renderExpandItem).join(",")}`
    : undefined;

function renderParts(options: QueryOptions = {}): string[] {
  return [
    top(options.top),
    skip(options.skip),
    count(options.count),
    filter(options.filter),
    select(options.select),
    orderBy(options.orderBy),
    expand(options.expand),
  ].filter((p): p is string => p !== undefined);
}

export function build(
  options: QueryOptions = {},
  config: BuildConfig = {},
): string {
  const { encode = true } = config;
  const query = renderParts(options).join("&");
  if (!query) return "";
  return `?${encode ? encodeQuery(query) : query}`;
}

function renderExpandItem(item: ExpandItem): string {
  if (typeof item === "string") return item;
  const inner = renderParts(item.options).join(";");
  return inner ? `${item.path}(${inner})` : item.path;
}

export type {
  FilterNode,
  FilterValue,
  ComparisonOp,
  FilterFn,
} from "./filter.js";
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
} from "./helpers.js";
