# Rule: @eslint-react/no-duplicate-key

## Rule Description

Sibling elements in a list must not share the same key; duplicates break React's reconciliation.

## Configuration

```js
{
  // ...
  '@eslint-react/no-duplicate-key': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C() {
  return (
    <ul>
      <li key="a">one</li>
      <li key="a">two</li>
    </ul>
  );
}
```

## Good

```js
export function C() {
  return (
    <ul>
      <li key="a">one</li>
      <li key="b">two</li>
    </ul>
  );
}
```
