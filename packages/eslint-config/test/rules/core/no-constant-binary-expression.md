# Rule: no-constant-binary-expression

## Rule Description

Forbids comparisons and logical expressions involving a constant that makes the result predetermined, like comparing against a freshly created object.

## Configuration

```js
{
  // ...
  'no-constant-binary-expression': [
    'error',
    {checkRelationalComparisons: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
export const isEmptyObject = value => value === {};
```

## Good

```js
export const isSame = (value, other) => value === other;
```
