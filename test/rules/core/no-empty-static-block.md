# Rule: no-empty-static-block

## Rule Description

Forbids empty static blocks in classes, which run code that does not exist.

## Configuration

```js
{
  // ...
  'no-empty-static-block': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
class Registry {
  static {}
}
```

## Good

```js
class Registry {
  static {
    registerDefaults();
  }
}
```
