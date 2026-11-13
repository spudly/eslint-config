# Rule: unicorn/prefer-number-properties

## Rule Description

Prefers Number.* properties (parseInt, isNaN, MAX_VALUE, ...) over the global equivalents, which coerce differently.

## Configuration

```js
{
  // ...
  'unicorn/prefer-number-properties': [
    'error',
    {checkInfinity: false, checkNaN: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const count = parseInt(text, 10);
```

## Good

```js
const count = Number.parseInt(text, 10);
```
