# Rule: no-regex-spaces

## Rule Description

Forbids runs of literal spaces in a regex, where a quantifier or explicit space is clearer.

## Configuration

```js
{
  // ...
  'no-regex-spaces': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = /a  b/;
```

## Good

```js
const pattern = /a {2}b/;
```
