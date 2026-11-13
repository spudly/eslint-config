# Rule: unicorn/no-array-method-this-argument

## Rule Description

Forbids passing a thisArg to array methods like filter and map, a legacy pattern arrow functions make unnecessary.

## Configuration

```js
{
  // ...
  'unicorn/no-array-method-this-argument': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const big = items.filter(function (item) {
  return item > this.minimum;
}, context);
```

## Good

```js
const big = items.filter(item => item > context.minimum);
```
