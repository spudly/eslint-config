# Rule: radix

## Rule Description

Requires an explicit radix for parseInt, whose default guessing (notably for leading zeros) is a classic bug source.

## Configuration

```js
{
  // ...
  'radix': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const count = parseInt('42');
```

## Good

```js
const count = parseInt('42', 10);
```
