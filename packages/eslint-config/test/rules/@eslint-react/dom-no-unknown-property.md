# Rule: @eslint-react/dom-no-unknown-property

## Rule Description

Forbids unknown properties on DOM elements in JSX; React only forwards attributes it knows (plus data-* and aria-*), so a typo like someprop silently disappears.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-unknown-property': [
    'error',
    {ignore: [], requireDataLowercase: false},
  ],
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function Panel() {
  return <div someprop="ready" />;
}
```

## Good

```js
export function Panel() {
  return <div data-ready="yes" />;
}
```
