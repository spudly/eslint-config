# Rule: no-octal

## Rule Description

Forbids legacy octal literals like 0755, which are easy to misread as decimal numbers.

## Configuration

```js
{
  // ...
  'no-octal': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.cjs

## Bad

```js
const mode = 0755;
```

## Good

```js
const mode = 0o755;
```
