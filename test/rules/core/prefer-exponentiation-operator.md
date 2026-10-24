# Rule: prefer-exponentiation-operator

## Rule Description

Prefers the ** operator over Math.pow, which reads closer to the math it performs.

## Configuration

```js
{
  // ...
  'prefer-exponentiation-operator': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const area = Math.pow(side, 2);
```

## Good

```js
const area = side ** 2;
```
