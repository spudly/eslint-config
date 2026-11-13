# Rule: no-proto

## Rule Description

Forbids **proto** access; use Object.getPrototypeOf and Object.setPrototypeOf instead.

## Configuration

```js
{
  // ...
  'no-proto': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const proto = record.__proto__;
```

## Good

```js
const proto = Object.getPrototypeOf(record);
```
