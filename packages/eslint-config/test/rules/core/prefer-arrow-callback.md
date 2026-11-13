# Rule: prefer-arrow-callback

## Rule Description

Prefers arrow functions for callbacks, which keep the surrounding this and read lighter.

## Configuration

```js
{
  // ...
  'prefer-arrow-callback': [
    'error',
    {allowNamedFunctions: false, allowUnboundThis: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const doubled = [1, 2].map(function (value) {
  return value * 2;
});
```

## Good

```js
const doubled = [1, 2].map(value => value * 2);
```
