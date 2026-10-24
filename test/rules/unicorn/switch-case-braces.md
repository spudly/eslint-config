# Rule: unicorn/switch-case-braces

## Rule Description

Requires braces around every case and default clause, so declarations stay scoped to their clause and clauses read uniformly.

## Configuration

```js
{
  // ...
  'unicorn/switch-case-braces': [
    'error',
    'always',
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
    const value = 1;
    use(value);
    break;
  default: {
    break;
  }
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
  default: {
    break;
  }
}
```
