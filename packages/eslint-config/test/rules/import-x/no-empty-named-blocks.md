# Rule: import-x/no-empty-named-blocks

## Rule Description

Forbids empty named import and export blocks, which are leftover plumbing that imports nothing.

## Configuration

```js
{
  // ...
  'import-x/no-empty-named-blocks': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import {} from './x';
export const ready = true;
```

## Good

```js
import './x';
export const ready = true;
```
