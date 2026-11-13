# Rule: no-return-assign

## Rule Description

Forbids assignments inside a return statement, which are easy to misread as comparisons.

## Configuration

```js
{
  // ...
  'no-return-assign': [
    'error',
    'except-parens',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

<!-- prettier-ignore -->
```js
let saved;
function store(value) {
  return saved = value;
}
```

## Good

<!-- prettier-ignore -->
```js
let saved;
function store(value) {
  saved = value;
  return saved;
}
```
