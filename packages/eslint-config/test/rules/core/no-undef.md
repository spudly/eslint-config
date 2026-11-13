# Rule: no-undef

## Rule Description

Forbids referencing undeclared variables in plain JS files, where there is no type checker to catch the typo.

## Configuration

```js
{
  // ...
  'no-undef': [
    'error',
    {typeof: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
const doubled = missing * 2;
```

## Good

```js
const input = 2;
const doubled = input * 2;
```
