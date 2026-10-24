# Rule: no-nonoctal-decimal-escape

## Rule Description

Forbids \8 and \9 escapes in strings, a legacy quirk that does not mean what it looks like.

## Configuration

```js
{
  // ...
  'no-nonoctal-decimal-escape': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.cjs

## Bad

```js
const digit = '\8';
```

## Good

```js
const digit = '8';
```
