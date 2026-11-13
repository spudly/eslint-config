# Rule: no-self-compare

## Rule Description

Forbids comparing a value to itself, which is always predetermined and usually a typo (NaN checks belong to Number.isNaN).

## Configuration

```js
{
  // ...
  'no-self-compare': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (value === value) {
  run();
}
```

## Good

```js
if (value === other) {
  run();
}
```
