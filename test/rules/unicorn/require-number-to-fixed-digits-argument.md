# Rule: unicorn/require-number-to-fixed-digits-argument

## Rule Description

Requires an explicit digits argument for Number#toFixed, so rounding precision is a decision, not a default.

## Configuration

```js
{
  // ...
  'unicorn/require-number-to-fixed-digits-argument': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = price.toFixed();
```

## Good

```js
const label = price.toFixed(2);
```
