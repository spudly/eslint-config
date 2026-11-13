# Rule: no-implied-eval

## Rule Description

Forbids passing strings to setTimeout/setInterval or similar, which evaluates them like eval.

## Configuration

```js
{
  // ...
  'no-implied-eval': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
globalThis.setTimeout('run()', 100);
```

## Good

```js
globalThis.setTimeout(() => run(), 100);
```
