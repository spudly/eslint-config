# Rule: no-dupe-args

## Rule Description

Forbids duplicate parameter names in a function, which silently shadow each other.

## Configuration

```js
{
  // ...
  'no-dupe-args': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.cjs

## Bad

```js
function combine(first, first) {
  return first;
}
```

## Good

```js
function combine(first, second) {
  return first + second;
}
```
