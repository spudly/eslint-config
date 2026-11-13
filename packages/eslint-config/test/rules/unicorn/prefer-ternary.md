# Rule: unicorn/prefer-ternary

## Rule Description

Prefers a ternary over an if/else whose only job is assigning one of two values to the same variable.

## Configuration

```js
{
  // ...
  'unicorn/prefer-ternary': [
    'error',
    'always',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
let label;
if (ready) {
  label = 'yes';
} else {
  label = 'no';
}
```

## Good

```js
const label = ready ? 'yes' : 'no';
```
