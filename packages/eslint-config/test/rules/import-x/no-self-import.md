# Rule: import-x/no-self-import

## Rule Description

Forbids a module importing itself, which is always a mistake: the import resolves to the module's own partially initialized exports.

## Configuration

```js
{
  // ...
  'import-x/no-self-import': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The rule fires when a file imports itself, which requires the linter to know the importing file's real path on disk and resolve the import back to it. Snippets are linted as virtual text (lintText), so the importing file has no resolvable identity to import.
