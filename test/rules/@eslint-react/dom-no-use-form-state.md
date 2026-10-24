# Rule: @eslint-react/dom-no-use-form-state

## Rule Description

useFormState from react-dom is superseded by React 19's useActionState from react.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-use-form-state': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {useFormState} from 'react-dom';

export function C() {
  const [state] = useFormState(() => null, null);
  return <p>{state}</p>;
}
```

## Good

```js
import {useActionState} from 'react';

export function C() {
  const [state] = useActionState(() => null, null);
  return <p>{state}</p>;
}
```
