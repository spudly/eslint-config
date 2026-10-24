# Rule: no-control-regex

## Rule Description

Forbids control characters in regular expressions, which are invisible in source and usually a typo for an escape.

## Configuration

```js
{
  // ...
  'no-control-regex': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = /\x1f/;
```

## Good

```js
const pattern = /\s/;
```
