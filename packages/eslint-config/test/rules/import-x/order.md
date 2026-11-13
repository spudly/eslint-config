# Rule: import-x/order

## Rule Description

Requires import groups to appear in a canonical order — builtins, then external packages, then internal, parent, sibling, and index modules.

## Configuration

```js
{
  // ...
  'import-x/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      distinctGroup: true,
      sortTypesGroup: false,
      named: false,
      warnOnUnassignedImports: false,
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import local from './local';
import fs from 'node:fs';
export const io = [fs, local];
```

## Good

```js
import fs from 'node:fs';

import local from './local';
export const io = [fs, local];
```
