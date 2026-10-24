# Rule: no-func-assign

## Rule Description

Forbids reassigning a function declaration, which rewrites code other references may already use.

## Configuration

```js
{
  // ...
  'no-func-assign': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function handler() {
  return 1;
}
handler = () => 2;
```

## Good

```js
let handler = () => 1;
handler = () => 2;
```
