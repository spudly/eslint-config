# Rule: no-useless-catch

## Rule Description

Forbids catch blocks that only rethrow the caught error, which add noise without changing behavior.

## Configuration

```js
{
  // ...
  'no-useless-catch': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
try {
  run();
} catch (error) {
  throw error;
}
```

## Good

```js
try {
  run();
} catch (error) {
  throw new Error('run failed', {cause: error});
}
```
