# Rule: unicorn/new-for-builtins

## Rule Description

Requires `new` when creating built-in objects like Error and Array, matching how those constructors are meant to be invoked.

## Configuration

```js
{
  // ...
  'unicorn/new-for-builtins': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const failure = Error('boom');
```

## Good

```js
const failure = new Error('boom');
```
