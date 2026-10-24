# Rule: @eslint-react/jsx-no-leaked-dollar

## Rule Description

A $ pasted from a template literal into JSX text renders literally instead of interpolating the value.

## Configuration

```js
{
  // ...
  '@eslint-react/jsx-no-leaked-dollar': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C({total}) {
  return <p>Price: ${total}</p>;
}
```

## Good

```js
export function C({total}) {
  return <p>{total}</p>;
}
```
