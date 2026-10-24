# Rule: unicorn/no-instanceof-builtins

## Rule Description

Forbids instanceof against built-in constructors like Array, which breaks across realms; use the dedicated checks such as Array.isArray.

## Configuration

```js
{
  // ...
  'unicorn/no-instanceof-builtins': [
    'error',
    {useErrorIsError: false, strategy: 'loose', include: [], exclude: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const isList = value instanceof Array;
```

## Good

```js
const isList = Array.isArray(value);
```
