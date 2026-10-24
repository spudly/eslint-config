# Rule: react-hooks/rules-of-hooks

## Rule Description

Requires React hooks to be called unconditionally at the top level of a component or custom hook, never inside conditions, loops, or nested functions.

## Configuration

```js
{
  // ...
  'react-hooks/rules-of-hooks': 'error',
  // ...
}
```

## Test setup

- Export: react
- File: fixture.tsx

## Bad

```js
import {useEffect} from 'react';

export function Panel({ready}) {
  if (ready) {
    useEffect(() => {
      document.title = 'ready';
    }, []);
  }
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function Panel({ready}) {
  useEffect(() => {
    if (ready) {
      document.title = 'ready';
    }
  }, [ready]);
  return null;
}
```
