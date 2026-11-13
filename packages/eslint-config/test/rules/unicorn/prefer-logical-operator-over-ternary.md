# Rule: unicorn/prefer-logical-operator-over-ternary

## Rule Description

Prefers a logical operator over a ternary that just falls back when the condition value is falsy.

## Configuration

```js
{
  // ...
  'unicorn/prefer-logical-operator-over-ternary': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = name ? name : 'anonymous';
```

## Good

```js
const label = name || 'anonymous';
```
