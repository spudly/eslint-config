# Rule: require-await

## Rule Description

Forbids async functions with no await in plain JS files, where the async marker only adds a hidden promise wrap.

## Configuration

```js
{
  // ...
  'require-await': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
async function answer() {
  return 42;
}
```

## Good

```js
async function answer() {
  return await Promise.resolve(42);
}
```
