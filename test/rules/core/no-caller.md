# Rule: no-caller

## Rule Description

Forbids arguments.caller and arguments.callee, which are deprecated, insecure, and block optimization.

## Configuration

```js
{
  // ...
  'no-caller': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function outer() {
  return arguments.caller;
}
```

## Good

```js
function outer() {
  return outer;
}
```
