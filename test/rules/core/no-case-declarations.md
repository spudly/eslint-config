# Rule: no-case-declarations

## Rule Description

Forbids lexical declarations directly in a case clause, where they leak into the whole switch block scope.

## Configuration

```js
{
  // ...
  'no-case-declarations': 'error',
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
    const value = 1;
    use(value);
    break;
  default:
    break;
}
```

## Good

```js
switch (kind) {
  case 'a': {
    const value = 1;
    use(value);
    break;
  }
  default:
    break;
}
```
