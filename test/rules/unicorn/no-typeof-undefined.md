# Rule: unicorn/no-typeof-undefined

## Rule Description

Forbids `typeof x === 'undefined'` comparisons in favor of direct `x === undefined`, which is clearer and safe for declared bindings.

## Configuration

```js
{
  // ...
  'unicorn/no-typeof-undefined': [
    'error',
    {checkGlobalVariables: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const value = load();
const missing = typeof value === 'undefined';
```

## Good

```js
const value = load();
const missing = value === undefined;
```
