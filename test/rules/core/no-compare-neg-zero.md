# Rule: no-compare-neg-zero

## Rule Description

Forbids comparing against -0 with === or !==, which cannot distinguish -0 from 0; use Object.is instead.

## Configuration

```js
{
  // ...
  'no-compare-neg-zero': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const isNegativeZero = value === -0;
```

## Good

```js
const isNegativeZero = Object.is(value, -0);
```
