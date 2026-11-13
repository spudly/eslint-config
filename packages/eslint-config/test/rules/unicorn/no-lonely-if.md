# Rule: unicorn/no-lonely-if

## Rule Description

Forbids an if that is the only statement inside another if's block, which should be merged into a single condition with &&.

## Configuration

```js
{
  // ...
  'unicorn/no-lonely-if': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (ready) {
  if (waiting) {
    wait();
  }
}
```

## Good

```js
if (ready && waiting) {
  wait();
}
```
