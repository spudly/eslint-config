# Rule: no-extra-boolean-cast

## Rule Description

Forbids redundant double negation and Boolean() casts in conditions, where the value is already treated as a boolean.

## Configuration

```js
{
  // ...
  'no-extra-boolean-cast': [
    'error',
    {},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (!!ready) {
  run();
}
```

## Good

```js
if (ready) {
  run();
}
```
