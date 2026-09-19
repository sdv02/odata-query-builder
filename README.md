# odata-query-builder

Build OData v4 query strings without hand-concatenating them.

```ts
import { build, and, gt, contains } from "odata-build-query";

const query = build({
  filter: and(gt("Age", 18), contains("Name", "ob")),
  select: ["Id", "Name"],
  top: 10,
});
// ?$top=10&$filter=Age%20gt%2018%20and%20contains(Name,'ob')&$select=Id,Name
```

## Install

```bash
npm install odata-build-query
```

ESM only. Ships with TypeScript types.

## Supported

`$top`, `$skip`, `$count`, `$select`, `$orderby`, `$filter` (comparisons, `and` / `or` / `not`,
`contains` / `startswith` / `endswith`), `$expand` (including nested options).

## Encoding

The result is percent-encoded by default and ready to append to a URL:
`fetch(baseUrl + query)`. Pass `{ encode: false }` as the second argument for readable output.
Don't pass the result as a value to `URLSearchParams` or an axios `params` object; it would be encoded twice.

## Not supported yet

`$search`, `$apply`, `$levels`, `$ref`, lambda operators (`any` / `all`), arithmetic and date functions.
