# Rule: @eslint-react/jsx-no-comment-textnodes

## Rule Description

Forbids comment-looking text nodes in JSX: a // or /* written as element text renders as visible text instead of acting as a comment.

## Configuration

```js
{
  // ...
  '@eslint-react/jsx-no-comment-textnodes': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function Panel() {
  return <div>// loading placeholder</div>;
}
```

## Good

```js
export function Panel() {
  return <div>{/* loading placeholder */}</div>;
}
```
