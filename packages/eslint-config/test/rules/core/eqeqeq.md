# Rule: eqeqeq

## Rule Description

Requires === and !== instead of == and !=, whose implicit coercions hide type bugs.

## Configuration

```js
{
  // ...
  'eqeqeq': [
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
const same = count == '3';
```

## Good

```js
const same = count === 3;
```
