# Rule: valid-typeof

## Rule Description

Forbids comparing typeof against misspelled or invalid type strings, which always evaluate the same way.

## Configuration

```js
{
  // ...
  'valid-typeof': [
    'error',
    {requireStringLiterals: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const isText = typeof value === 'strnig';
```

## Good

```js
const isText = typeof value === 'string';
```
