# Rule: unicorn/prefer-math-min-max

## Rule Description

Prefers Math.min/Math.max over a ternary that picks the smaller or larger of two values.

## Configuration

```js
{
  // ...
  'unicorn/prefer-math-min-max': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const smaller = first < second ? first : second;
```

## Good

```js
const smaller = Math.min(first, second);
```
