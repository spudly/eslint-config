# Rule: unicorn/prefer-negative-index

## Rule Description

Prefers negative indexes in slice/splice-style calls over length arithmetic.

## Configuration

```js
{
  // ...
  'unicorn/prefer-negative-index': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const tail = items.slice(items.length - 1);
```

## Good

```js
const tail = items.slice(-1);
```
