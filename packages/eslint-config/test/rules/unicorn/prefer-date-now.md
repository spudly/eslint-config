# Rule: unicorn/prefer-date-now

## Rule Description

Prefers Date.now() over constructing a Date just to read its timestamp.

## Configuration

```js
{
  // ...
  'unicorn/prefer-date-now': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const now = new Date().getTime();
```

## Good

```js
const now = Date.now();
```
