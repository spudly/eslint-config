# Rule: @eslint-react/naming-convention-id-name

## Rule Description

Identifiers assigned from useId must be named id or end with Id.

## Configuration

```js
{
  // ...
  '@eslint-react/naming-convention-id-name': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useId} from 'react';

export function C() {
  const fieldKey = useId();
  return <p>{fieldKey}</p>;
}
```

## Good

```js
import {useId} from 'react';

export function C() {
  const fieldId = useId();
  return <p>{fieldId}</p>;
}
```
