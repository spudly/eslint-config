# Rule: no-unsafe-finally

## Rule Description

Forbids return, throw, break, and continue inside finally, where they swallow the original error or result.

## Configuration

```js
{
  // ...
  'no-unsafe-finally': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function read() {
  try {
    return load();
  } finally {
    return fallback;
  }
}
```

## Good

```js
function read() {
  try {
    return load();
  } finally {
    cleanup();
  }
}
```
