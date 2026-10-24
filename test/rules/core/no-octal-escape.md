# Rule: no-octal-escape

## Rule Description

Forbids octal escapes like \141 in strings, which are deprecated and hard to read.

## Configuration

```js
{
  // ...
  'no-octal-escape': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.cjs

## Bad

```js
const letter = '\141';
```

## Good

```js
const letter = '\u0061';
```
