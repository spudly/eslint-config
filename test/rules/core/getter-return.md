# Rule: getter-return

## Rule Description

Requires getters to return a value, since an accessor that yields undefined is almost always a mistake.

## Configuration

```js
{
  // ...
  'getter-return': [
    'error',
    {allowImplicit: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const config = {
  get size() {},
};
```

## Good

```js
const config = {
  get size() {
    return 3;
  },
};
```
