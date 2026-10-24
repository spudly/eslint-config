# Rule: unicorn/no-negation-in-equality-check

## Rule Description

Forbids negating one side of an equality check, like `!a == b`, where the negation binds tighter than readers expect.

## Configuration

```js
{
  // ...
  'unicorn/no-negation-in-equality-check': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const same = !first == second;
```

## Good

```js
const same = first !== second;
```
