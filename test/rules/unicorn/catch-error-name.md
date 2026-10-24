# Rule: unicorn/catch-error-name

## Rule Description

Requires caught errors to be named `error`, so catch blocks read consistently across the codebase.

## Configuration

```js
{
  // ...
  'unicorn/catch-error-name': [
    'error',
    {name: 'error', ignore: []},
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
} catch (err) {
  handle(err);
}
```

## Good

```js
try {
  run();
} catch (error) {
  handle(error);
}
```
