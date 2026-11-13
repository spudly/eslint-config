# Rule: no-prototype-builtins

## Rule Description

Forbids calling Object.prototype methods like hasOwnProperty directly on an object, which breaks on objects that shadow or lack them.

## Configuration

```js
{
  // ...
  'no-prototype-builtins': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const has = record.hasOwnProperty('id');
```

## Good

```js
const has = Object.prototype.hasOwnProperty.call(record, 'id');
```
