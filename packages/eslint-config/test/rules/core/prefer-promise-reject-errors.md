# Rule: prefer-promise-reject-errors

## Rule Description

Requires Promise.reject to be given an Error in plain JS files, so rejections carry a stack.

## Configuration

```js
{
  // ...
  'prefer-promise-reject-errors': [
    'error',
    {allowEmptyReject: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
const task = Promise.reject('failed');
```

## Good

```js
const task = Promise.reject(new Error('failed'));
```
