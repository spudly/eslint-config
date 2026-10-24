# Rule: eslint-comments/no-unused-enable

## Rule Description

Forbids eslint-enable comments for rules that are not currently disabled, which are dead directives left behind by edits.

## Configuration

```js
{
  // ...
  'eslint-comments/no-unused-enable': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
/* eslint-enable no-console */
console.log('ready');
```

## Good

```js
console.log('ready');
```
