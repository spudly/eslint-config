# Rule: no-misleading-character-class

## Rule Description

Forbids character classes containing multi-code-point characters without the unicode flag, where the class does not match what it appears to match.

## Configuration

```js
{
  // ...
  'no-misleading-character-class': [
    'error',
    {allowEscape: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = /[😀]/;
```

## Good

```js
const pattern = /[😀]/u;
```
