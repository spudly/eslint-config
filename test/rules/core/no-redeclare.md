# Rule: no-redeclare

## Rule Description

Forbids declaring the same variable twice in one scope in plain JS files, where the second declaration silently replaces the first.

## Configuration

```js
{
  // ...
  'no-redeclare': [
    'error',
    {builtinGlobals: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
var total = 1;
var total = 2;
```

## Good

```js
let total = 1;
total = 2;
```
