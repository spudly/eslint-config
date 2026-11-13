# Rule: @eslint-react/no-missing-component-display-name

## Rule Description

Requires components that React cannot name automatically — like anonymous functions passed to memo or forwardRef — to set a displayName for DevTools and error stacks.

## Configuration

```js
{
  // ...
  '@eslint-react/no-missing-component-display-name': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
const Panel = memo(() => {
  return <div />;
});
export default Panel;
```

## Good

```js
export function Panel() {
  return <div />;
}
```
