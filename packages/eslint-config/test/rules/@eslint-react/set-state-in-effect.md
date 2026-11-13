# Rule: @eslint-react/set-state-in-effect

## Rule Description

Setting state synchronously in an effect causes extra renders; derive the value or compute it during render instead.

## Configuration

```js
{
  // ...
  '@eslint-react/set-state-in-effect': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useEffect, useState} from 'react';

export function C({items}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(items.length);
  }, [items]);
  return <p>{count}</p>;
}
```

## Good

```js
export function C({items}) {
  return <p>{items.length}</p>;
}
```
