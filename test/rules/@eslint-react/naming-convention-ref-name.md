# Rule: @eslint-react/naming-convention-ref-name

## Rule Description

Identifiers assigned from useRef must be named ref or end with Ref.

## Configuration

```js
{
  // ...
  '@eslint-react/naming-convention-ref-name': 'error',
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
  const box = useRef(null);
  return <div ref={box}>x</div>;
}
```

## Good

```js
import {useRef} from 'react';

export function C() {
  const boxRef = useRef(null);
  return <div ref={boxRef}>x</div>;
}
```
