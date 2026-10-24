# Rule: unicorn/prefer-string-slice

## Rule Description

Prefers slice over substr and substring, whose argument meanings differ in ways nobody remembers.

## Configuration

```js
{
  // ...
  'unicorn/prefer-string-slice': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const part = text.substr(1, 3);
```

## Good

```js
const part = text.slice(1, 4);
```
