# Rule: unicorn/prefer-set-has

## Rule Description

Prefers Set#has over Array#includes for membership checks against a named collection, which is both faster and clearer about intent.

## Configuration

```js
{
  // ...
  'unicorn/prefer-set-has': [
    'error',
    {minimumItems: 0},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const allowed = ['read', 'write', 'admin', 'audit'];
const canRead = allowed.includes('read');
const canWrite = allowed.includes('write');
```

## Good

```js
const allowed = new Set(['read', 'write', 'admin', 'audit']);
const canRead = allowed.has('read');
const canWrite = allowed.has('write');
```
