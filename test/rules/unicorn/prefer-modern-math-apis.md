# Rule: unicorn/prefer-modern-math-apis

## Rule Description

Prefers Math.log2/log10/sign and friends over dividing by Math.LN2-style constants or hand-rolled equivalents.

## Configuration

```js
{
  // ...
  'unicorn/prefer-modern-math-apis': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const bits = Math.log(size) / Math.LN2;
```

## Good

```js
const bits = Math.log2(size);
```
