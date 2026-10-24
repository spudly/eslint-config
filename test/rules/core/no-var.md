# Rule: no-var

## Rule Description

Forbids var in favor of const and let, whose block scoping avoids hoisting surprises.

## Configuration

```js
{
  // ...
  'no-var': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
var count = 1;
```

## Good

```js
const count = 1;
```
