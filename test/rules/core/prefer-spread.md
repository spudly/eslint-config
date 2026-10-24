# Rule: prefer-spread

## Rule Description

Prefers spreading an array into a call over .apply(), which separates the arguments from the call site.

## Configuration

```js
{
  // ...
  'prefer-spread': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const result = combine.apply(null, inputs);
```

## Good

```js
const result = combine(...inputs);
```
