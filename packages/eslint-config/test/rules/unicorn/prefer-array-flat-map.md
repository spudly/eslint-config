# Rule: unicorn/prefer-array-flat-map

## Rule Description

Prefers Array#flatMap over a map followed by flat, which walks the array twice.

## Configuration

```js
{
  // ...
  'unicorn/prefer-array-flat-map': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const tags = items.map(item => item.tags).flat();
```

## Good

```js
const tags = items.flatMap(item => item.tags);
```
