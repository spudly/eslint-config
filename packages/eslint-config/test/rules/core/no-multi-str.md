# Rule: no-multi-str

## Rule Description

Forbids backslash line continuations in string literals, which drop the newline and surrounding whitespace in surprising ways.

## Configuration

```js
{
  // ...
  'no-multi-str': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const text =
  'first\
second';
```

## Good

```js
const text = `first
second`;
```
