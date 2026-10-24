# Rule: no-delete-var

## Rule Description

Forbids delete on a variable; delete only works meaningfully on object properties.

## Configuration

```js
{
  // ...
  'no-delete-var': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.cjs

## Bad

```js
let cache = 1;
delete cache;
```

## Good

```js
const cache = {entry: 1};
delete cache.entry;
```
