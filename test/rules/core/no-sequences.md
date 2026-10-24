# Rule: no-sequences

## Rule Description

Forbids the comma operator outside for-loop headers (unless parenthesized), where it hides two expressions as one.

## Configuration

```js
{
  // ...
  'no-sequences': [
    'error',
    {allowInParentheses: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

<!-- prettier-ignore -->
```js
function pick() {
  return first, second;
}
```

## Good

<!-- prettier-ignore -->
```js
function pick() {
  return second;
}
```
