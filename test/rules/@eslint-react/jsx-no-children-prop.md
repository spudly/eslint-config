# Rule: @eslint-react/jsx-no-children-prop

## Rule Description

Forbids passing children through a `children` prop in JSX; nest the content so the tree reads like the rendered output.

## Configuration

```js
{
  // ...
  '@eslint-react/jsx-no-children-prop': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function Panel() {
  return <div children="Hello" />;
}
```

## Good

```js
export function Panel() {
  return <div>Hello</div>;
}
```
