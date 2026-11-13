# Rule: no-useless-call

## Rule Description

Forbids .call()/.apply() with a null or undefined receiver on plain functions, where a normal call does the same thing.

## Configuration

```js
{
  // ...
  'no-useless-call': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const result = compute.call(null, input);
```

## Good

```js
const result = compute(input);
```
