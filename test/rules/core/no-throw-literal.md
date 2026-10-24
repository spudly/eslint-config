# Rule: no-throw-literal

## Rule Description

Forbids throwing literals like strings in plain JS files; throw Error objects so failures carry a stack.

## Configuration

```js
{
  // ...
  'no-throw-literal': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
throw 'failed';
```

## Good

```js
throw new Error('failed');
```
