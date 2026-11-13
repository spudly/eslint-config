# Rule: @eslint-react/no-unnecessary-use-prefix

## Rule Description

A function with the use prefix must actually call at least one hook; the prefix is a hooks contract, not a naming style.

## Configuration

```js
{
  // ...
  '@eslint-react/no-unnecessary-use-prefix': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function useDouble(value) {
  return value * 2;
}
```

## Good

```js
import {useMemo} from 'react';

export function useDouble(value) {
  return useMemo(() => value * 2, [value]);
}
```
