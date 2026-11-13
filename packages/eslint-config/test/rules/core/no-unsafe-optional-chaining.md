# Rule: no-unsafe-optional-chaining

## Rule Description

Forbids using the result of an optional chain where an undefined short-circuit would throw, like calling (obj?.method)() unparenthesized by a guard.

## Configuration

```js
{
  // ...
  'no-unsafe-optional-chaining': [
    'error',
    {disallowArithmeticOperators: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const result = (session?.user)();
```

## Good

```js
const result = session?.user();
```
