# Rule: unicorn/no-negated-condition

## Rule Description

Forbids negated conditions in if/else and ternaries, where swapping the branches reads in positive terms.

## Configuration

```js
{
  // ...
  'unicorn/no-negated-condition': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (!ready) {
  wait();
} else {
  run();
}
```

## Good

```js
if (ready) {
  run();
} else {
  wait();
}
```
