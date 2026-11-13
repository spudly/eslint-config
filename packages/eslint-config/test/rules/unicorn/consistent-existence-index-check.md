# Rule: unicorn/consistent-existence-index-check

## Rule Description

Requires indexOf existence checks to be written as `!== -1` / `=== -1`, not `>= 0` style comparisons, so the intent is uniform.

## Configuration

```js
{
  // ...
  'unicorn/consistent-existence-index-check': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const position = items.indexOf(target);
const found = position >= 0;
```

## Good

```js
const position = items.indexOf(target);
const found = position !== -1;
```
