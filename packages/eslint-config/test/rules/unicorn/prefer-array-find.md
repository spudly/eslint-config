# Rule: unicorn/prefer-array-find

## Rule Description

Prefers Array#find over filter(...)[0], which allocates a whole filtered array to take one element.

## Configuration

```js
{
  // ...
  'unicorn/prefer-array-find': [
    'error',
    {checkFromLast: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const first = items.filter(item => item.ready)[0];
```

## Good

```js
const first = items.find(item => item.ready);
```
