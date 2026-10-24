# Rule: @eslint-react/immutability

## Rule Description

Props, state, and other immutable values must not be mutated during render, including through callbacks passed to hooks or JSX.

## Configuration

```js
{
  // ...
  '@eslint-react/immutability': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C({user}) {
  user.name = 'mutated';
  return <p>{user.name}</p>;
}
```

## Good

```js
export function C({user}) {
  return <p>{user.name}</p>;
}
```
