# Rule: unicorn/prefer-optional-catch-binding

## Rule Description

Prefers the optional catch binding `catch {` when the caught error is never used.

## Configuration

```js
{
  // ...
  'unicorn/prefer-optional-catch-binding': 'error',
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
} catch {
  throw new Error('run failed');
}
```
