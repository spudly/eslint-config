# Rule: no-global-assign

## Rule Description

Forbids assigning to read-only global variables, which either throws or corrupts shared state.

## Configuration

```js
{
  // ...
  'no-global-assign': [
    'error',
    {exceptions: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
Object = replacement;
```

## Good

```js
const replacement = {};
```
