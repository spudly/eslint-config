# Rule: no-duplicate-case

## Rule Description

Forbids duplicate case labels in a switch, where the second can never be reached.

## Configuration

```js
{
  // ...
  'no-duplicate-case': 'error',
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
    break;
  case 'a':
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
