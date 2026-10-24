# Rule: no-extra-bind

## Rule Description

Forbids .bind() on functions that never use this, where the bind is dead weight.

## Configuration

```js
{
  // ...
  'no-extra-bind': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const getOne = function () {
  return 1;
}.bind(context);
```

## Good

```js
const getOne = () => 1;
```
