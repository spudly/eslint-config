# Rule: unicorn/consistent-function-scoping

## Rule Description

Requires functions declared inside another function to actually use the enclosing scope; otherwise they belong at the top level.

## Configuration

```js
{
  // ...
  'unicorn/consistent-function-scoping': [
    'error',
    {checkArrowFunctions: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function outer() {
  function helper() {
    return 1;
  }
  return helper();
}
```

## Good

```js
function helper() {
  return 1;
}
function outer() {
  return helper();
}
```
