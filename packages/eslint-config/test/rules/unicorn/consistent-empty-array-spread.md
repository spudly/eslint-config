# Rule: unicorn/consistent-empty-array-spread

## Rule Description

Requires the empty fallback in a ternary array spread to match the other branch's type: an empty array when the other side is an array, an empty string when it is a string — never a mismatched placeholder.

## Configuration

```js
{
  // ...
  'unicorn/consistent-empty-array-spread': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const combined = [...(ready ? ['a'] : '')];
```

## Good

```js
const combined = [...(ready ? ['a'] : [])];
```
