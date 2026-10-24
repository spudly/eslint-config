# Rule: no-fallthrough

## Rule Description

Forbids switch cases that fall through without a break, return, or throw, a classic source of accidental double execution.

## Configuration

```js
{
  // ...
  'no-fallthrough': [
    'error',
    {allowEmptyCase: false, reportUnusedFallthroughComment: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
switch (kind) {
  case 'a':
    run();
  case 'b':
    walk();
    break;
  default:
    break;
}
```

## Good

```js
switch (kind) {
  case 'a':
    run();
    break;
  case 'b':
    walk();
    break;
  default:
    break;
}
```
