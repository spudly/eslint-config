# Rule: no-dupe-else-if

## Rule Description

Forbids repeating a condition in an else-if chain, where the later branch can never run.

## Configuration

```js
{
  // ...
  'no-dupe-else-if': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (value === 1) {
  run();
} else if (value === 1) {
  walk();
}
```

## Good

```js
if (value === 1) {
  run();
} else if (value === 2) {
  walk();
}
```
