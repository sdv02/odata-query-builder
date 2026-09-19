export interface QueryOptions {
  top?: number;
}

export function build(options: QueryOptions = {}): string {
  const parts: string[] = [];
  if (options.top !== undefined) parts.push(`$top=${options.top}`);
  return parts.length ? `?${parts.join("&")}` : "";
}
