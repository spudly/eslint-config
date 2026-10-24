# Rule: no-useless-concat

## Rule Description

Forbids concatenating two string literals, which should just be written as one literal.

## Configuration

```js
{
  // ...
  'no-useless-concat': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = 'read' + 'y';
```

## Good

```js
const label = 'ready';
```
