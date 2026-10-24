# Rule: dot-notation

## Rule Description

Prefers dot notation over bracket notation for properties that are valid identifiers.

## Configuration

```js
{
  // ...
  'dot-notation': [
    'warn',
    {allowKeywords: true, allowPattern: ''},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
const mode = settings['mode'];
```

## Good

```js
const mode = settings.mode;
```
