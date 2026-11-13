# Rule: @eslint-react/web-api-no-leaked-intersection-observer

## Rule Description

Every IntersectionObserver created in a component or hook needs a disconnect() in its cleanup.

## Configuration

```js
{
  // ...
  '@eslint-react/web-api-no-leaked-intersection-observer': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useEffect} from 'react';

export function C({target}) {
  useEffect(() => {
    const observer = new IntersectionObserver(() => {});
    observer.observe(target);
  }, [target]);
  return null;
}
```

## Good

```js
import {useEffect} from 'react';

export function C() {
  useEffect(() => {
    const observer = new IntersectionObserver(() => {});
    return () => observer.disconnect();
  }, []);
  return null;
}
```
