// Matches a whole OData string literal ('' is an escaped quote inside it) or a space.
const TOKEN = /'(?:[^']|'')*'| /g;

export function encodeQuery(query: string): string {
  return query.replace(TOKEN, (match) =>
    match === " " ? "%20" : encodeURIComponent(match),
  );
}
