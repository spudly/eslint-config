# Rule: use-isnan

## Rule Description

Requires Number.isNaN for NaN checks, since === and !== against NaN never behave as expected.

## Configuration

```js
{
  // ...
  'use-isnan': [
    'error',
    {enforceForIndexOf: false, enforceForSwitchCase: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const invalid = value === NaN;
```

## Good

```js
const invalid = Number.isNaN(value);
```
