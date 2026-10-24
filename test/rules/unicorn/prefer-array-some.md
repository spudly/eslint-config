# Rule: unicorn/prefer-array-some

## Rule Description

Prefers Array#some over checking whether find returned a value, when only existence matters.

## Configuration

```js
{
  // ...
  'unicorn/prefer-array-some': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const hasReady = items.find(item => item.ready) !== undefined;
```

## Good

```js
const hasReady = items.some(item => item.ready);
```
