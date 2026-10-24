# Rule: unicorn/prefer-native-coercion-functions

## Rule Description

Forbids wrapping a native coercion function (Boolean, Number, String) in an arrow function when passing it as a callback; pass the function directly, which is both shorter and receives the callback arguments identically.

## Configuration

```js
{
  // ...
  'unicorn/prefer-native-coercion-functions': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const flags = values.map(value => Boolean(value));
```

## Good

```js
const flags = values.map(Boolean);
```
