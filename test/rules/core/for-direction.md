# Rule: for-direction

## Rule Description

Requires the for-loop counter to move toward the loop condition, catching loops that can never terminate.

## Configuration

```js
{
  // ...
  'for-direction': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
for (let index = 0; index < 10; index--) {
  processIndex(index);
}
```

## Good

```js
for (let index = 0; index < 10; index++) {
  processIndex(index);
}
```
