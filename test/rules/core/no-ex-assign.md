# Rule: no-ex-assign

## Rule Description

Forbids reassigning the caught error in a catch block, which destroys the original failure.

## Configuration

```js
{
  // ...
  'no-ex-assign': 'error',
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
  error = new Error('wrapped');
  throw error;
}
```

## Good

```js
try {
  run();
} catch (error) {
  throw new Error('wrapped', {cause: error});
}
```
