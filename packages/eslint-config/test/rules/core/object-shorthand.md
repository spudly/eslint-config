# Rule: object-shorthand

## Rule Description

Requires object shorthand for methods and for properties assigned from a same-named variable.

## Configuration

```js
{
  // ...
  'object-shorthand': [
    'error',
    'always',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const record = {
  run: function () {
    return 1;
  },
};
```

## Good

```js
const record = {
  run() {
    return 1;
  },
};
```
