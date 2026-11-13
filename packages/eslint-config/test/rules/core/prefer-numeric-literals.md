# Rule: prefer-numeric-literals

## Rule Description

Prefers 0b/0o/0x numeric literals over parseInt with a radix for constant values.

## Configuration

```js
{
  // ...
  'prefer-numeric-literals': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const mask = parseInt('1111', 2);
```

## Good

```js
const mask = 0b1111;
```
