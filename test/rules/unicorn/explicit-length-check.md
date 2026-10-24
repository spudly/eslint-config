# Rule: unicorn/explicit-length-check

## Rule Description

Requires length checks to be explicit comparisons like `length > 0`, instead of relying on truthiness of a number.

## Configuration

```js
{
  // ...
  'unicorn/explicit-length-check': [
    'error',
    {'non-zero': 'greater-than'},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (items.length) {
  run();
}
```

## Good

```js
if (items.length > 0) {
  run();
}
```
