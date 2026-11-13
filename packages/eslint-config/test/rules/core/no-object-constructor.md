# Rule: no-object-constructor

## Rule Description

Forbids new Object() in favor of object literals.

## Configuration

```js
{
  // ...
  'no-object-constructor': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const record = new Object();
```

## Good

```js
const record = {};
```
