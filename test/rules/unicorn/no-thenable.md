# Rule: unicorn/no-thenable

## Rule Description

Forbids objects and classes with a `then` property or method (outside real promises), which makes await treat them as promises by accident.

## Configuration

```js
{
  // ...
  'unicorn/no-thenable': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const task = {
  then() {
    return 1;
  },
};
```

## Good

```js
const task = {
  run() {
    return 1;
  },
};
```
