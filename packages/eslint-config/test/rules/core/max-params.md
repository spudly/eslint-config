# Rule: max-params

## Rule Description

Caps functions at four parameters in plain JS files; longer signatures belong in an options object.

## Configuration

```js
{
  // ...
  'max-params': [
    'error',
    {max: 4},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
function build(a, b, c, d, e) {
  return a + b + c + d + e;
}
```

## Good

```js
function build(a, b, c, d) {
  return a + b + c + d;
}
```
