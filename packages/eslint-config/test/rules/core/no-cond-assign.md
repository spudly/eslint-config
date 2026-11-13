# Rule: no-cond-assign

## Rule Description

Forbids assignment inside a condition, where it is easy to mistake for a comparison.

## Configuration

```js
{
  // ...
  'no-cond-assign': [
    'error',
    'except-parens',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

<!-- prettier-ignore -->
```js
let current;
if (current = next()) {
  use(current);
}
```

## Good

<!-- prettier-ignore -->
```js
let current;
if (current === next()) {
  use(current);
}
```
