# Rule: prefer-rest-params

## Rule Description

Requires rest parameters instead of the arguments object, which is not a real array and hides the signature.

## Configuration

```js
{
  // ...
  'prefer-rest-params': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function firstArg() {
  return arguments[0];
}
```

## Good

```js
function firstArg(...args) {
  return args[0];
}
```
