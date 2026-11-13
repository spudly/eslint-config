# Rule: @eslint-react/no-missing-key

## Rule Description

Requires a stable key on elements produced by mapping over a list, so React can reconcile rows by identity instead of position.

## Configuration

```js
{
  // ...
  '@eslint-react/no-missing-key': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function List({items}) {
  return (
    <ul>
      {items.map(item => (
        <li>{item}</li>
      ))}
    </ul>
  );
}
```

## Good

```js
export function List({items}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```
