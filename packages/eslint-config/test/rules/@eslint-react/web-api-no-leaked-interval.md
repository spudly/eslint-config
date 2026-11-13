# Rule: @eslint-react/web-api-no-leaked-interval

## Rule Description

Every setInterval started in a component or hook needs a clearInterval in its cleanup.

## Configuration

```js
{
  // ...
  '@eslint-react/web-api-no-leaked-interval': 'error',
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
    setInterval(() => {}, 1000);
  }, []);
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function C() {
  useEffect(() => {
    const id = setInterval(() => {}, 1000);
    return () => clearInterval(id);
  }, []);
  return null;
}
```
