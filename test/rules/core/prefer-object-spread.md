# Rule: prefer-object-spread

## Rule Description

Prefers object spread over Object.assign with an empty target, which reads as data rather than procedure.

## Configuration

```js
{
  // ...
  'prefer-object-spread': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const copy = Object.assign({}, source);
```

## Good

```js
const copy = {...source};
```
