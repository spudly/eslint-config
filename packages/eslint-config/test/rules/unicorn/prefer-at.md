# Rule: unicorn/prefer-at

## Rule Description

Prefers .at(-1) style indexing over length arithmetic for reading elements from the end of an array or string.

## Configuration

```js
{
  // ...
  'unicorn/prefer-at': [
    'error',
    {getLastElementFunctions: [], checkAllIndexAccess: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const last = items[items.length - 1];
```

## Good

```js
const last = items.at(-1);
```
