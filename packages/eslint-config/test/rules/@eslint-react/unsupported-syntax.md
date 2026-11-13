# Rule: @eslint-react/unsupported-syntax

## Rule Description

Syntax React Compiler does not support must not appear in components or hooks.

## Configuration

```js
{
  // ...
  '@eslint-react/unsupported-syntax': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C({code}) {
  const value = eval(code);
  return <p>{value}</p>;
}
```

## Good

```js
export function C({items}) {
  const visible = items.filter(item => !item.skip);
  return <p>{visible.length}</p>;
}
```
