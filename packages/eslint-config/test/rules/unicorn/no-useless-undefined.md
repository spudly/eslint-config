# Rule: unicorn/no-useless-undefined

## Rule Description

Forbids explicitly returning or passing `undefined` where omitting it means the same thing.

## Configuration

```js
{
  // ...
  'unicorn/no-useless-undefined': [
    'error',
    {checkArguments: true, checkArrowFunctionBody: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function reset() {
  return undefined;
}
```

## Good

```js
function reset() {
  return;
}
```
