# Rule: @eslint-react/dom-no-flush-sync

## Rule Description

flushSync forces synchronous rendering outside React's scheduling and is almost never the right tool.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-flush-sync': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {flushSync} from 'react-dom';

export function update() {
  flushSync(() => {});
}
```

## Good

```js
export function update() {
  return null;
}
```
