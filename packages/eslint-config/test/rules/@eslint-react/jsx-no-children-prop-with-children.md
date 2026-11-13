# Rule: @eslint-react/jsx-no-children-prop-with-children

## Rule Description

Passing children both as a prop and as nested content is contradictory; use one or the other.

## Configuration

```js
{
  // ...
  '@eslint-react/jsx-no-children-prop-with-children': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C() {
  return <div children="from-prop">nested</div>;
}
```

## Good

```js
export function C() {
  return <div>nested</div>;
}
```
