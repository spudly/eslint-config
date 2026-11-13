# Rule: unicorn/prefer-string-replace-all

## Rule Description

Prefers replaceAll over replace with a global regex when every occurrence should change.

## Configuration

```js
{
  // ...
  'unicorn/prefer-string-replace-all': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const cleaned = text.replace(/-/g, '_');
```

## Good

```js
const cleaned = text.replaceAll('-', '_');
```
