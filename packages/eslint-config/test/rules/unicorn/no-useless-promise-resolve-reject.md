# Rule: unicorn/no-useless-promise-resolve-reject

## Rule Description

Forbids returning Promise.resolve/Promise.reject from async functions and promise executors, where return and throw already do the job.

## Configuration

```js
{
  // ...
  'unicorn/no-useless-promise-resolve-reject': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
async function load() {
  return Promise.resolve(42);
}
```

## Good

```js
async function load() {
  return 42;
}
```
