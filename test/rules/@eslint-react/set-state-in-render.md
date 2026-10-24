# Rule: @eslint-react/set-state-in-render

## Rule Description

Setting state unconditionally during render can trigger infinite render loops.

## Configuration

```js
{
  // ...
  '@eslint-react/set-state-in-render': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useState} from 'react';

export function C() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <p>{count}</p>;
}
```

## Good

```js
import {useState} from 'react';

export function C() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
