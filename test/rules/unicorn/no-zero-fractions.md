# Rule: unicorn/no-zero-fractions

## Rule Description

Forbids trailing zero fractions like 1.0, which should be written as the integer they are.

## Configuration

```js
{
  // ...
  'unicorn/no-zero-fractions': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const count = 1.0;
```

## Good

```js
const count = 1;
```
