# Rule: no-async-promise-executor

## Rule Description

Forbids async promise executors: a rejected async executor is swallowed instead of rejecting the promise.

## Configuration

```js
{
  // ...
  'no-async-promise-executor': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const task = new Promise(async resolve => {
  resolve(1);
});
```

## Good

```js
const task = new Promise(resolve => {
  resolve(1);
});
```
