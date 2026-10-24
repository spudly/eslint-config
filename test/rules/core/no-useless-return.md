# Rule: no-useless-return

## Rule Description

Forbids a bare return at the end of a function, where it changes nothing.

## Configuration

```js
{
  // ...
  'no-useless-return': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function finish() {
  save();
  return;
}
```

## Good

```js
function finish() {
  save();
}
```
