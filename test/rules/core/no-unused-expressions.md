# Rule: no-unused-expressions

## Rule Description

Forbids expression statements that compute something and throw it away in plain JS files.

## Configuration

```js
{
  // ...
  'no-unused-expressions': [
    'error',
    {
      allowShortCircuit: false,
      allowTernary: false,
      allowTaggedTemplates: false,
      enforceForJSX: false,
      ignoreDirectives: false,
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
const count = 1;
count;
```

## Good

```js
let count = 1;
count += 1;
```
