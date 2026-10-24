# Rule: @eslint-react/dom-no-unsafe-iframe-sandbox

## Rule Description

An iframe sandbox must not combine allow-scripts with allow-same-origin, which lets the frame remove its own sandbox.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-unsafe-iframe-sandbox': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C() {
  return <iframe sandbox="allow-scripts allow-same-origin" src="/frame" />;
}
```

## Good

```js
export function C() {
  return <iframe sandbox="allow-scripts" src="/frame" />;
}
```
