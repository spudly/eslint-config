# Rule: unicorn/prefer-string-raw

## Rule Description

Prefers String.raw for strings full of escaped backslashes, like regex sources and Windows paths, so the escapes stop doubling.

## Configuration

```js
{
  // ...
  'unicorn/prefer-string-raw': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = '\\d+\\.\\d+';
```

## Good

```js
const pattern = String.raw`\d+\.\d+`;
```
