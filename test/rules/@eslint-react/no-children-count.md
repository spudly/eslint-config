# Rule: @eslint-react/no-children-count

## Rule Description

The Children utilities are opaque and error-prone; work with the children value directly instead of Children.count.

## Configuration

```js
{
  // ...
  '@eslint-react/no-children-count': 'error',
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
  const result = Children.count(children);
  return <div>{result}</div>;
}
```

## Good

```js
export function C({children}) {
  return <div>{children}</div>;
}
```
