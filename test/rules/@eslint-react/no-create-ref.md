# Rule: @eslint-react/no-create-ref

## Rule Description

createRef is the class-component ref API; function components and hooks use useRef.

## Configuration

```js
{
  // ...
  '@eslint-react/no-create-ref': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {createRef} from 'react';

export function C() {
  const ref = createRef();
  return <div ref={ref}>x</div>;
}
```

## Good

```js
import {useRef} from 'react';

export function C() {
  const ref = useRef(null);
  return <div ref={ref}>x</div>;
}
```
