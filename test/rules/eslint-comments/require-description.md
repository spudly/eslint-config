# Rule: eslint-comments/require-description

## Rule Description

Requires every eslint-disable/enable comment to carry a `-- reason`, so suppressions explain themselves to the next reader.

## Configuration

```js
{
  // ...
  'eslint-comments/require-description': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
// eslint-disable-next-line no-console
console.log('ready');
```

## Good

```js
// eslint-disable-next-line no-console -- one-off CLI banner
console.log('ready');
```
