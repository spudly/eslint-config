# Rule: react-hooks/exhaustive-deps

## Rule Description

Requires useEffect and friends to list every reactive value they read in their dependency array, so effects cannot go stale silently.

## Configuration

```js
{
  // ...
  'react-hooks/exhaustive-deps': 'error',
  // ...
}
```

## Test setup

- Export: react
- File: fixture.tsx

## Bad

```js
import {useEffect} from 'react';

export function Panel({title}) {
  useEffect(() => {
    document.title = title;
  }, []);
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function Panel({title}) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
```
