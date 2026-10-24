# Rule: unicorn/no-unreadable-array-destructuring

## Rule Description

Forbids array destructuring that skips elements with bare holes, where indexing says directly which element is meant.

## Configuration

```js
{
  // ...
  'unicorn/no-unreadable-array-destructuring': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const [, , third] = items;
```

## Good

```js
const third = items[2];
```
