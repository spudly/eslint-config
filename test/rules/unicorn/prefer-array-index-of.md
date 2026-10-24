# Rule: unicorn/prefer-array-index-of

## Rule Description

Prefers Array#indexOf over findIndex with a plain equality callback, which says membership directly.

## Configuration

```js
{
  // ...
  'unicorn/prefer-array-index-of': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const position = items.findIndex(item => item === target);
```

## Good

```js
const position = items.indexOf(target);
```
