# Rule: unicorn/numeric-separators-style

## Rule Description

Requires long numeric literals to be grouped with underscore separators, so magnitudes can be read at a glance.

## Configuration

```js
{
  // ...
  'unicorn/numeric-separators-style': [
    'error',
    {
      onlyIfContainsSeparator: false,
      binary: {minimumDigits: 0, groupLength: 4},
      octal: {minimumDigits: 0, groupLength: 4},
      hexadecimal: {minimumDigits: 0, groupLength: 2},
      number: {minimumDigits: 5, groupLength: 3, fractionGroupLength: Infinity},
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const budget = 1000000;
```

## Good

```js
const budget = 1_000_000;
```
