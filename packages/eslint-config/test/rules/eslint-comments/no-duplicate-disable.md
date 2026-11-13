# Rule: eslint-comments/no-duplicate-disable

## Rule Description

Forbids disabling the same rule twice in overlapping disable comments, which makes suppression state impossible to follow.

## Configuration

```js
{
  // ...
  'eslint-comments/no-duplicate-disable': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
/* eslint-disable no-console */
/* eslint-disable no-console */
console.log('ready');
```

## Good

```js
/* eslint-disable no-console */
console.log('ready');
```
