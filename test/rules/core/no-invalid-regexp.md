# Rule: no-invalid-regexp

## Rule Description

Forbids invalid regular expressions passed to the RegExp constructor, which would throw at runtime.

## Configuration

```js
{
  // ...
  'no-invalid-regexp': [
    'error',
    {},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = new RegExp('[');
```

## Good

```js
const pattern = new RegExp('\\[');
```
