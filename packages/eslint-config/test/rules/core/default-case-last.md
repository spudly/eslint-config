# Rule: default-case-last

## Rule Description

Requires the default clause to come last in a switch, matching reader expectations.

## Configuration

```js
{
  // ...
  'default-case-last': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
switch (kind) {
  default:
    walk();
    break;
  case 'a':
    run();
    break;
}
```

## Good

```js
switch (kind) {
  case 'a':
    run();
    break;
  default:
    walk();
    break;
}
```
