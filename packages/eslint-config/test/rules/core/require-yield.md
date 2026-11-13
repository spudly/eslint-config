# Rule: require-yield

## Rule Description

Forbids generator functions that never yield, which are just confusing regular functions.

## Configuration

```js
{
  // ...
  'require-yield': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function* ids() {
  return 1;
}
```

## Good

```js
function* ids() {
  yield 1;
}
```
