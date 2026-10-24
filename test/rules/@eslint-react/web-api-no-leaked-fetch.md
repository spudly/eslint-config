# Rule: @eslint-react/web-api-no-leaked-fetch

## Rule Description

Every fetch started in a component or hook needs an AbortController whose abort runs in the cleanup.

## Configuration

```js
{
  // ...
  '@eslint-react/web-api-no-leaked-fetch': 'error',
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
    fetch('/api/data');
  }, []);
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function C() {
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/data', {signal: controller.signal});
    return () => controller.abort();
  }, []);
  return null;
}
```
