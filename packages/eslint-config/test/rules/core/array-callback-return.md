# Rule: array-callback-return

## Rule Description

Requires array callbacks like map/filter to return a value on every code path, so a missing return cannot silently produce undefined entries.

## Configuration

```js
{
  // ...
  'array-callback-return': [
    'error',
    {allowImplicit: false, checkForEach: false, allowVoid: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const doubled = [1, 2].map(value => {
  if (value > 1) {
    return value * 2;
  }
});
```

## Good

```js
const doubled = [1, 2].map(value => {
  if (value > 1) {
    return value * 2;
  }
  return value;
});
```
