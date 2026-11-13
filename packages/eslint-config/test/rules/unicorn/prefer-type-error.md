# Rule: unicorn/prefer-type-error

## Rule Description

Requires TypeError (not a generic Error) when throwing in response to a failed type check, so callers can distinguish programming errors.

## Configuration

```js
{
  // ...
  'unicorn/prefer-type-error': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function assertText(value) {
  if (typeof value !== 'string') {
    throw new Error('value must be a string');
  }
}
```

## Good

```js
function assertText(value) {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }
}
```
