# Rule: no-useless-backreference

## Rule Description

Forbids regex backreferences that can only match the empty string, like referencing a group before it appears in the pattern.

## Configuration

```js
{
  // ...
  'no-useless-backreference': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = /\1(a)/;
```

## Good

```js
const pattern = /(a)\1/;
```
