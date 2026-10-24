# Rule: unicorn/no-unreadable-iife

## Rule Description

Forbids immediately-invoked arrow functions whose body is wrapped in parentheses, which hides where the body ends and the invocation begins.

## Configuration

```js
{
  // ...
  'unicorn/no-unreadable-iife': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const settings = (() => ({strict: true}))();
```

## Good

```js
const answer = (() => 40 + 2)();
```
