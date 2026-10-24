# Rule: no-obj-calls

## Rule Description

Forbids calling global objects like Math or JSON as if they were functions.

## Configuration

```js
{
  // ...
  'no-obj-calls': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const result = Math(1, 2);
```

## Good

```js
const result = Math.max(1, 2);
```
