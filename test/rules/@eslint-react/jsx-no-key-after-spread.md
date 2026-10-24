# Rule: @eslint-react/jsx-no-key-after-spread

## Rule Description

A key placed after a spread can be overridden by the spread and deoptimizes the automatic JSX runtime; write the key first.

## Configuration

```js
{
  // ...
  '@eslint-react/jsx-no-key-after-spread': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C({item, rest}) {
  return (
    <li {...rest} key={item.id}>
      {item.name}
    </li>
  );
}
```

## Good

```js
export function C({item, rest}) {
  return (
    <li key={item.id} {...rest}>
      {item.name}
    </li>
  );
}
```
