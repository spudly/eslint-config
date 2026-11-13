# Rule: unicorn/prefer-regexp-test

## Rule Description

Prefers RegExp#test over String#match when the result is only used as a boolean.

## Configuration

```js
{
  // ...
  'unicorn/prefer-regexp-test': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (name.match(/^a/)) {
  run();
}
```

## Good

```js
if (/^a/.test(name)) {
  run();
}
```
