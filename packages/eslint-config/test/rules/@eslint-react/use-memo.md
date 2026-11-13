# Rule: @eslint-react/use-memo

## Rule Description

useMemo callbacks must be parameterless value producers whose result is actually used.

## Configuration

```js
{
  // ...
  '@eslint-react/use-memo': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useMemo} from 'react';

export function C({value}) {
  const doubled = useMemo(input => input * 2, []);
  return <p>{doubled}</p>;
}
```

## Good

```js
import {useMemo} from 'react';

export function C({value}) {
  const doubled = useMemo(() => value * 2, [value]);
  return <p>{doubled}</p>;
}
```
