# Rule: unicode-bom

## Rule Description

Forbids a byte-order mark (BOM) at the start of a file; source files are plain UTF-8 without one.

## Configuration

```js
{
  // ...
  'unicode-bom': [
    'error',
    'never',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The trigger is a byte-order mark at the very start of the file. A fixture snippet is trimmed text inside a markdown code fence, so a BOM cannot survive the markdown and Prettier round trip — and once formatted away, the Bad snippet would silently stop triggering, which is worse than no fixture.
