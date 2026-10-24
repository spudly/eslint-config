# Rule: no-import-assign

## Rule Description

Forbids reassigning or mutating an imported binding, which ES modules treat as read-only.

## Configuration

```js
{
  // ...
  'no-import-assign': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import fs from 'node:fs';
fs = createFs();
```

## Good

```js
import fs from 'node:fs';
export const reader = fs.readFile;
```
