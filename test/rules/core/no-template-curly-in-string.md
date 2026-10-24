# Rule: no-template-curly-in-string

## Rule Description

Forbids ${placeholders} inside regular strings, where nothing is interpolated and the text prints literally.

## Configuration

```js
{
  // ...
  'no-template-curly-in-string': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = 'Hello ${name}';
```

## Good

```js
const label = `Hello ${name}`;
```
