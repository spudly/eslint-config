# Rule: unicorn/no-new-array

## Rule Description

Forbids calling the Array constructor with a single argument, where it is ambiguous whether the value is a length or the only element; use a literal or Array.from.

## Configuration

```js
{
  // ...
  'unicorn/no-new-array': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const values = new Array(3);
```

## Good

```js
const values = [1, 2, 3];
```
