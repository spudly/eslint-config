# Rule: import-x/no-named-default

## Rule Description

Forbids importing a module's default export through the named form {default as x}; use a plain default import.

## Configuration

```js
{
  // ...
  'import-x/no-named-default': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import {default as fs} from 'node:fs';
export const reader = fs.readFile;
```

## Good

```js
import fs from 'node:fs';
export const reader = fs.readFile;
```
