# Rule: no-unsafe-negation

## Rule Description

Forbids negating the left side of in/instanceof without parentheses, which parses as negating the operand instead of the whole check.

## Configuration

```js
{
  // ...
  'no-unsafe-negation': [
    'error',
    {enforceForOrderingRelations: false},
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
if (!key in record) {
  run();
}
```

## Good

<!-- prettier-ignore -->
```js
if (!(key in record)) {
  run();
}
```
