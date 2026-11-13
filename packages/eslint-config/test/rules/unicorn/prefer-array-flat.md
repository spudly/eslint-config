# Rule: unicorn/prefer-array-flat

## Rule Description

Prefers Array#flat over concat-apply and reduce-concat flattening idioms.

## Configuration

```js
{
  // ...
  'unicorn/prefer-array-flat': [
    'error',
    {functions: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const flat = [].concat.apply([], nested);
```

## Good

```js
const flat = nested.flat();
```
