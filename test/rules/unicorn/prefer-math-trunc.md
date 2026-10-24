# Rule: unicorn/prefer-math-trunc

## Rule Description

Prefers Math.trunc over bitwise truncation tricks like ~~x or x | 0, which overflow and read as noise.

## Configuration

```js
{
  // ...
  'unicorn/prefer-math-trunc': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const whole = ~~price;
```

## Good

```js
const whole = Math.trunc(price);
```
