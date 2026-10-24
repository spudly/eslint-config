# Rule: max-lines-per-function

## Rule Description

Warns when a single function runs past 30 lines of code, nudging long functions to be split into named steps.

## Configuration

```js
{
  // ...
  'max-lines-per-function': [
    'warn',
    {max: 30, skipBlankLines: true, skipComments: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
export function total() {
  let sum = 0;
  sum += 1;
  sum += 2;
  sum += 3;
  sum += 4;
  sum += 5;
  sum += 6;
  sum += 7;
  sum += 8;
  sum += 9;
  sum += 10;
  sum += 11;
  sum += 12;
  sum += 13;
  sum += 14;
  sum += 15;
  sum += 16;
  sum += 17;
  sum += 18;
  sum += 19;
  sum += 20;
  sum += 21;
  sum += 22;
  sum += 23;
  sum += 24;
  sum += 25;
  sum += 26;
  sum += 27;
  sum += 28;
  sum += 29;
  sum += 30;
  sum += 31;
  return sum;
}
```

## Good

```js
export function total() {
  return 1 + 2;
}
```
