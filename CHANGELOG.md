# Changelog

## [0.1.0] - 2026-09-19

### Added

- `build()` with `$top`, `$skip`, `$count`, `$select`, `$orderby`, `$filter`, `$expand` (nested)
- Filter helpers: `eq`, `ne`, `gt`, `ge`, `lt`, `le`, `contains`, `startsWith`, `endsWith`, `and`, `or`, `not`
- Percent-encoding by default (`{ encode: false }` to disable)
