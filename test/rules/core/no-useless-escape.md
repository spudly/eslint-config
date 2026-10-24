# Rule: no-useless-escape

## Rule Description

Forbids backslash escapes that do nothing, like \a in a string, which often hide a misunderstanding of the literal.

## Configuration

```js
{
  // ...
  'no-useless-escape': [
    'error',
    {allowRegexCharacters: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const letter = '\a';
```

## Good

```js
const letter = 'a';
```
