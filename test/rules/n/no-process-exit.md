# Rule: n/no-process-exit

## Rule Description

Forbids process.exit in library and app code; throwing lets callers and test runners decide how a failure ends the process.

## Configuration

```js
{
  // ...
  'n/no-process-exit': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.js

## Bad

```js
export function bail() {
  process.exit(1);
}
```

## Good

```js
export function bail() {
  throw new Error('bail');
}
```
