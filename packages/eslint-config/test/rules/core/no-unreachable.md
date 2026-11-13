# Rule: no-unreachable

## Rule Description

Forbids code after a return, throw, break, or continue in the same block, since it can never run.

## Configuration

```js
{
  // ...
  'no-unreachable': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function answer() {
  return 42;
  logAnswer();
}
```

## Good

```js
function answer() {
  logAnswer();
  return 42;
}
```
