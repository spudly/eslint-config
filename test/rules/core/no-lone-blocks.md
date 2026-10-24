# Rule: no-lone-blocks

## Rule Description

Forbids standalone blocks nested inside other blocks or functions where they serve no scoping purpose.

## Configuration

```js
{
  // ...
  'no-lone-blocks': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function compute() {
  let value = 0;
  {
    value = 1;
  }
  return value;
}
```

## Good

```js
function compute() {
  let value = 0;
  value = 1;
  return value;
}
```
