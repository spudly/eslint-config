# Rule: no-const-assign

## Rule Description

Forbids reassigning a const binding, which would throw at runtime anyway.

## Configuration

```js
{
  // ...
  'no-const-assign': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const limit = 10;
limit = 20;
```

## Good

```js
let limit = 10;
limit = 20;
```
