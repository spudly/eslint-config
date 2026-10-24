# Rule: no-setter-return

## Rule Description

Forbids returning a value from a setter, where the return is silently discarded.

## Configuration

```js
{
  // ...
  'no-setter-return': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const store = {
  set value(next) {
    return next;
  },
};
```

## Good

```js
const store = {
  set value(next) {
    this.current = next;
  },
};
```
