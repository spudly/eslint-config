# Rule: unicorn/no-object-as-default-parameter

## Rule Description

Forbids non-empty object literals as parameter defaults, since one default object is shared by every call that omits the argument and mutation leaks between calls.

## Configuration

```js
{
  // ...
  'unicorn/no-object-as-default-parameter': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function configure(options = {strict: true}) {
  return options;
}
```

## Good

```js
function configure(options) {
  return options ?? {strict: true};
}
```
