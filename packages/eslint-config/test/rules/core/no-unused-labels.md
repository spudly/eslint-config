# Rule: no-unused-labels

## Rule Description

Forbids labels that no break or continue references, leftovers that mislead readers about control flow.

## Configuration

```js
{
  // ...
  'no-unused-labels': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
outer: for (let index = 0; index < 3; index++) {
  visit(index);
}
```

## Good

```js
outer: for (let index = 0; index < 3; index++) {
  if (index === 2) {
    break outer;
  }
  visit(index);
}
```
