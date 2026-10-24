# Rule: @eslint-react/static-components

## Rule Description

Components must be static definitions, not recreated on every render by declaring them inside another component.

## Configuration

```js
{
  // ...
  '@eslint-react/static-components': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function Outer() {
  function Inner() {
    return <p>inner</p>;
  }
  return <Inner />;
}
```

## Good

```js
function Inner() {
  return <p>inner</p>;
}

export function Outer() {
  return <Inner />;
}
```
