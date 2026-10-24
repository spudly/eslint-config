# Rule: no-shadow-restricted-names

## Rule Description

Forbids declaring bindings named undefined, NaN, Infinity, eval, or arguments, which shadows values other code relies on.

## Configuration

```js
{
  // ...
  'no-shadow-restricted-names': [
    'error',
    {reportGlobalThis: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const undefined = computeDefault();
```

## Good

```js
const fallback = computeDefault();
```
