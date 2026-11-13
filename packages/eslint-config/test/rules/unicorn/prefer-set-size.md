# Rule: unicorn/prefer-set-size

## Rule Description

Prefers Set#size over spreading a set into an array just to read its length.

## Configuration

```js
{
  // ...
  'unicorn/prefer-set-size': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const seen = new Set(['a', 'b']);
const count = [...seen].length;
```

## Good

```js
const seen = new Set(['a', 'b']);
const count = seen.size;
```
