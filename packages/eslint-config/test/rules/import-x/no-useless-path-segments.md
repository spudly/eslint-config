# Rule: import-x/no-useless-path-segments

## Rule Description

Forbids redundant segments in import paths (needless ./ and ../ hops, explicit index files) that the resolver can reach more directly.

## Configuration

```js
{
  // ...
  'import-x/no-useless-path-segments': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The rule simplifies import paths by resolving them against the real filesystem around the importing file — collapsing ./ and ../ segments and dropping redundant index files. Snippets have no real location on disk, so those resolutions cannot be evaluated honestly.
