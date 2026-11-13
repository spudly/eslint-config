# Rule: unicorn/prefer-spread

## Rule Description

Prefers spread over slice()/concat() with no arguments when the goal is simply to copy an array.

## Configuration

```js
{
  // ...
  'unicorn/prefer-spread': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const copy = items.slice();
```

## Good

```js
const copy = [...items];
```
