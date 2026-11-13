# Rule: @eslint-react/no-nested-lazy-component-declarations

## Rule Description

lazy() wrappers must be declared at module scope; declaring one inside a component recreates it every render.

## Configuration

```js
{
  // ...
  '@eslint-react/no-nested-lazy-component-declarations': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {lazy} from 'react';

export function C() {
  const Panel = lazy(() => import('./Panel'));
  return <Panel />;
}
```

## Good

```js
import {lazy} from 'react';

const Panel = lazy(() => import('./Panel'));

export function C() {
  return <Panel />;
}
```
