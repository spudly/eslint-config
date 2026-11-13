# Rule: no-sparse-arrays

## Rule Description

Forbids holes in array literals, which behave differently from explicit undefined in most array methods.

## Configuration

```js
{
  // ...
  'no-sparse-arrays': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const values = [1, , 3];
```

## Good

```js
const values = [1, 2, 3];
```
