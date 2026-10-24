# Rule: @eslint-react/web-api-no-leaked-event-listener

## Rule Description

Every addEventListener in a component or hook needs a corresponding removeEventListener in its cleanup.

## Configuration

```js
{
  // ...
  '@eslint-react/web-api-no-leaked-event-listener': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useEffect} from 'react';

export function C() {
  useEffect(() => {
    window.addEventListener('resize', () => {});
  }, []);
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function C() {
  useEffect(() => {
    const onResize = () => {};
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return null;
}
```
