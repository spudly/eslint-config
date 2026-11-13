# Rule: unicorn/no-useless-switch-case

## Rule Description

Forbids switch cases that do nothing and fall back to the default behavior anyway, which only restate the default.

## Configuration

```js
{
  // ...
  'unicorn/no-useless-switch-case': 'error',
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
  default:
    run();
    break;
}
```

## Good

```js
switch (kind) {
  case 'a':
    walk();
    break;
  default:
    run();
    break;
}
```
