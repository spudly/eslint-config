# Rule: unicorn/no-useless-length-check

## Rule Description

Forbids length checks combined with array methods that already imply them, like `length > 0 && items.some(...)`.

## Configuration

```js
{
  // ...
  'unicorn/no-useless-length-check': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const hasReady = items.length > 0 && items.some(item => item.ready);
```

## Good

```js
const hasReady = items.some(item => item.ready);
```
