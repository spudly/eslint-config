# Rule: @eslint-react/globals

## Rule Description

Components must not assign to or mutate globals during render; render output may only depend on props, state, and context.

## Configuration

```js
{
  // ...
  '@eslint-react/globals': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
let renderCount = 0;

export function C() {
  renderCount += 1;
  return <p>{renderCount}</p>;
}
```

## Good

```js
import {useState} from 'react';

export function C() {
  const [renderCount] = useState(0);
  return <p>{renderCount}</p>;
}
```
