# Rule: no-promise-executor-return

## Rule Description

Forbids returning a value from a promise executor, where the return is silently ignored and usually signals a bug.

## Configuration

```js
{
  // ...
  'no-promise-executor-return': [
    'error',
    {allowVoid: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const task = new Promise(resolve => {
  return resolve(1);
});
```

## Good

```js
const task = new Promise(resolve => {
  resolve(1);
});
```
