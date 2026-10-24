# Rule: unicorn/no-await-in-promise-methods

## Rule Description

Forbids awaiting each promise inside Promise.all/race/any/allSettled arguments, which serializes what should run concurrently.

## Configuration

```js
{
  // ...
  'unicorn/no-await-in-promise-methods': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const results = await Promise.all([await first(), await second()]);
```

## Good

```js
const results = await Promise.all([first(), second()]);
```
