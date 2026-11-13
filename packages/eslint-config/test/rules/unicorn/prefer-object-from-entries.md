# Rule: unicorn/prefer-object-from-entries

## Rule Description

Prefers Object.fromEntries over building an object by assigning keys in a reduce or loop.

## Configuration

```js
{
  // ...
  'unicorn/prefer-object-from-entries': [
    'error',
    {functions: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const record = entries.reduce(
  (result, [key, value]) => Object.assign(result, {[key]: value}),
  {},
);
```

## Good

```js
const record = Object.fromEntries(entries);
```
