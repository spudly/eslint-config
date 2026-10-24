# Rule: @eslint-react/dom-no-dangerously-set-innerhtml-with-children

## Rule Description

Forbids combining dangerouslySetInnerHTML with children on the same element, since React ignores one of them and the intent is ambiguous.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function Panel({html}) {
  return <div dangerouslySetInnerHTML={html}>fallback</div>;
}
```

## Good

```js
export function Panel({html}) {
  return <div dangerouslySetInnerHTML={html} />;
}
```
