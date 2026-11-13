# Rule: unicorn/prefer-prototype-methods

## Rule Description

Requires borrowing prototype methods from the prototype itself (Object.prototype.hasOwnProperty) rather than through an instance or object literal.

## Configuration

```js
{
  // ...
  'unicorn/prefer-prototype-methods': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const has = {}.hasOwnProperty.call(record, 'id');
```

## Good

```js
const has = Object.prototype.hasOwnProperty.call(record, 'id');
```
