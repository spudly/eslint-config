# Rule: unicorn/no-single-promise-in-promise-methods

## Rule Description

Forbids Promise.all/race/any/allSettled with a single-element array, where the wrapper adds nothing over the promise itself.

## Configuration

```js
{
  // ...
  'unicorn/no-single-promise-in-promise-methods': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const result = await Promise.all([only]);
```

## Good

```js
const result = await Promise.all([first, second]);
```
