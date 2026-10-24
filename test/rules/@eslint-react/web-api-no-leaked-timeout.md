# Rule: @eslint-react/web-api-no-leaked-timeout

## Rule Description

Every setTimeout started in a component or hook needs a clearTimeout in its cleanup.

## Configuration

```js
{
  // ...
  '@eslint-react/web-api-no-leaked-timeout': 'error',
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
    setTimeout(() => {}, 1000);
  }, []);
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function C() {
  useEffect(() => {
    const id = setTimeout(() => {}, 1000);
    return () => clearTimeout(id);
  }, []);
  return null;
}
```
