# Rule: no-undef-init

## Rule Description

Forbids initializing a variable to undefined explicitly, since that is the default.

## Configuration

```js
{
  // ...
  'no-undef-init': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
let current = undefined;
```

## Good

```js
let current;
```
