# Rule: preserve-caught-error

## Rule Description

Requires errors thrown from a catch block to preserve the caught error as their cause, so the original failure is not lost.

## Configuration

```js
{
  // ...
  'preserve-caught-error': [
    'error',
    {requireCatchParameter: false, errorClassNames: []},
  ],
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
  throw new Error('run failed');
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
