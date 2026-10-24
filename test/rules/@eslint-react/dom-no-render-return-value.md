# Rule: @eslint-react/dom-no-render-return-value

## Rule Description

Forbids using the value returned by ReactDOM.render, which is not a stable handle to the mounted tree.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-render-return-value': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function mount() {
  const instance = ReactDOM.render(<App />, container);
  return instance;
}
```

## Good

```js
export function mount() {
  ReactDOM.render(<App />, container);
}
```
