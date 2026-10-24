# Rule: @eslint-react/error-boundaries

## Rule Description

Error boundaries, not try/catch around rendering, are how React catches errors from child components.

## Configuration

```js
{
  // ...
  '@eslint-react/error-boundaries': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {Child} from './child';

export function C() {
  try {
    return <Child />;
  } catch {
    return <p>failed</p>;
  }
}
```

## Good

```js
import {Child} from './child';

export function C() {
  return <Child />;
}
```
