# Rule: @eslint-react/no-children-map

## Rule Description

The Children utilities are opaque and error-prone; work with the children value directly instead of Children.map.

## Configuration

```js
{
  // ...
  '@eslint-react/no-children-map': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {Children} from 'react';

export function C({children}) {
  const result = Children.map(children, child => child);
  return <div>{result}</div>;
}
```

## Good

```js
export function C({children}) {
  return <div>{children}</div>;
}
```
