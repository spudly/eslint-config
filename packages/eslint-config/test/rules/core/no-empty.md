# Rule: no-empty

## Rule Description

Forbids empty blocks, which usually mark unfinished code or a statement deleted by accident.

## Configuration

```js
{
  // ...
  'no-empty': [
    'error',
    {allowEmptyCatch: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (ready) {
}
```

## Good

```js
if (ready) {
  run();
}
```
