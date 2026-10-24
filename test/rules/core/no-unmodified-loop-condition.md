# Rule: no-unmodified-loop-condition

## Rule Description

Forbids loop conditions whose variables never change inside the loop, a likely infinite loop.

## Configuration

```js
{
  // ...
  'no-unmodified-loop-condition': [
    'error',
    {checkConditionalExpressions: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
let node = getRoot();
while (node) {
  visit(node);
}
```

## Good

```js
let node = getRoot();
while (node) {
  visit(node);
  node = node.parent;
}
```
