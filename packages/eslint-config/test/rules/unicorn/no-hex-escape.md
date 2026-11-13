# Rule: unicorn/no-hex-escape

## Rule Description

Forbids \x hex escapes in strings in favor of \u escapes, which are unambiguous about code points.

## Configuration

```js
{
  // ...
  'unicorn/no-hex-escape': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const letter = '\x41';
```

## Good

```js
const letter = '\u0041';
```
