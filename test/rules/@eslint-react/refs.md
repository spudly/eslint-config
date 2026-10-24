# Rule: @eslint-react/refs

## Rule Description

ref.current must not be read or written during render; refs are for values that live outside the render output.

## Configuration

```js
{
  // ...
  '@eslint-react/refs': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useRef} from 'react';

export function C() {
  const ref = useRef(0);
  return <p>{ref.current}</p>;
}
```

## Good

```js
import {useEffect, useRef} from 'react';

export function C() {
  const ref = useRef(0);
  useEffect(() => {
    ref.current = 1;
  }, []);
  return <p>done</p>;
}
```
