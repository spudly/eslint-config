# Rule: @eslint-react/no-misused-capture-owner-stack

## Rule Description

captureOwnerStack is a development-only debugging API that may only be called from a component or hook render.

## Configuration

```js
{
  // ...
  '@eslint-react/no-misused-capture-owner-stack': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {captureOwnerStack} from 'react';

export function handleClick() {
  const stack = captureOwnerStack();
  return stack;
}
```

## Good

```js
export function C() {
  return <p>done</p>;
}
```
