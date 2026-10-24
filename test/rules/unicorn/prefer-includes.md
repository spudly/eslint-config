# Rule: unicorn/prefer-includes

## Rule Description

Prefers includes over indexOf comparisons for membership tests on arrays and strings.

## Configuration

```js
{
  // ...
  'unicorn/prefer-includes': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const found = items.indexOf(target) !== -1;
```

## Good

```js
const found = items.includes(target);
```
