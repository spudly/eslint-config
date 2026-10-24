# Rule: unicorn/prefer-export-from

## Rule Description

Prefers `export {x} from` over importing a binding only to re-export it.

## Configuration

```js
{
  // ...
  'unicorn/prefer-export-from': [
    'error',
    {checkUsedVariables: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import {createStore} from './store';
export {createStore};
```

## Good

```js
export {createStore} from './store';
```
