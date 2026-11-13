# Rule: unicorn/no-unnecessary-await

## Rule Description

Forbids awaiting values that are plainly not promises, like literals, where the await only confuses.

## Configuration

```js
{
  // ...
  'unicorn/no-unnecessary-await': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
async function answer() {
  return await 42;
}
```

## Good

```js
async function answer() {
  return 42;
}
```
