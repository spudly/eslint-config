# Rule: no-unneeded-ternary

## Rule Description

Forbids ternaries that just produce true/false or repeat the condition as a branch, where the condition itself is the value.

## Configuration

```js
{
  // ...
  'no-unneeded-ternary': [
    'error',
    {defaultAssignment: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const open = isOpen ? true : false;
```

## Good

```js
const open = isOpen;
```
