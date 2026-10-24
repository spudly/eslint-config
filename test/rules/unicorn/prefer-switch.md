# Rule: unicorn/prefer-switch

## Rule Description

Prefers a switch over a chain of else-if equality checks against the same value, which a switch states once.

## Configuration

```js
{
  // ...
  'unicorn/prefer-switch': [
    'error',
    {minimumCases: 3, emptyDefaultCase: 'no-default-comment'},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (kind === 'a') {
  runA();
} else if (kind === 'b') {
  runB();
} else if (kind === 'c') {
  runC();
}
```

## Good

```js
switch (kind) {
  case 'a':
    runA();
    break;
  case 'b':
    runB();
    break;
  case 'c':
    runC();
    break;
  default:
    break;
}
```
