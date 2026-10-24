# Rule: no-irregular-whitespace

## Rule Description

Forbids irregular whitespace such as non-breaking spaces in code, which is invisible and breaks copy-pasted code in confusing ways.

## Configuration

```js
{
  // ...
  'no-irregular-whitespace': [
    'error',
    {
      skipComments: false,
      skipJSXText: false,
      skipRegExps: false,
      skipStrings: true,
      skipTemplates: false,
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

<!-- prettier-ignore -->
```js
const value = 1;
```

## Good

<!-- prettier-ignore -->
```js
const value = 1;
```
