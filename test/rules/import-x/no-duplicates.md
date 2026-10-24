# Rule: import-x/no-duplicates

## Rule Description

Forbids importing the same module more than once; merge the imports so each dependency appears once.

## Configuration

```js
{
  // ...
  'import-x/no-duplicates': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import fs from 'node:fs';
import {readFile} from 'node:fs';
export const read = readFile;
export default fs;
```

## Good

```js
import fs, {readFile} from 'node:fs';
export const read = readFile;
export default fs;
```
