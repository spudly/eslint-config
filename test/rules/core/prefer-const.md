# Rule: prefer-const

## Rule Description

Requires const for variables that are never reassigned, advertising that the binding is stable.

## Configuration

```js
{
  // ...
  'prefer-const': [
    'error',
    {destructuring: 'any', ignoreReadBeforeAssign: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
let count = 1;
export function read() {
  return count;
}
```

## Good

```js
const count = 1;
export function read() {
  return count;
}
```
