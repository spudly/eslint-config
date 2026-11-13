# Rule: @eslint-react/no-clone-element

## Rule Description

cloneElement hides data flow; render the element with explicit props instead.

## Configuration

```js
{
  // ...
  '@eslint-react/no-clone-element': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {cloneElement} from 'react';

export function C({child}) {
  return cloneElement(child, {extra: true});
}
```

## Good

```js
export function C({value}) {
  return <p>{value}</p>;
}
```
