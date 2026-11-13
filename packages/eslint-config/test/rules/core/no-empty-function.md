# Rule: no-empty-function

## Rule Description

Warns on empty functions in plain JS files, which usually mean an unimplemented stub or a leftover.

## Configuration

```js
{
  // ...
  'no-empty-function': [
    'warn',
    {allow: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
function noop() {}
```

## Good

```js
function noop() {
  return 0;
}
```
