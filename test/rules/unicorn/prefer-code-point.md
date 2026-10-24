# Rule: unicorn/prefer-code-point

## Rule Description

Prefers codePointAt/fromCodePoint over charCodeAt/fromCharCode, which mishandle characters outside the basic multilingual plane.

## Configuration

```js
{
  // ...
  'unicorn/prefer-code-point': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const letter = String.fromCharCode(0x41);
```

## Good

```js
const letter = String.fromCodePoint(0x41);
```
