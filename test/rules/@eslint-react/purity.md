# Rule: @eslint-react/purity

## Rule Description

Components and hooks must be pure during render: they must not call impure functions like Math.random or Date.now.

## Configuration

```js
{
  // ...
  '@eslint-react/purity': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C() {
  const id = Math.random();
  return <p>{id}</p>;
}
```

## Good

```js
export function C({id}) {
  return <p>{id}</p>;
}
```
